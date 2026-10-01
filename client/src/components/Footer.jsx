import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';
import api, { asset } from '../api/axios.js';

export default function Footer() {
  const { t, language } = useLanguage();
  const { footer } = useSiteContent();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  // Global secret shortcut Ctrl + Shift + A or Cmd + Shift + A to open admin login
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Discrete secret entry: clicking copyright 3 times in quick succession opens admin login
  const handleSecretClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      navigate('/admin/login');
      return;
    }

    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 700);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.post('/subscribers', { email: email.trim(), source: 'footer' });
      setStatus({
        type: 'success',
        message: res.data?.message || 'Subscribed successfully! Confirmation email dispatched.',
        previewUrl: res.data?.previewUrl,
      });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Subscription failed. Please check your email and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const brandFullName = footer?.brandFullName || BRAND.fullName;
  const brandBlurb = footer?.blurb || BRAND.blurb;
  const brandEmail = footer?.email || BRAND.email;
  const brandPhone = footer?.phone || BRAND.phone;
  const brandAddress = footer?.address || BRAND.address;
  const isDefaultInquiryCta =
    !footer?.inquiryCtaText ||
    footer.inquiryCtaText.trim() === '' ||
    footer.inquiryCtaText.trim().toLowerCase() === 'request fob / cif quote' ||
    footer.inquiryCtaText.trim().toLowerCase() === 'request a quote' ||
    footer.inquiryCtaText.trim().toLowerCase() === 'get a quote';
  const inquiryText = (!isDefaultInquiryCta && language === 'en')
    ? footer.inquiryCtaText
    : (t('getQuote') || footer?.inquiryCtaText || 'Get a quote');
  const inquiryLink = footer?.inquiryCtaLink || '/inquiry';
  const logoSrc = footer?.logo
    ? (footer.logo.startsWith('http') || footer.logo.startsWith('/')
        ? footer.logo
        : asset(footer.logo))
    : '/NMC logo.png';

  const defaultBadgeEn = 'Exporter Market Intelligence';
  const defaultTitleEn = 'Get Instant Agro Market & Harvest Updates';
  const defaultDescEn = 'Subscribe to receive immediate alerts when new agro commodities, spices, or market trade reports are published.';

  const isDefaultBadge = !footer?.newsletterBadge || footer.newsletterBadge.trim() === '' || footer.newsletterBadge === defaultBadgeEn;
  const newsletterBadge = (!isDefaultBadge && language === 'en')
    ? footer.newsletterBadge
    : (t('newsletterTitle') || footer?.newsletterBadge || defaultBadgeEn);

  const isDefaultTitle = !footer?.newsletterTitle || footer.newsletterTitle.trim() === '' || footer.newsletterTitle === defaultTitleEn;
  const newsletterTitle = (!isDefaultTitle && language === 'en')
    ? footer.newsletterTitle
    : (t('stayUpdated') || footer?.newsletterTitle || defaultTitleEn);

  const isDefaultDesc = !footer?.newsletterDesc || footer.newsletterDesc.trim() === '' || footer.newsletterDesc === defaultDescEn;
  const newsletterDesc = (!isDefaultDesc && language === 'en')
    ? footer.newsletterDesc
    : (t('newsletterDesc') || footer?.newsletterDesc || defaultDescEn);

  const badges = Array.isArray(footer?.badges) && footer.badges.length > 0
    ? footer.badges
    : ['APEDA REG.', 'SPICE BOARD INDIA', 'FSSAI CERTIFIED', 'MUNDRA PORT (INMUN1)'];

  const quickLinks = (Array.isArray(footer?.quickLinks) && footer.quickLinks.length > 0
    ? footer.quickLinks.filter((l) => l.isActive !== false)
    : [
        { label: 'Products', to: '/products', order: 1 },
        { label: 'Partners', to: '/partners', order: 2 },
        { label: 'Brochures', to: '/brochures', order: 3 },
        { label: 'Blog', to: '/blog', order: 4 },
      ]
  ).slice().sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const getQuickLinkLabel = (label) => {
    if (!label) return '';
    const key = label.toLowerCase().trim().replace(/[\s\-_]+/g, '');
    return t(key) || t(label.toLowerCase().trim()) || label;
  };

  const isDefaultCopyright = !footer?.copyrightText || footer.copyrightText.trim() === '' || footer.copyrightText.toLowerCase().includes('all rights reserved');
  const copyrightText = (!isDefaultCopyright && language === 'en')
    ? footer.copyrightText
    : `${brandFullName}. ${t('allRightsReserved') || 'All rights reserved.'}`;

  const defaultTaglineEn = 'Certified Indian Agro-Food Exporter';
  const isDefaultTagline = !footer?.bottomTagline || footer.bottomTagline.trim() === '' || footer.bottomTagline === defaultTaglineEn;
  const bottomTagline = (!isDefaultTagline && language === 'en')
    ? footer.bottomTagline
    : (t('certifiedAgroExporter') || footer?.bottomTagline || defaultTaglineEn);

  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper/80">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="container-x py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-gold">
                <span>✉️</span> {newsletterBadge}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                {newsletterTitle}
              </h3>
              <p className="mt-1.5 text-sm text-paper/70 leading-relaxed">
                {newsletterDesc}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full max-w-md">
              <div className="relative flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder={t('enterYourEmail') || 'Enter your business email…'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-paper/40 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-gold px-6 py-3 text-sm font-bold text-ink shadow-md transition hover:bg-gold/90 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                      <span>{t('subscribing') || 'Joining…'}</span>
                    </span>
                  ) : (
                    <span>{t('subscribe') || 'Subscribe'} →</span>
                  )}
                </button>
              </div>

              {status.message && (
                <div className="mt-2.5 space-y-1">
                  <p
                    className={`text-xs font-medium ${
                      status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {status.message}
                  </p>
                  {status.previewUrl && (
                    <a
                      href={status.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-[11px] text-gold underline hover:text-white transition"
                    >
                      🔗 View Delivered Email in Test Mailbox ↗
                    </a>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <img
              src={logoSrc}
              alt={brandFullName}
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.target.src = '/NMC logo.png';
              }}
            />
            <span className="flex flex-col font-display leading-tight">
              <strong className="text-lg font-extrabold text-paper">{brandFullName}</strong>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/65">{brandBlurb}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono text-paper/50">
            {badges.map((badge, idx) => (
              <span key={idx} className="rounded bg-white/5 px-2 py-0.5 border border-white/10">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold font-mono">{t('explore') || 'Explore'}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {quickLinks.map((ql, idx) => (
              <li key={idx}>
                <Link to={ql.to} className="hover:text-paper transition">
                  {getQuickLinkLabel(ql.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold font-mono">{t('contact') || 'Contact'}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {brandEmail && (
              <li>
                <a href={`mailto:${brandEmail}`} className="hover:text-paper transition">
                  {brandEmail}
                </a>
              </li>
            )}
            {brandPhone && <li>{brandPhone}</li>}
            {brandAddress && <li>{brandAddress}</li>}
            <li className="pt-1">
              <Link to={inquiryLink} className="text-gold font-semibold inline-flex items-center gap-1 select-none transition-colors hover:text-white">
                <span>{inquiryText}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-paper/50 sm:flex-row">
          {/* Secret access: clicking copyright 3 times in quick succession silently opens /admin/login */}
          <span
            onClick={handleSecretClick}
            className="cursor-default select-none transition-colors hover:text-paper/70"
            title=""
          >
            © {BRAND.year} {copyrightText}
          </span>
          <span className="font-mono text-[11px] text-paper/30">
            {bottomTagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
