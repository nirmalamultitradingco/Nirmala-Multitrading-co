import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';

const DEFAULT_HERO_BADGES = [
  { text: 'Verified Export Specs', color: 'gold', link: '' },
  { text: 'Direct PDF Downloads', color: 'emerald', link: '' },
  { text: 'Container Payload Data', color: 'blue', link: '' },
];

const getBadgeDotColor = (color) => {
  switch (color) {
    case 'gold':
      return 'bg-gold';
    case 'emerald':
    case 'green':
      return 'bg-emerald-400';
    case 'blue':
      return 'bg-blue-400';
    case 'amber':
    case 'orange':
      return 'bg-amber-400';
    case 'purple':
    case 'violet':
      return 'bg-purple-400';
    case 'rose':
    case 'red':
      return 'bg-rose-400';
    case 'teal':
    case 'cyan':
      return 'bg-teal-400';
    case 'white':
      return 'bg-white';
    default:
      if (typeof color === 'string' && color.startsWith('bg-')) return color;
      return 'bg-gold';
  }
};

const DEFAULT_HERO_SLIDES = [
  {
    type: 'image',
    image: '/brochure-landscape.jpg',
    eyebrow: '⚓ MUNDRA & JNPT PORTS • 40+ COUNTRIES',
    title: 'Sortex Cleaned Spices & Agro Product Catalogues',
    subtitle: 'Verified APEDA, FSSAI & International Export Standards',
    description: 'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.',
    badge: 'Official Catalogues',
    chips: ['🚢 FCL & LCL Consolidation', '🔬 Lab MRL < 0.01 Tested', '📦 Verified PDF Format'],
    primaryButtonText: 'Explore Product Segments ↓',
    primaryButtonLink: '#product-segments',
    secondaryButtonText: 'Request Custom Line Card ✉️',
    secondaryButtonLink: '/inquiry?subject=OfficialCatalogues',
  },
  {
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    image: '/brochure-landscape.jpg',
    eyebrow: '🌾 GRAINS, OIL SEEDS & PULSES',
    title: 'Basmati & Non-Basmati Export Consignments',
    subtitle: '1121, Sugandha, Sharbati & 100% Broken Rice',
    description: 'Custom container consolidation with moisture-barrier liners, vacuum packaging, and destination-country phytosanitary documentation.',
    badge: 'Grain Line Cards',
    chips: ['🌾 100% Sortex Cleaned', '📦 25kg & 50kg BOPP Bags', '⚖️ Flexible FOB / CIF Terms'],
    primaryButtonText: 'View Grain Catalogues ↓',
    primaryButtonLink: '#product-segments',
    secondaryButtonText: 'Inquire Container Rates',
    secondaryButtonLink: '/inquiry',
  },
  {
    type: 'image',
    image: '/global-served-map.jpg',
    eyebrow: '🌐 40+ COUNTRIES DESTINATION CORRIDORS',
    title: 'Global Export Logistics & Container Shipping Data',
    subtitle: 'Direct Scheduled Ocean Freight from Indian Seaports',
    description: 'Full container load (FCL) and consolidated LCL consignments delivered across North America, Europe, GCC, and Southeast Asia.',
    badge: 'Worldwide Corridors',
    chips: ['🚢 Mundra Port Direct', '⏱️ 28-40 Days Transit', '✨ 99.4% On-Time Delivery'],
    primaryButtonText: 'Explore Product Segments ↓',
    primaryButtonLink: '#product-segments',
    secondaryButtonText: 'Contact Trade Desk',
    secondaryButtonLink: '/inquiry',
  },
];

const DEFAULT_BUYER_ASSURANCE = {
  show: true,
  title: 'Buyer Assurance',
  badge: 'APEDA • ISO 22000',
  mediaType: 'none',
  image: '',
  video: '',
  mediaDisplay: 'cardScreen',
  mediaCaption: 'Live Export Cargo & Facility',
  footerLeft: 'Direct Seaport Loading',
  footerRight: 'Mundra & JNPT',
  items: [
    {
      icon: '📦',
      title: 'Container Payload Data',
      subtitle: '20ft (18-22 MT) • 40ft HC (28 MT)',
    },
    {
      icon: '🔬',
      title: '100% Sortex Optical Cleaning',
      subtitle: 'MRL < 0.01 Lab Assay Certified',
    },
    {
      icon: '⚡',
      title: 'Verified PDF Line Cards',
      subtitle: 'Instant Technical Specifications',
    },
  ],
};

export default function Brochures() {
  const [brochures, setBrochures] = useState([]);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isAssuranceMuted, setIsAssuranceMuted] = useState(true);

  const { t } = useLanguage();
  const { siteContent } = useSiteContent();
  const hero = siteContent?.brochuresHero || {};

  const showBadges = hero.showBadges !== false;
  const rawBadges = Array.isArray(hero.badges) && hero.badges.length > 0 ? hero.badges : DEFAULT_HERO_BADGES;
  const badges = rawBadges
    .map((b) => (typeof b === 'string' ? { text: b, color: 'gold', link: '' } : b))
    .filter((b) => b && b.text && b.text.trim().length > 0);

  // Dynamic Buyer Assurance configuration
  const rawAssurance = hero.buyerAssurance;
  const buyerAssurance = {
    show: rawAssurance?.show !== false,
    title: rawAssurance?.title || DEFAULT_BUYER_ASSURANCE.title,
    badge: rawAssurance?.badge || DEFAULT_BUYER_ASSURANCE.badge,
    mediaType: rawAssurance?.mediaType || (rawAssurance?.video ? 'video' : rawAssurance?.image ? 'image' : 'none'),
    image: rawAssurance?.image || '',
    video: rawAssurance?.video || '',
    mediaDisplay: rawAssurance?.mediaDisplay || 'cardScreen',
    mediaCaption: rawAssurance?.mediaCaption || 'Live Export Cargo & Facility',
    footerLeft: rawAssurance?.footerLeft || DEFAULT_BUYER_ASSURANCE.footerLeft,
    footerRight: rawAssurance?.footerRight || DEFAULT_BUYER_ASSURANCE.footerRight,
    items: Array.isArray(rawAssurance?.items) && rawAssurance.items.length > 0
      ? rawAssurance.items
      : DEFAULT_BUYER_ASSURANCE.items,
  };

  const hasAssuranceMedia =
    (buyerAssurance.mediaType === 'video' && buyerAssurance.video) ||
    (buyerAssurance.mediaType === 'image' && buyerAssurance.image) ||
    (buyerAssurance.mediaType !== 'none' && (buyerAssurance.video || buyerAssurance.image));

  const isAssuranceVideo =
    buyerAssurance.mediaType === 'video' || (!buyerAssurance.mediaType && buyerAssurance.video);

  // Compute active slides for the full hero slider
  const activeSlides = useMemo(() => {
    const configured = Array.isArray(hero.slides)
      ? hero.slides.filter((s) => s && s.isActive !== false && (s.image || s.video || s.title))
      : [];

    if (configured.length > 0) {
      return configured.map((s) => ({
        ...s,
        eyebrow: s.eyebrow || hero.eyebrow || 'Official Catalogues & Line Cards',
        title: s.title || hero.title || 'Export Product Catalogues & Line Cards',
        subtitle: s.subtitle || '',
        description:
          s.description ||
          hero.description ||
          'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.',
        badge: s.badge || 'Official Specs',
        primaryButtonText: s.primaryButtonText || 'Explore Product Segments ↓',
        primaryButtonLink: s.primaryButtonLink || '#product-segments',
        secondaryButtonText: s.secondaryButtonText || 'Request Custom Line Card ✉️',
        secondaryButtonLink: s.secondaryButtonLink || '/inquiry?subject=OfficialCatalogues',
        chips:
          Array.isArray(s.chips) && s.chips.length > 0
            ? s.chips
            : (Array.isArray(hero.badges) && hero.badges.length > 0 ? hero.badges : DEFAULT_HERO_BADGES),
      }));
    }

    if (hero.video || hero.image) {
      return [
        {
          type: hero.video ? 'video' : 'image',
          video: hero.video || '',
          image: hero.image || '',
          eyebrow: hero.eyebrow || 'Official Catalogues & Line Cards',
          title: hero.title || 'Export Product Catalogues & Line Cards',
          subtitle: 'Verified Specifications & Container Payload Data',
          description:
            hero.description ||
            'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.',
          badge: hero.video ? 'HD 1080p Video' : 'Official Spec Photo',
          chips: Array.isArray(hero.badges) && hero.badges.length > 0 ? hero.badges : DEFAULT_HERO_BADGES,
          primaryButtonText: 'Explore Product Segments ↓',
          primaryButtonLink: '#product-segments',
          secondaryButtonText: 'Request Custom Line Card ✉️',
          secondaryButtonLink: '/inquiry?subject=OfficialCatalogues',
        },
      ];
    }

    return DEFAULT_HERO_SLIDES;
  }, [hero.slides, hero.video, hero.image, hero.title, hero.eyebrow, hero.description, hero.badges]);

  // Ensure current slide index stays within range
  useEffect(() => {
    if (currentSlideIndex >= activeSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  // Autoplay rotation effect
  const autoPlayEnabled = hero.autoPlay !== false;
  const intervalMs = Math.max(2, Number(hero.autoPlayInterval) || 5) * 1000;

  useEffect(() => {
    if (!autoPlayEnabled || isPaused || activeSlides.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlayEnabled, isPaused, activeSlides.length, intervalMs]);

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  // Load brochures and segments
  const loadData = () => {
    return Promise.all([
      api.get('/brochures').then((r) => r.data || []),
      api.get('/segments').then((r) => r.data || []),
    ])
      .then(([brochuresData, segmentsData]) => {
        setBrochures(brochuresData);
        setSegments(segmentsData);
      })
      .catch((err) => {
        console.error('Failed to load brochures data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate brochure counts per segment
  const segmentCounts = useMemo(() => {
    const counts = {};
    brochures.forEach((b) => {
      const segId = b.segment?._id || b.segment;
      if (segId) {
        counts[segId] = (counts[segId] || 0) + 1;
      }
    });
    return counts;
  }, [brochures]);

  return (
    <div className="overflow-x-hidden min-h-screen bg-paper text-ink transition-colors">
      {/* 1. COMPACT FULL-BLEED HERO SECTION SLIDER (PHOTOS & VIDEOS) */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden border-b border-line bg-[#071510] text-paper min-h-[400px] sm:min-h-[440px] lg:min-h-[470px] flex items-center select-none"
      >
        {/* Render Full-Bleed Slides with Smooth Fade Transitions */}
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          const isVideo = slide.type === 'video' && slide.video;

          return (
            <div
              key={slide._id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Media: Video or Photo */}
              {isVideo ? (
                <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
                  <video
                    src={asset(slide.video)}
                    poster={slide.image ? asset(slide.image) : undefined}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-[#07130e] overflow-hidden pointer-events-none">
                  <img
                    src={asset(slide.image || '/brochure-landscape.jpg')}
                    alt={slide.title || 'Official Export Catalogues'}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out scale-100 hover:scale-105"
                  />
                </div>
              )}

              {/* Multi-layer Cinematic Vignettes & Contrast Overlays for 100% Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07130e]/95 via-[#07130e]/85 to-[#07130e]/50 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-transparent to-black/55 pointer-events-none" />
              <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-forest/30 blur-3xl pointer-events-none" />
              <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

              {/* Foreground Hero Content Container */}
              <div className="container-x relative z-20 h-full flex items-center py-10 sm:py-12 lg:py-14">
                <div className="grid lg:grid-cols-12 gap-8 items-center w-full">
                  {/* Left Column: Core Value Proposition */}
                  <div className={buyerAssurance.show ? "lg:col-span-8" : "lg:col-span-12"}>
                    {/* Top Eyebrow & Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2.5">
                      <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-gold/15 border border-gold/40 px-3 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold backdrop-blur-md shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                        {slide.eyebrow || hero.eyebrow || 'Official Catalogues & Line Cards'}
                      </span>

                      {slide.badge && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold text-white/90 backdrop-blur-md shadow-sm">
                          ★ {slide.badge}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 rounded-full bg-black/60 border border-white/15 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-paper/75 backdrop-blur-md">
                        {isVideo ? '🎬 4K/HD VIDEO' : '🖼️ PHOTO SPEC'}
                      </span>
                    </div>

                    {/* Main Slide Title */}
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-black tracking-tight text-white leading-tight drop-shadow-xl">
                      {slide.title || hero.title || 'Export Product Catalogues & Line Cards'}
                    </h1>

                    {/* Slide Subtitle */}
                    {slide.subtitle && (
                      <p className="mt-1.5 text-gold font-mono text-xs sm:text-sm font-semibold tracking-wide drop-shadow">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Slide Description */}
                    <p className="mt-2.5 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-paper/85 max-w-2xl drop-shadow line-clamp-2 sm:line-clamp-none">
                      {slide.description ||
                        hero.description ||
                        'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.'}
                    </p>

                    {/* Spec Highlights / Chips */}
                    {((Array.isArray(slide.chips) && slide.chips.length > 0) || (badges && badges.length > 0)) && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        {(Array.isArray(slide.chips) && slide.chips.length > 0 ? slide.chips : badges).map((chip, cIdx) => {
                          const text = typeof chip === 'string' ? chip : chip?.text;
                          const dotColor = typeof chip === 'object' && chip?.color ? getBadgeDotColor(chip.color) : 'bg-gold';
                          if (!text) return null;
                          return (
                            <span
                              key={cIdx}
                              className="inline-flex items-center gap-1.5 rounded-full bg-black/60 border border-white/15 px-2.5 py-0.5 text-[11px] font-mono text-paper/90 backdrop-blur-md shadow-sm"
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                              <span>{text}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* CTA Buttons & Sound Toggle */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <a
                        href={slide.primaryButtonLink || '#product-segments'}
                        className="btn-primary text-xs py-2.5 px-5 shadow-xl inline-flex items-center gap-2 cursor-pointer font-bold rounded-xl"
                      >
                        <span>{slide.primaryButtonText || 'Explore Product Segments ↓'}</span>
                      </a>

                      <Link
                        to={slide.secondaryButtonLink || '/inquiry?subject=OfficialCatalogues'}
                        className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition shadow-lg inline-flex items-center gap-2"
                      >
                        <span>{slide.secondaryButtonText || 'Request Custom Line Card ✉️'}</span>
                      </Link>

                      {/* Sound Mute/Unmute Toggle for Video Slides */}
                      {isVideo && (
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="rounded-xl border border-white/20 bg-black/60 px-3 py-2.5 text-xs font-bold text-gold backdrop-blur-md hover:bg-black/80 transition shadow-lg cursor-pointer flex items-center gap-1.5"
                          title={isMuted ? 'Turn on audio' : 'Mute audio'}
                        >
                          <span>{isMuted ? '🔇 Sound Off' : '🔊 Sound On'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: High-Value Buyer Assurance Widget (Desktop Only) */}
                  {buyerAssurance.show && (
                    <div className="hidden lg:block lg:col-span-4">
                      <div className="rounded-2xl border border-white/20 bg-black/60 backdrop-blur-xl p-5 text-paper shadow-2xl relative group/card hover:border-gold/40 transition-all duration-300 overflow-hidden">
                        {/* Background Media (When set to card backdrop) */}
                        {hasAssuranceMedia && buyerAssurance.mediaDisplay === 'background' && (
                          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {isAssuranceVideo ? (
                              <video
                                src={asset(buyerAssurance.video)}
                                poster={buyerAssurance.image ? asset(buyerAssurance.image) : undefined}
                                autoPlay
                                loop
                                muted={isAssuranceMuted}
                                playsInline
                                className="w-full h-full object-cover opacity-25 scale-105"
                              />
                            ) : (
                              <img
                                src={asset(buyerAssurance.image)}
                                alt={buyerAssurance.title}
                                className="w-full h-full object-cover opacity-25 scale-105"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/65" />
                          </div>
                        )}

                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <span className="font-mono text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {buyerAssurance.title}
                            </span>
                            {buyerAssurance.badge && (
                              <span className="font-mono text-[10px] text-paper/60">{buyerAssurance.badge}</span>
                            )}
                          </div>

                          {/* Mini Screen Media Player Window (Above Specifications) */}
                          {hasAssuranceMedia && buyerAssurance.mediaDisplay !== 'background' && (
                            <div className="mt-3 relative rounded-xl overflow-hidden border border-white/20 bg-black/80 aspect-video max-h-36 flex items-center justify-center group/media shadow-lg">
                              {isAssuranceVideo ? (
                                <video
                                  src={asset(buyerAssurance.video)}
                                  poster={buyerAssurance.image ? asset(buyerAssurance.image) : undefined}
                                  autoPlay
                                  loop
                                  muted={isAssuranceMuted}
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={asset(buyerAssurance.image)}
                                  alt={buyerAssurance.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105"
                                />
                              )}

                              {/* Overlays */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                              {/* Live Tag / Caption */}
                              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-0.5 border border-white/20 backdrop-blur-md">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                                  {buyerAssurance.mediaCaption || (isAssuranceVideo ? 'LIVE VIDEO FEED' : 'OFFICIAL PHOTO')}
                                </span>
                              </div>

                              {/* Audio Sound Button if Video */}
                              {isAssuranceVideo && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsAssuranceMuted(!isAssuranceMuted);
                                  }}
                                  className="absolute bottom-2 right-2 z-20 rounded-lg bg-black/80 px-2 py-1 text-[10px] text-gold border border-white/20 backdrop-blur-md hover:bg-black transition cursor-pointer flex items-center gap-1"
                                  title={isAssuranceMuted ? 'Turn Sound On' : 'Mute Sound'}
                                >
                                  <span>{isAssuranceMuted ? '🔇 Muted' : '🔊 Sound'}</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Specification Points */}
                          <div className="mt-3.5 space-y-2.5 text-xs">
                            {buyerAssurance.items.map((item, itIdx) => (
                              <div key={itIdx} className="flex items-center gap-2.5 text-paper/90">
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gold/15 text-gold text-xs shrink-0 border border-gold/20">
                                  {item.icon || '✓'}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-white text-xs leading-none truncate">{item.title}</p>
                                  {item.subtitle && (
                                    <p className="text-[10px] text-paper/60 font-mono mt-0.5 leading-snug truncate">
                                      {item.subtitle}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bottom Footer Line */}
                          {(buyerAssurance.footerLeft || buyerAssurance.footerRight) && (
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-paper/60 leading-normal">
                              <span>{buyerAssurance.footerLeft}</span>
                              <span className="text-gold font-bold">{buyerAssurance.footerRight}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Large Navigation Arrows (Left & Right) */}
        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevSlide}
              aria-label="Previous Slide"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 text-white/90 border border-white/20 backdrop-blur-md transition-all hover:bg-gold hover:text-ink hover:scale-110 shadow-2xl cursor-pointer text-lg font-bold"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToNextSlide}
              aria-label="Next Slide"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 text-white/90 border border-white/20 backdrop-blur-md transition-all hover:bg-gold hover:text-ink hover:scale-110 shadow-2xl cursor-pointer text-lg font-bold"
            >
              ›
            </button>
          </>
        )}

        {/* Bottom Floating Navigation Pill (Autoplay Play/Pause + Slide Tabs + Counter) */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 rounded-full bg-black/85 px-3.5 py-1.5 backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Autoplay Play/Pause Toggle */}
            {autoPlayEnabled && (
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="text-xs text-paper/80 hover:text-gold transition cursor-pointer pr-1 flex items-center gap-1 font-mono"
                title={isPaused ? 'Resume Carousel Autoplay' : 'Pause Carousel Autoplay'}
              >
                <span>{isPaused ? '▶' : '⏸'}</span>
              </button>
            )}

            {/* Slide Indicators with active width expand */}
            <div className="flex items-center gap-1.5">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to Slide ${idx + 1}`}
                  className={`group flex items-center gap-1 transition-all cursor-pointer rounded-full px-1.5 py-0.5 ${
                    idx === currentSlideIndex
                      ? 'bg-gold/20 border border-gold/60 text-gold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <span
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentSlideIndex ? 'w-5 bg-gold shadow-sm' : 'w-1.5 bg-white/40 group-hover:bg-white/80'
                    }`}
                  />
                  <span className="font-mono text-[9px] font-bold hidden sm:inline">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Slide Index Counter */}
            <span className="font-mono text-[10px] font-bold text-gold border-l border-white/20 pl-2">
              {String(currentSlideIndex + 1).padStart(2, '0')}/{String(activeSlides.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </section>

      {/* 2. PRODUCT SEGMENTS DIRECTORY SECTION */}
      <section id="product-segments" className="py-10 md:py-16">
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="eyebrow text-gold">Product Segments</span>
                <span className="rounded-full bg-forest/10 dark:bg-forest/20 px-2.5 py-0.5 font-mono text-[11px] font-bold text-forest dark:text-moss">
                  {segments.length} Categories
                </span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink dark:text-paper sm:text-3xl">
                Browse Catalogues by Product Segment
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-ink/65 dark:text-paper/65 max-w-2xl">
                Click on any product segment below to open its dedicated catalogue page with verified specifications and downloadable brochures.
              </p>
            </div>
          </div>

          {/* Product Segments Cards Grid */}
          {loading ? (
            <div className="py-20">
              <Loader />
            </div>
          ) : segments.length === 0 ? (
            <div className="py-16 text-center text-ink/60 dark:text-paper/60 text-sm">
              No product segments found.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {segments.map((seg) => {
                const count = segmentCounts[seg._id] || 0;

                return (
                  <Link
                    key={seg._id}
                    to={`/brochures/${seg.slug || seg._id}`}
                    className="group relative overflow-hidden rounded-2xl border border-line/80 bg-white dark:bg-surface hover:border-gold hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    {/* Card Image Banner with exact 16:10 aspect ratio and zoom */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e1d16]">
                      {seg.image ? (
                        <img
                          src={asset(seg.image)}
                          alt={seg.name}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/NMC logo.png';
                            e.target.className = 'h-full w-full object-contain p-4';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#16241c] to-[#234a34] flex items-center justify-center text-paper/40 font-mono text-xs">
                          {seg.name}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Top badging */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full bg-black/70 backdrop-blur px-2 py-0.5 font-mono text-[9px] font-semibold text-gold border border-gold/30">
                            Export Segment
                          </span>
                          {seg.video && (
                            <span
                              className="rounded-full bg-emerald-950/90 backdrop-blur px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300 border border-emerald-400/40 shadow-sm flex items-center gap-1 animate-pulse"
                              title="Commercial Video Available"
                            >
                              <span>🎬</span>
                              <span>Video</span>
                            </span>
                          )}
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold backdrop-blur shadow-sm ${
                            count > 0 ? 'bg-gold text-ink' : 'bg-black/60 text-paper/70 border border-white/10'
                          }`}
                        >
                          {count} {count === 1 ? 'Catalogue' : 'Catalogues'}
                        </span>
                      </div>

                      {/* Name pinned to bottom of banner */}
                      <div className="absolute bottom-2.5 left-3.5 right-3.5">
                        <h3 className="font-display text-base font-bold text-white drop-shadow-md truncate group-hover:text-gold transition-colors">
                          {seg.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card Bottom Body */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
                      {seg.description ? (
                        <p className="text-xs text-ink/65 dark:text-paper/65 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                          {seg.description}
                        </p>
                      ) : (
                        <p className="text-xs text-ink/40 dark:text-paper/40 italic min-h-[2.5rem]">
                          Official export specifications, packing metrics, and verified certifications.
                        </p>
                      )}

                      <div className="pt-3 border-t border-line/60 flex items-center justify-between gap-1 text-xs font-mono">
                        <span className="text-forest dark:text-gold font-bold group-hover:underline flex items-center gap-1">
                          <span>Explore Catalogues</span>
                          <span className="text-gold transition-transform group-hover:translate-x-1 font-bold">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. CUSTOM LINE CARD NOTICE BANNER */}
      <section className="container-x pb-16 md:pb-20">
        <div className="rounded-3xl border border-line bg-gradient-to-r from-[#fbf8f4] to-white dark:from-[#132019] dark:to-[#0d1611] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow text-gold">Custom Trade Solutions</span>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink dark:text-paper">
              Need a Tailored Line Card or Specification Sheet?
            </h3>
            <p className="mt-2 text-sm text-ink/70 dark:text-paper/70 leading-relaxed">
              If your supermarket chain or import house requires specific packaging sizes, private labeling details, or custom container combinations, our export desk can generate custom line cards for you.
            </p>
          </div>

          <Link
            to="/inquiry?subject=CustomLineCard"
            className="btn-primary shrink-0 whitespace-nowrap"
          >
            Request custom line card →
          </Link>
        </div>
      </section>
    </div>
  );
}
