import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, sendEmail } from '../utils/sendEmail.js';
import { sendSmsOtp } from '../utils/sendSms.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'nmc_export_jwt_secret_key_2026';

export const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone || '+91 7069826082',
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

// Helper to mask phone numbers safely for UI (e.g. +91 70698****82)
const maskPhone = (phone) => {
  if (!phone) return '+91 70698****82';
  const clean = phone.replace(/\s+/g, '');
  if (clean.length < 8) return clean;
  return `${clean.slice(0, clean.length - 6)}****${clean.slice(-2)}`;
};

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Incorrect email or password.');
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '+91 7069826082',
      role: user.role,
    },
  });
});

// GET /api/auth/me or /api/auth/profile
export const getMe = asyncHandler(async (req, res) => {
  const freshUser = await User.findById(req.user._id);
  if (!freshUser) {
    res.status(401);
    throw new Error('User record not found in MongoDB.');
  }
  res.json({
    user: {
      id: freshUser._id,
      name: freshUser.name,
      email: freshUser.email,
      phone: freshUser.phone || '+91 7069826082',
      role: freshUser.role,
      createdAt: freshUser.createdAt,
      updatedAt: freshUser.updatedAt,
    },
  });
});

// PUT /api/auth/profile
// Allows admin to update name, email, phone number, and change password
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('Admin user not found.');
  }

  // 1. Update basic info if provided
  if (name && name.trim()) {
    user.name = name.trim();
  }

  if (phone !== undefined) {
    user.phone = phone.trim() || '+91 7069826082';
  }

  // 2. Update email if changed
  if (email && email.toLowerCase().trim() !== user.email) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
    if (existing) {
      res.status(400);
      throw new Error('This email address is already in use by another account.');
    }
    user.email = cleanEmail;
  }

  // 3. Password change handling
  let passwordChanged = false;
  if (newPassword || currentPassword) {
    if (!currentPassword) {
      res.status(400);
      throw new Error('Please enter your current password to authorize password change.');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Incorrect current password.');
    }

    if (!newPassword || newPassword.length < 8) {
      res.status(400);
      throw new Error('New password must be at least 8 characters long.');
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      res.status(400);
      throw new Error('New password and confirmation password do not match.');
    }

    user.password = newPassword;
    passwordChanged = true;
  }

  await user.save();

  // Fresh token with updated details
  const token = signToken(user);

  res.json({
    message: passwordChanged
      ? 'Profile and password updated successfully!'
      : 'Admin profile updated successfully!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      updatedAt: user.updatedAt,
    },
  });
});

// POST /api/auth/forgot-password
// Sends OTP to registered phone (+91 7069826082) & email
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;

  let query = {};
  if (email && email.trim()) {
    query.email = email.toLowerCase().trim();
  } else if (phone && phone.trim()) {
    query.phone = phone.trim();
  } else {
    // Default to the admin account
    query.role = 'admin';
  }

  let user = await User.findOne(query);

  // If specific query didn't match, fallback to the first admin
  if (!user) {
    user = await User.findOne({ role: 'admin' });
  }

  if (!user) {
    res.status(404);
    throw new Error('No administrator account found.');
  }

  // Ensure default phone number is populated if missing
  if (!user.phone) {
    user.phone = '+91 7069826082';
  }

  // Generate 6-digit OTP code & 10-minute expiry
  const otp = user.generateResetOtp();
  await user.save();

  const targetPhone = user.phone || '+91 7069826082';

  // 1. Send SMS OTP
  const smsResult = await sendSmsOtp({
    phone: targetPhone,
    otp,
    purpose: 'NMC Admin Password Reset',
  });

  // 2. Also send Email backup if email transport exists
  try {
    await sendEmail({
      to: user.email,
      subject: `NMC Admin Password Reset Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #faf9f6;">
          <h2 style="color: #1a3328; margin-top: 0;">NMC Admin Security</h2>
          <p style="color: #374151; font-size: 15px;">You requested a password reset for your NMC Admin account.</p>
          <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #b8860b;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px;">This code is valid for 10 minutes. Sent to registered mobile: <strong>${targetPhone}</strong>.</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">If you did not request this, please ignore this email or review your account security.</p>
        </div>
      `,
      text: `Your NMC Admin password reset OTP is: ${otp}. Valid for 10 minutes. Sent to registered mobile: ${targetPhone}.`,
    }).catch((err) => console.log('Email dispatch note:', err.message));
  } catch {}

  res.json({
    message: `Verification code sent to registered number ${maskPhone(targetPhone)}.`,
    phone: targetPhone,
    maskedPhone: maskPhone(targetPhone),
    email: user.email,
    // Provide OTP in response when in local / sandbox mode or when SMS API key isn't configured
    demoOtp: process.env.NODE_ENV !== 'production' || !process.env.FAST2SMS_API_KEY ? otp : undefined,
  });
});

// POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp, email, phone } = req.body;

  if (!otp || !otp.trim()) {
    res.status(400);
    throw new Error('Please enter the 6-digit OTP code.');
  }

  const cleanOtp = otp.trim();

  let query = {
    resetOtp: cleanOtp,
    resetOtpExpires: { $gt: Date.now() },
  };

  if (email && email.trim()) {
    query.email = email.toLowerCase().trim();
  }

  const user = await User.findOne(query);

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP code. Please request a new OTP.');
  }

  res.json({
    success: true,
    message: 'OTP verified successfully. You may now enter your new password.',
  });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { otp, email, newPassword, confirmPassword } = req.body;

  if (!otp || !otp.trim()) {
    res.status(400);
    throw new Error('OTP verification code is required.');
  }

  if (!newPassword || newPassword.length < 8) {
    res.status(400);
    throw new Error('New password must be at least 8 characters long.');
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match.');
  }

  const cleanOtp = otp.trim();

  let query = {
    resetOtp: cleanOtp,
    resetOtpExpires: { $gt: Date.now() },
  };

  if (email && email.trim()) {
    query.email = email.toLowerCase().trim();
  }

  const user = await User.findOne(query).select('+password');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP code. Please request a new OTP.');
  }

  // Update password and clear reset fields
  user.password = newPassword;
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  // Create immediate session token so user can proceed
  const token = signToken(user);

  res.json({
    success: true,
    message: 'Password reset successfully! You can now sign in with your new password.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// GET /api/auth/refresh (issues a fresh JWT with latest MongoDB data)
export const refreshToken = asyncHandler(async (req, res) => {
  const freshUser = await User.findById(req.user._id);
  if (!freshUser) {
    res.status(401);
    throw new Error('User record no longer exists.');
  }
  const token = signToken(freshUser);
  res.json({
    token,
    user: {
      id: freshUser._id,
      name: freshUser.name,
      email: freshUser.email,
      phone: freshUser.phone || '+91 7069826082',
      role: freshUser.role,
    },
  });
});
