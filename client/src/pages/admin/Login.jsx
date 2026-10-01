import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BRAND } from '../../config.js';
import api from '../../api/axios.js';

export default function Login() {
  const { login, updateUser } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' | 'forgot'
  const [mode, setMode] = useState('login');

  // Login form state
  const [form, setForm] = useState({ email: 'mydesk@nmc.com', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const emailInputRef = useRef(null);

  // Forgot password & OTP state
  const [forgotEmail, setForgotEmail] = useState('mydesk@nmc.com');
  const [registeredPhone, setRegisteredPhone] = useState('+91 7069826082');
  const [otpStep, setOtpStep] = useState(1); // 1 = request OTP, 2 = verify & set new password
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [demoOtpNotice, setDemoOtpNotice] = useState('');

  useEffect(() => {
    document.title = mode === 'login' ? 'NMC Admin | Sign In' : 'NMC Admin | Reset Password';
    if (mode === 'login') {
      emailInputRef.current?.focus();
    }
  }, [mode]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Standard Login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setBusy(false);
    }
  };

  // Step 1: Send OTP to Phone +91 7069826082
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setBusy(true);
    setForgotError('');
    setForgotSuccess('');
    setDemoOtpNotice('');

    try {
      const res = await api.post('/auth/forgot-password', {
        email: forgotEmail,
        phone: registeredPhone,
      });

      if (res.data.phone) {
        setRegisteredPhone(res.data.phone);
      }

      setForgotSuccess(res.data.message || `OTP sent to ${res.data.phone || registeredPhone}`);
      if (res.data.demoOtp) {
        setDemoOtpNotice(`(Security verification code: ${res.data.demoOtp})`);
      }

      setOtpStep(2);
      setCountdown(60); // 60 seconds cooldown for resend
    } catch (err) {
      setForgotError(err.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setForgotError('');
    setForgotSuccess('');

    if (!otpCode || otpCode.trim().length < 4) {
      setForgotError('Please enter the verification OTP code.');
      setBusy(false);
      return;
    }

    if (newPassword.length < 8) {
      setForgotError('New password must be at least 8 characters long.');
      setBusy(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('New password and confirmation password do not match.');
      setBusy(false);
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', {
        email: forgotEmail,
        otp: otpCode.trim(),
        newPassword,
        confirmPassword,
      });

      // If token is returned, immediately log in
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        updateUser(res.data.user, res.data.token);
        setForgotSuccess('Password reset successfully! Redirecting to workspace…');
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        setForgotSuccess('Password reset successfully! You can now sign in.');
        setTimeout(() => {
          setMode('login');
          setOtpStep(1);
          setForm((prev) => ({ ...prev, password: '' }));
        }, 2000);
      }
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="admin-panel notranslate grid min-h-screen place-items-center bg-[#0d1e17] px-4 py-8"
      translate="no"
      dir="ltr"
      lang="en"
    >
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-3">
            <img
              src="/NMC logo.png"
              alt={`${BRAND.name} — ${BRAND.tagline}`}
              className="h-14 w-auto object-contain bg-white/10 rounded-xl p-1.5 border border-white/15"
            />
            <div className="flex flex-col">
              <span className="font-display text-xl font-extrabold text-white tracking-wide">
                {BRAND.fullName}
              </span>
              <span className="text-[11px] font-mono text-gold uppercase tracking-wider font-semibold">
                Administrative Control Panel
              </span>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-white/15 bg-white p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {mode === 'login' ? (
            /* ================= SIGN IN VIEW ================= */
            <div>
              <div className="mb-5">
                <h1 className="font-display text-xl font-bold text-ink">Admin Sign In</h1>
                <p className="mt-1 text-xs text-ink/60">
                  Enter your credentials to access catalog, inquiries & settings.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-semibold text-rose-800 flex items-center gap-2 animate-shake">
                  <span>✕</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="label text-xs font-bold text-ink/80" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    ref={emailInputRef}
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="field w-full text-sm font-mono"
                    placeholder=""
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="label text-xs font-bold text-ink/80 m-0" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setOtpStep(1);
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                      className="text-xs font-semibold text-forest hover:text-gold transition cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="field w-full text-sm font-mono pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-xs text-ink/50 hover:text-ink cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-primary w-full text-sm font-bold flex items-center justify-center gap-2 py-2.5 shadow-md"
                  >
                    {busy ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Signing in…</span>
                      </>
                    ) : (
                      <span>Sign in to Dashboard →</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Discreet SMS OTP recovery prompt */}
              <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between text-[11px] text-ink/50">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>SMS OTP Recovery Active</span>
                </span>
                <span className="font-mono text-ink/70">+91 7069826082</span>
              </div>
            </div>
          ) : (
            /* ================= FORGOT PASSWORD VIEW ================= */
            <div>
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-gold transition cursor-pointer"
                >
                  <span>←</span>
                  <span>Back to Sign In</span>
                </button>
                <span className="rounded-full bg-forest/10 text-forest border border-forest/20 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                  OTP Recovery
                </span>
              </div>

              <div className="mb-5">
                <h1 className="font-display text-xl font-bold text-ink">Reset Admin Password</h1>
                <p className="mt-1 text-xs text-ink/60">
                  {otpStep === 1
                    ? 'Verify your identity using a 6-digit OTP sent to your registered mobile number.'
                    : 'Enter the verification OTP and choose a new password.'}
                </p>
              </div>

              {forgotSuccess && (
                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span>✓</span>
                    <span>{forgotSuccess}</span>
                  </div>
                  {demoOtpNotice && (
                    <p className="font-mono text-emerald-900 font-bold bg-emerald-100/60 p-1 rounded">
                      {demoOtpNotice}
                    </p>
                  )}
                </div>
              )}

              {forgotError && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-semibold text-rose-800 flex items-center gap-1.5">
                  <span>✕</span>
                  <span>{forgotError}</span>
                </div>
              )}

              {otpStep === 1 ? (
                /* STEP 1: Request OTP */
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="label text-xs font-bold text-ink/80" htmlFor="forgot-email">
                      Admin Email ID
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="field w-full text-sm font-mono"
                      placeholder="admin@nmc.com"
                    />
                  </div>

                  <div className="rounded-xl border border-line bg-[#f8f6f0] p-3.5 flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div className="text-xs">
                      <p className="font-bold text-ink">Registered SMS Destination</p>
                      <p className="font-mono text-emerald-800 font-bold text-sm tracking-wide">
                        {registeredPhone}
                      </p>
                      <p className="text-[11px] text-ink/50 mt-0.5">
                        A 6-digit one-time passcode will be dispatched to this number.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-primary w-full text-sm font-bold flex items-center justify-center gap-2 py-2.5 shadow-md"
                    >
                      {busy ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Sending OTP…</span>
                        </>
                      ) : (
                        <>
                          <span>📲</span>
                          <span>Send 6-Digit OTP to Phone</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: Enter OTP & New Password */
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="label text-xs font-bold text-ink/80 m-0" htmlFor="otp-code">
                        6-Digit OTP Code <span className="text-rose-500">*</span>
                      </label>
                      {countdown > 0 ? (
                        <span className="text-[11px] font-mono text-ink/40">
                          Resend in {countdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          disabled={busy}
                          className="text-[11px] font-bold text-forest hover:text-gold transition cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <input
                      id="otp-code"
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="field w-full text-center text-xl font-mono font-bold tracking-[0.4em] py-2"
                      placeholder="••••••"
                    />
                    <p className="mt-1 text-[11px] text-ink/50 text-center">
                      Sent to registered mobile <strong className="font-mono text-ink">{registeredPhone}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-ink/80" htmlFor="reset-new-password">
                      New Password (min 8 chars) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reset-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="field w-full text-sm font-mono pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-xs text-ink/50 hover:text-ink cursor-pointer"
                      >
                        {showNewPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-ink/80" htmlFor="reset-confirm-password">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reset-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="field w-full text-sm font-mono pr-10"
                        placeholder="Re-enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-xs text-ink/50 hover:text-ink cursor-pointer"
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-primary w-full text-sm font-bold flex items-center justify-center gap-2 py-2.5 shadow-md"
                    >
                      {busy ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Resetting Password…</span>
                        </>
                      ) : (
                        <>
                          <span>🔒</span>
                          <span>Reset Password & Sign In</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="w-full text-center text-xs font-semibold text-ink/60 hover:text-ink py-1.5 transition cursor-pointer"
                    >
                      Change phone number or re-enter email
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Support Info */}
        <p className="mt-4 text-center text-xs text-white/50">
          Nirmala Multi Trading Co. • Authorized Administration Only
        </p>
      </div>
    </div>
  );
}
