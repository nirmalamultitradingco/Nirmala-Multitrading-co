import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { asset } from '../api/axios.js';
import { BRAND } from '../config.js';
import { createAlignedFavicon } from '../utils/faviconAligner.js';

export { createAlignedFavicon };

export const generateSvgFavicon = (text = 'NMC', subtext = 'EXPORTS') => {
  const cleanText = (text || 'NMC').trim().slice(0, 5);
  const cleanSubtext = (subtext || '').trim().slice(0, 10);
  const fontSize = cleanText.length > 4 ? 24 : cleanText.length > 3 ? 28 : 33;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332" />
      <stop offset="50%" stop-color="#16382b" />
      <stop offset="100%" stop-color="#0d241b" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAD074" />
      <stop offset="50%" stop-color="#C6912E" />
      <stop offset="100%" stop-color="#9A6B1A" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="124" height="124" rx="28" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="3" />
  <rect x="7" y="7" width="114" height="114" rx="23" fill="none" stroke="#C6912E" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="3 2" />
  <g transform="translate(64, ${cleanSubtext ? 46 : 50})" filter="url(#glow)">
    <circle cx="0" cy="0" r="23" fill="#122c22" stroke="url(#goldGrad)" stroke-width="2.2" />
    <ellipse cx="0" cy="0" rx="12" ry="23" fill="none" stroke="#C6912E" stroke-width="1.2" stroke-opacity="0.8" />
    <line x1="-23" y1="0" x2="23" y2="0" stroke="#C6912E" stroke-width="1.2" stroke-opacity="0.8" />
    <ellipse cx="0" cy="0" rx="23" ry="11" fill="none" stroke="#C6912E" stroke-width="1" stroke-opacity="0.6" stroke-dasharray="2 1.5" />
    <path d="M-6 -22 C-14 -12 -12 2 -2 6 C-1 -4 -3 -16 -6 -22 Z" fill="url(#goldGrad)" opacity="0.9" />
    <path d="M6 -22 C14 -12 12 2 2 6 C1 -4 3 -16 6 -22 Z" fill="url(#goldGrad)" opacity="0.9" />
    <circle cx="0" cy="-22" r="2.5" fill="#FFE185" />
  </g>
  <text x="64" y="${cleanSubtext ? 95 : 100}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="2" fill="#FFFFFF" filter="url(#glow)">${cleanText}</text>
  ${cleanSubtext ? `<text x="64" y="112" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="9" letter-spacing="2.5" fill="#E4B54C">${cleanSubtext}</text>` : ''}
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const defaultHeader = {
  brandName: BRAND.name || 'NMC',
  brandFullName: BRAND.fullName || 'Nirmala Multitrading Co.',
  brandTagline: BRAND.tagline || "India’s Taste. The World’s Table",
  logo: '/NMC logo.png',
  favicon: '/favicon.svg',
  faviconText: 'NMC',
  faviconSubtext: 'EXPORTS',
  faviconFit: 'contain',
  faviconBg: 'transparent',
  faviconShape: 'rounded',
  faviconPadding: 10,
  faviconScale: 100,
  faviconOffsetX: 0,
  faviconOffsetY: 0,
  faviconAlignedDataUrl: '',
  siteTitle:
    'Nirmala Multi Trading Co. (NMC) | Leading Indian Merchant Food Exporter | Spices, Grains & Agro Commodities',
  metaDescription:
    'Nirmala Multi Trading Co. (NMC) is a premier Indian merchant food exporter delivering Sortex-cleaned spices, grains, pulses, oil seeds, dehydrated foods and savories worldwide.',
  ctaText: 'Get a Quote',
  ctaLink: '/inquiry',
  navLinks: [
    { label: 'Home', to: '/', isActive: true, order: 1 },
    { label: 'About', to: '/about', isActive: true, order: 2 },
    { label: 'Products', to: '/products', isActive: true, order: 3 },
    { label: 'Partners', to: '/partners', isActive: true, order: 4 },
    { label: 'Brochures', to: '/brochures', isActive: true, order: 5 },
    { label: 'Blog', to: '/blog', isActive: true, order: 6 },
  ],
};

const defaultFooter = {
  brandFullName: BRAND.fullName || 'Nirmala Multitrading Co.',
  logo: '/NMC logo.png',
  blurb:
    BRAND.blurb ||
    'India’s Taste. The World’s Table — connecting trusted Indian food products with international buyers.',
  email: BRAND.email || 'nirmalamultitradingco@gmail.com',
  phone: BRAND.phone || '+91 7069826082',
  address: BRAND.address || 'Surat, Gujarat, India',
  inquiryCtaText: 'Request FOB / CIF Quote',
  inquiryCtaLink: '/inquiry',
  newsletterBadge: 'Exporter Market Intelligence',
  newsletterTitle: 'Get Instant Agro Market & Harvest Updates',
  newsletterDesc:
    'Subscribe to receive immediate alerts when new agro commodities, spices, or market trade reports are published.',
  badges: ['APEDA REG.', 'SPICE BOARD INDIA', 'FSSAI CERTIFIED', 'MUNDRA PORT (INMUN1)'],
  quickLinks: [
    { label: 'Products', to: '/products', isActive: true, order: 1 },
    { label: 'Partners', to: '/partners', isActive: true, order: 2 },
    { label: 'Brochures', to: '/brochures', isActive: true, order: 3 },
    { label: 'Blog', to: '/blog', isActive: true, order: 4 },
  ],
  copyrightText: `${BRAND.fullName || 'Nirmala Multitrading Co.'}. All rights reserved.`,
  bottomTagline: 'Certified Indian Agro-Food Exporter',
};

const defaultLoader = {
  isActive: true,
  logo: '/NMC logo.png',
  eyebrow: 'Certified Indian Agro-Food Exporter',
  title: 'Nirmala Multitrading Co.',
  tagline: "India’s Taste. The World’s Table",
  subtitle: 'Connecting Trusted Indian Agro-Food Products Globally',
  statusText: 'Preparing Premium Consignments…',
  badgeText: 'APEDA • SPICE BOARD INDIA • FSSAI',
  durationSeconds: 2.5,
  imageFit: 'cover',
  showProgress: true,
};

const CACHE_KEY = 'nmc_site_content_cache';

const getInitialContent = () => {
  try {
    const cached = typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEY) : null;
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}
  return null;
};

const SiteContentContext = createContext({
  siteContent: null,
  header: defaultHeader,
  footer: defaultFooter,
  loader: defaultLoader,
  loading: true,
  refreshSiteContent: () => {},
});

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(getInitialContent);
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const res = await api.get('/site-content');
      setSiteContent(res.data);
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
      } catch {}
    } catch (err) {
      console.warn('Could not load site-content from API, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    const handleUpdate = () => {
      fetchContent();
    };

    const handleStorage = (e) => {
      if (e.key === CACHE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setSiteContent(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener('site-content-updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('site-content-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchContent]);

  // Dynamically update browser tab favicon and site title/meta across entire website
  useEffect(() => {
    let isCancelled = false;
    const headerData = siteContent?.header || {};
    const rawFavicon = headerData.favicon || siteContent?.favicon;
    const favText = headerData.faviconText || siteContent?.faviconText;
    const favSubtext = headerData.faviconSubtext || siteContent?.faviconSubtext;
    const alignedDataUrl = headerData.faviconAlignedDataUrl || siteContent?.faviconAlignedDataUrl;

    const applyFaviconHref = (href) => {
      if (!href || isCancelled) return;
      const iconSelectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
      ];
      iconSelectors.forEach((sel) => {
        const links = document.querySelectorAll(sel);
        links.forEach((link) => {
          link.href = href;
        });
      });
      if (document.querySelectorAll('link[rel*="icon"]').length === 0) {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = href;
        document.head.appendChild(newLink);
      }
    };

    // 1. If an aligned square data URL is already saved, use it directly
    if (alignedDataUrl && alignedDataUrl.startsWith('data:image/')) {
      applyFaviconHref(alignedDataUrl);
    }
    // 2. If a custom photo/image was uploaded, automatically align and square-frame it
    else if (
      rawFavicon &&
      rawFavicon !== '/favicon.svg' &&
      (rawFavicon.startsWith('/') || rawFavicon.startsWith('http') || rawFavicon.startsWith('data:'))
    ) {
      const fullUrl = asset(rawFavicon);
      applyFaviconHref(fullUrl);
      createAlignedFavicon(fullUrl, {
        fit: headerData.faviconFit || 'contain',
        shape: headerData.faviconShape || 'rounded',
        bg: headerData.faviconBg || 'transparent',
        padding: headerData.faviconPadding ?? 10,
        scale: headerData.faviconScale ?? 100,
        offsetX: headerData.faviconOffsetX ?? 0,
        offsetY: headerData.faviconOffsetY ?? 0,
      }).then((alignedUri) => {
        if (!isCancelled && alignedUri && alignedUri !== fullUrl) {
          applyFaviconHref(alignedUri);
        }
      });
    }
    // 3. Dynamic SVG vector initials & ribbon badge
    else if (favText || favSubtext) {
      applyFaviconHref(generateSvgFavicon(favText || 'NMC', favSubtext || 'EXPORTS'));
    } else {
      applyFaviconHref('/favicon.svg');
    }

    // Dynamic website title for public pages
    const isInsideAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    if (!isInsideAdmin) {
      const customTitle = headerData.siteTitle || siteContent?.siteTitle;
      if (customTitle && customTitle.trim()) {
        document.title = customTitle.trim();
      }
    }

    // Dynamic meta description
    const customDesc = headerData.metaDescription || siteContent?.metaDescription;
    if (customDesc && customDesc.trim()) {
      const metaEl = document.querySelector('meta[name="description"]');
      if (metaEl) {
        metaEl.setAttribute('content', customDesc.trim());
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [siteContent]);

  const header = {
    ...defaultHeader,
    ...(siteContent?.header || {}),
    navLinks:
      Array.isArray(siteContent?.header?.navLinks) && siteContent.header.navLinks.length > 0
        ? siteContent.header.navLinks
        : defaultHeader.navLinks,
  };

  const footer = {
    ...defaultFooter,
    ...(siteContent?.footer || {}),
    badges:
      Array.isArray(siteContent?.footer?.badges) && siteContent.footer.badges.length > 0
        ? siteContent.footer.badges
        : defaultFooter.badges,
    quickLinks:
      Array.isArray(siteContent?.footer?.quickLinks) && siteContent.footer.quickLinks.length > 0
        ? siteContent.footer.quickLinks
        : defaultFooter.quickLinks,
  };

  const loader = {
    ...defaultLoader,
    ...(siteContent?.loader || {}),
  };

  return (
    <SiteContentContext.Provider
      value={{
        siteContent,
        header,
        footer,
        loader,
        loading,
        refreshSiteContent: fetchContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
export { defaultHeader, defaultFooter, defaultLoader };
