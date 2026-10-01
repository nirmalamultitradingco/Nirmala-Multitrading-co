import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios.js';

export default function Profile() {
  const { user, updateUser, refreshProfile } = useAuth();

  // Basic Info Form
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // UI state
  const [profileBusy, setProfileBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Sync profile data on mount or when auth user changes
  useEffect(() => {
    document.title = 'NMC Admin | Admin Profile & Security';

    const loadProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        const u = res.data.user;
        setProfileForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '+91 7069826082',
        });
      } catch {
        if (user) {
          setProfileForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '+91 7069826082',
          });
        }
      }
    };
    loadProfile();
  }, [user]);

  // Handle Profile Update (Name, Email, Phone)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileBusy(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await api.put('/auth/profile', {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      });

      updateUser(res.data.user, res.data.token);
      setProfileSuccess(res.data.message || 'Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 6000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileBusy(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordBusy(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      setPasswordBusy(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      setPasswordBusy(false);
      return;
    }

    try {
      const res = await api.put('/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      updateUser(res.data.user, res.data.token);
      setPasswordSuccess(res.data.message || 'Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(''), 6000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-forest text-gold flex items-center justify-center text-2xl font-bold font-mono shadow-md border-2 border-gold/40">
                {profileForm.name ? profileForm.name[0].toUpperCase() : 'A'}
              </div>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Account" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  {profileForm.name || 'Admin Profile'}
                </h1>
                <span className="rounded-full bg-forest/10 text-forest border border-forest/20 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm text-ink/60">
                Manage your administrative login credentials, email ID, mobile phone number, and security password.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#f8f6f0] border border-line/60 rounded-xl px-3.5 py-2">
            <span className="text-xl">🛡️</span>
            <div className="text-xs">
              <p className="font-bold text-ink">Two-Factor OTP Recovery</p>
              <p className="font-mono text-emerald-700 font-semibold">{profileForm.phone || '+91 7069826082'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Admin Profile & Contact Info */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-line/60">
              <span className="text-lg">👤</span>
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  Contact & Profile Information
                </h2>
                <p className="text-xs text-ink/60">
                  Update your admin display name, official email, and SMS OTP phone number.
                </p>
              </div>
            </div>

            {profileSuccess && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <span>✓</span>
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <span>✕</span>
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} id="profile-form" className="mt-5 space-y-4">
              <div>
                <label className="label text-xs font-bold text-ink/80" htmlFor="admin-name">
                  Full Name / Admin Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="admin-name"
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="field w-full text-sm"
                  placeholder="e.g. NMC Admin"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-ink/80" htmlFor="admin-email">
                  Admin Email ID (Login Username) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="field w-full text-sm font-mono"
                  placeholder="admin@nmc.com"
                />
                <p className="mt-1 text-[11px] text-ink/50">
                  This email is used to log in to the admin panel and receive security alerts.
                </p>
              </div>

              <div>
                <label className="label text-xs font-bold text-ink/80" htmlFor="admin-phone">
                  Registered Mobile Phone (For Forgot Password OTP) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="admin-phone"
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="field w-full text-sm font-mono pl-9"
                    placeholder="+91 7069826082"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-ink/40 pointer-events-none">📱</span>
                </div>
                <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                  ✓ OTP codes for password reset will be sent directly to this mobile number via SMS.
                </p>
              </div>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-line/60">
            <button
              type="submit"
              form="profile-form"
              disabled={profileBusy}
              className="btn-primary w-full text-xs font-bold flex items-center justify-center gap-2 py-2.5"
            >
              {profileBusy ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving Profile…</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Profile Details</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 2: Change Password */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-line/60">
              <span className="text-lg">🔑</span>
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  Change Admin Password
                </h2>
                <p className="text-xs text-ink/60">
                  Update your admin portal sign-in password with your current password.
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <span>✓</span>
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <span>✕</span>
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} id="password-form" className="mt-5 space-y-4">
              <div>
                <label className="label text-xs font-bold text-ink/80" htmlFor="current-password">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="field w-full text-sm font-mono pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-2.5 text-xs text-ink/50 hover:text-ink cursor-pointer"
                  >
                    {showCurrent ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold text-ink/80" htmlFor="new-password">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="field w-full text-sm font-mono pr-10"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-xs text-ink/50 hover:text-ink cursor-pointer"
                  >
                    {showNew ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold text-ink/80" htmlFor="confirm-password">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="field w-full text-sm font-mono pr-10"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-xs text-ink/50 hover:text-ink cursor-pointer"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-line/60">
            <button
              type="submit"
              form="password-form"
              disabled={passwordBusy}
              className="w-full rounded-xl bg-forest hover:bg-[#0d1e17] text-white border border-gold/40 px-4 py-2.5 text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              {passwordBusy ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating Password…</span>
                </>
              ) : (
                <>
                  <span>🔒</span>
                  <span>Update Admin Password</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security Info Card */}
      <div className="rounded-2xl border border-gold/40 bg-gold/5 p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div className="text-xs text-ink/80 space-y-1">
            <p className="font-bold text-ink text-sm">Forgot Password & Security Information</p>
            <p>
              If you ever forget your password, click the <strong>&quot;Forgot Password?&quot;</strong> link on the login page.
              The system will instantly generate a secure 6-digit OTP code and deliver it to your registered phone number{' '}
              <strong className="font-mono text-forest">{profileForm.phone || '+91 7069826082'}</strong> and send a verification backup to your email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
