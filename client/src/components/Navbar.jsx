import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';
import { asset } from '../api/axios.js';

const defaultNav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/partners', label: 'Partners' },
  { to: '/brochures', label: 'Brochures' },
  { to: '/blog', label: 'Blog' },
];

const getNavLabel = (n, t) => {
  // If the user provided a custom label different from standard, prefer that
  switch (n.to) {
    case '/':
      return n.label && n.label !== 'Home' ? n.label : (t('home') || 'Home');
    case '/about':
      return n.label && n.label !== 'About' ? n.label : (t('aboutUs') || 'About');
    case '/products':
      return n.label && n.label !== 'Products' ? n.label : (t('products') || 'Products');
    case '/product-details':
      return n.label && n.label !== 'Product Details' ? n.label : (t('productDetails') || 'Product Details');
    case '/partners':
      return n.label && n.label !== 'Partners' ? n.label : (t('partners') || 'Partners');
    case '/brochures':
      return n.label && n.label !== 'Brochures' ? n.label : (t('brochures') || 'Brochures');
    case '/blog':
      return n.label && n.label !== 'Blog' ? n.label : (t('blog') || 'Blog');
    default:
      return n.label || n.to;
  }
};

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ar', label: 'UAE (العربية)' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { header } = useSiteContent();

  const brandName = header?.brandFullName || BRAND.fullName;
  const brandTagline = header?.brandTagline || BRAND.tagline;
  const logoSrc = header?.logo
    ? (header.logo.startsWith('http') || header.logo.startsWith('/')
        ? header.logo
        : asset(header.logo))
    : '/NMC logo.png';

  const navItems = (Array.isArray(header?.navLinks) && header.navLinks.length > 0
    ? header.navLinks.filter((n) => n.isActive !== false)
    : defaultNav
  ).slice().sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const isDefaultCta =
    !header?.ctaText ||
    header.ctaText.trim() === '' ||
    header.ctaText.trim().toLowerCase() === 'get a quote' ||
    header.ctaText.trim().toLowerCase() === 'get quote' ||
    header.ctaText.trim().toLowerCase() === 'request a quote' ||
    header.ctaText.trim().toLowerCase() === 'request quote';
  const ctaText = (!isDefaultCta && language === 'en')
    ? header.ctaText
    : (t('getQuote') || header?.ctaText || 'Get a quote');
  const ctaLink = header?.ctaLink || '/inquiry';

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 dark:bg-[#0d1611]/95 shadow-sm backdrop-blur-md transition-colors">
      <div className="container-x relative flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Name - Responsive across 320px to 4K */}
        <Link
          to="/"
          className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 z-10"
          onClick={() => setOpen(false)}
        >
          <img
            src={logoSrc}
            alt={brandName}
            className="h-10 w-auto object-contain sm:h-14 shrink-0"
            onError={(e) => {
              e.target.src = '/NMC logo.png';
            }}
          />
          <div className="flex flex-col min-w-0 leading-tight">
            <strong className="font-display text-sm font-extrabold tracking-tight text-ink sm:text-lg truncate max-w-[170px] xs:max-w-[240px] sm:max-w-none">
              {brandName}
            </strong>
            {brandTagline && (
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-moss sm:block truncate">
                {brandTagline}
              </span>
            )}
          </div>
        </Link>

        {/* Center / Desktop Navigation Links - Anchored to exact center so it NEVER moves */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-7 xl:gap-8 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 pointer-events-auto z-0">
          {navItems.map((n) => (
            <NavLink
              key={n.to || n.label}
              to={n.to}
              className={({ isActive }) =>
                `text-xs lg:text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-forest dark:text-gold font-bold border-b-2 border-forest dark:border-gold pb-0.5'
                    : 'text-ink/75 dark:text-paper/75 hover:text-forest dark:hover:text-gold'
                }`
              }
            >
              {getNavLabel(n, t)}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions (Quote CTA + Language Switcher) */}
        <div className="hidden items-center gap-2.5 lg:gap-3.5 md:flex shrink-0 z-10 ml-auto">
          {/* Quote Button - Clean & Static (No Animation, No Effect) */}
          <Link
            to={ctaLink}
            className="header-quote-btn text-xs px-4 lg:px-5 py-2 lg:py-2.5"
          >
            <span className="header-quote-btn__text">{ctaText}</span>
            <span className="header-quote-btn__arrow" aria-hidden="true">↗</span>
          </Link>

          {/* Language Picker (Clean dropdown without translate logo) */}
          <label className="relative flex items-center" aria-label={t('language')}>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-line bg-white/90 dark:bg-[#132019] py-1.5 pl-3 pr-6 text-xs font-semibold text-ink dark:text-paper outline-none transition hover:border-forest focus:border-forest shadow-xs"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code} className="text-ink dark:text-paper bg-white dark:bg-[#132019]">
                  {item.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 text-[10px] text-ink/50 dark:text-paper/50" aria-hidden="true">⌄</span>
          </label>
        </div>

        {/* Mobile Action Cluster: Hamburger Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line/80 bg-white dark:bg-[#132019] p-2 text-ink dark:text-paper shadow-sm"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="space-y-1">
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {open && (
        <nav className="border-t border-line bg-paper/98 dark:bg-[#0d1611]/98 px-4 sm:px-5 py-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2">
          <div className="container-x flex flex-col space-y-2">
            {navItems.map((n) => (
              <NavLink
                key={n.to || n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-forest/10 dark:bg-gold/15 text-forest dark:text-gold font-bold' : 'text-ink/80 dark:text-paper/80 hover:bg-black/5 dark:hover:bg-white/5'
                  }`
                }
              >
                {getNavLabel(n, t)}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-line flex flex-col gap-3">
              <Link
                to={ctaLink}
                className="header-quote-btn w-full text-center py-2.5 text-xs font-bold"
                onClick={() => setOpen(false)}
              >
                <span className="header-quote-btn__text">{ctaText}</span>
                <span className="header-quote-btn__arrow" aria-hidden="true">↗</span>
              </Link>

              {/* Language picker in mobile drawer */}
              <label className="flex items-center justify-between rounded-xl border border-line bg-white dark:bg-[#132019] px-3.5 py-2.5 text-xs font-semibold text-ink dark:text-paper">
                <span>{t('language')}</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="bg-transparent font-medium outline-none text-right cursor-pointer text-ink dark:text-paper"
                  aria-label={t('language')}
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code} className="text-ink dark:text-paper bg-white dark:bg-[#132019]">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
