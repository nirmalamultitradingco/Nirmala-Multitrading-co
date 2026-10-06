import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';

const DEFAULT_BLOG_BADGES = [
  { text: 'Market Trade Intelligence', color: 'gold', link: '' },
  { text: 'Verified Agro Harvest Trends', color: 'emerald', link: '' },
  { text: 'Global Export Logistics', color: 'blue', link: '' },
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

const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(
      new Date(date)
    );
  } catch {
    return '';
  }
};

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeMediaTab, setActiveMediaTab] = useState('video'); // 'video' | 'image'

  const { t } = useLanguage();
  const { siteContent } = useSiteContent();
  const hero = siteContent?.blogHero || {};

  const showBadges = hero.showBadges !== false;
  const rawBadges = Array.isArray(hero.badges) && hero.badges.length > 0 ? hero.badges : DEFAULT_BLOG_BADGES;
  const badges = rawBadges
    .map((b) => (typeof b === 'string' ? { text: b, color: 'gold', link: '' } : b))
    .filter((b) => b && b.text && b.text.trim().length > 0);

  const loadPosts = () => {
    return api
      .get('/news')
      .then((r) => setItems(r.data || []))
      .catch((err) => console.error('Failed to load blog posts:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync active media tab with hero
  useEffect(() => {
    if (hero) {
      if (hero.video) {
        setActiveMediaTab('video');
      } else if (hero.image) {
        setActiveMediaTab('image');
      }
    }
  }, [hero]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [items, search]);

  const hasMedia = Boolean(hero.video || hero.image);

  return (
    <div className="overflow-x-hidden min-h-screen bg-paper text-ink transition-colors">
      {/* 1. HERO SECTION WITH IMAGE & VIDEO CINEMA SHOWCASE */}
      <section className="relative overflow-hidden border-b border-line bg-[#0d1e17] py-14 md:py-20 text-paper">
        {/* Ambient subtle glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-forest/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

        <div className="container-x relative">
          <div className="grid gap-10 items-center lg:grid-cols-12">
            {/* Left Column: Text & Badges */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2">
                <span className="eyebrow text-gold">{hero.eyebrow || 'Media & Market Insights'}</span>
              </div>

              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {hero.title || 'Global Agro Export Blog & Market Insights'}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-paper/75 sm:text-lg">
                {hero.description ||
                  'In-depth global market intelligence, harvest cycles, FOB/CIF commodity price trends, and export quality standards from Nirmala Multitrading Co.'}
              </p>

              {/* Trust highlights / Badges */}
              {showBadges && badges.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-paper/70">
                  {badges.map((badge, idx) => {
                    const dotClass = getBadgeDotColor(badge.color);
                    const content = (
                      <>
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
                        <span>{badge.text}</span>
                      </>
                    );

                    const link = badge.link ? badge.link.trim() : '';
                    if (link) {
                      if (link.startsWith('http://') || link.startsWith('https://')) {
                        return (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur border border-white/10 transition-all hover:bg-white/20 hover:border-white/30 hover:scale-105 text-paper/90 hover:text-white"
                          >
                            {content}
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={idx}
                          to={link}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur border border-white/10 transition-all hover:bg-white/20 hover:border-white/30 hover:scale-105 text-paper/90 hover:text-white"
                        >
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur border border-white/10"
                      >
                        {content}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="#articles-list"
                  className="btn-primary text-xs py-2.5 px-5 shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Market Reports</span>
                  <span>↓</span>
                </a>

                <Link
                  to="/inquiry?subject=MarketIntelligence"
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-paper/90 hover:bg-white/15 hover:text-white transition"
                >
                  Request Market Advisory ✉️
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Cinema Showcase with Ambient Lighting & Strict 16:9 Alignment */}
            <div className="lg:col-span-5">
              <div className="relative group">
                {/* Ambient theater glow reflection */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-gold/30 via-emerald-600/25 to-gold/20 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Outer Luxury Glass Bezel */}
                <div className="relative rounded-[26px] bg-gradient-to-b from-white/15 via-white/5 to-white/10 p-2 sm:p-2.5 backdrop-blur-xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
                  {hasMedia ? (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#07130e] border border-gold/30 shadow-inner flex items-center justify-center">
                      {/* Interactive media switcher pills when both video and image exist */}
                      {hero.video && hero.image && (
                        <div className="absolute top-3 left-3 z-30 flex items-center gap-1 rounded-full bg-black/80 p-1 backdrop-blur-md border border-white/20 shadow-lg">
                          <button
                            type="button"
                            onClick={() => setActiveMediaTab('video')}
                            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              activeMediaTab === 'video'
                                ? 'bg-gold text-ink shadow-sm'
                                : 'text-paper/80 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span>🎬</span>
                            <span>Video Tour</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveMediaTab('image')}
                            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              activeMediaTab === 'image'
                                ? 'bg-gold text-ink shadow-sm'
                                : 'text-paper/80 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span>🖼️</span>
                            <span>Photo Showcase</span>
                          </button>
                        </div>
                      )}

                      {/* Video View */}
                      {((activeMediaTab === 'video' && hero.video) || (!hero.image && hero.video)) ? (
                        <div className="relative h-full w-full bg-black flex items-center justify-center">
                          <video
                            key={hero.video}
                            src={asset(hero.video)}
                            poster={hero.image ? asset(hero.image) : undefined}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                          {/* Corner Quality Tag */}
                          <div className="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 font-mono text-[9px] font-bold text-gold border border-gold/40 backdrop-blur shadow-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              HD 1080p
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Image View */
                        <div className="relative h-full w-full bg-[#102018] group/img overflow-hidden">
                          <img
                            src={asset(hero.image)}
                            alt={hero.title || 'Global Agro Export Blog & Market Insights'}
                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-108"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/NMC logo.png';
                              e.currentTarget.className = 'h-full w-full object-contain p-6 bg-[#102018]';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                          {/* Image Overlays */}
                          <div className="absolute top-3 right-3 z-20">
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 font-mono text-[9px] font-bold text-gold border border-gold/40 backdrop-blur shadow-sm">
                              Trade Intelligence
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-paper/90 pointer-events-none">
                            <span className="font-bold text-white drop-shadow">Harvest & Sourcing Insights</span>
                            <span className="rounded-full bg-gold/90 text-ink px-2 py-0.5 text-[9px] font-extrabold uppercase">
                              Verified
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Default Branded Frame when no media is uploaded yet */
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#12241b] via-[#0d1e17] to-[#1a382c] border border-gold/30 p-6 flex flex-col justify-between text-paper">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 font-mono text-[10px] font-bold text-gold border border-gold/40">
                          ★ MARKET INSIGHTS & REPORTS
                        </span>
                        <span className="font-mono text-[10px] text-paper/60">Live Updates</span>
                      </div>
                      <div className="text-center my-auto py-2">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30 text-2xl">
                          📰
                        </div>
                        <h4 className="font-display text-lg font-bold text-white">NMC Global Agro Commodities</h4>
                        <p className="mt-1 text-xs text-paper/70 font-mono">Market Intelligence • Container Freight Trends</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-paper/60">
                        <span>APEDA / SPICE BOARD / FSSAI</span>
                        <span className="text-gold">International Export Standards</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARTICLES DIRECTORY SECTION */}
      <section id="articles-list" className="py-14 md:py-20">
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="eyebrow text-gold">Articles & Updates</span>
                <span className="rounded-full bg-forest/10 dark:bg-forest/20 px-2.5 py-0.5 font-mono text-[11px] font-bold text-forest dark:text-moss">
                  {filteredItems.length} Publications
                </span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink dark:text-paper sm:text-3xl">
                Recent Market Reports & Announcements
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-ink/65 dark:text-paper/65 max-w-2xl">
                Browse our latest publications on harvest trends, export shipping corridors, and international quality standards.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="pointer-events-none absolute left-3.5 top-2.5 text-ink/40 text-xs">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles or tags…"
                className="w-full rounded-full border border-line bg-white dark:bg-surface py-2 pl-9 pr-8 text-xs font-medium text-ink dark:text-paper outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15 shadow-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2 text-xs text-ink/40 hover:text-ink cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="py-20">
              <Loader />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <EmptyState
                title={search ? 'No articles match your search' : 'No blog posts published yet'}
                hint={
                  search
                    ? 'Try clearing your search term.'
                    : 'We are preparing new market intelligence reports. Check back soon!'
                }
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item._id}
                  className="group relative overflow-hidden rounded-2xl border border-line bg-white dark:bg-surface hover:border-gold hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <Link to={`/blog/${item.slug}`} className="flex flex-col flex-1">
                    {/* Card Media Banner with exact 16:10 aspect ratio and zoom */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e1d16]">
                      {item.image ? (
                        <img
                          src={asset(item.image)}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/NMC logo.png';
                            e.currentTarget.className = 'h-full w-full object-contain p-6 bg-[#0e1d16]';
                          }}
                        />
                      ) : item.images?.length > 0 ? (
                        <img
                          src={asset(item.images[0])}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/NMC logo.png';
                            e.currentTarget.className = 'h-full w-full object-contain p-6 bg-[#0e1d16]';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#16241c] to-[#234a34] flex items-center justify-center text-paper/40 font-mono text-xs">
                          {item.title}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Top badging */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full bg-black/70 backdrop-blur px-2 py-0.5 font-mono text-[9px] font-semibold text-gold border border-gold/30">
                            Market Report
                          </span>
                          {item.video && (
                            <span
                              className="rounded-full bg-emerald-950/90 backdrop-blur px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300 border border-emerald-400/40 shadow-sm flex items-center gap-1 animate-pulse"
                              title="Video Coverage Available"
                            >
                              <span>🎬</span>
                              <span>Video</span>
                            </span>
                          )}
                        </div>
                        {item.publishedAt && (
                          <span className="rounded-full bg-black/60 backdrop-blur px-2 py-0.5 font-mono text-[9px] text-paper/80 border border-white/10">
                            {formatDate(item.publishedAt)}
                          </span>
                        )}
                      </div>

                      {/* Tags / Author pinned to bottom of banner */}
                      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[10px] font-mono text-paper/70">
                        {item.author ? (
                          <span className="font-semibold text-paper/90">By {item.author}</span>
                        ) : (
                          <span className="font-semibold text-paper/90">NMC Export Desk</span>
                        )}
                        {item.tags?.length > 0 && (
                          <span className="rounded bg-black/50 px-1.5 py-0.5 text-gold">
                            #{item.tags[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                      <div>
                        <h2 className="font-display text-lg font-bold leading-snug text-ink dark:text-paper group-hover:text-forest dark:group-hover:text-gold transition-colors line-clamp-2 min-h-[3rem]">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-paper/65 line-clamp-2 min-h-[2.5rem]">
                          {item.excerpt || item.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-line/60 flex items-center justify-between gap-1 text-xs font-mono">
                        <span className="text-forest dark:text-gold font-bold group-hover:underline flex items-center gap-1">
                          <span>Read Full Article</span>
                          <span className="text-gold transition-transform group-hover:translate-x-1 font-bold">→</span>
                        </span>
                        {item.images?.length > 0 && (
                          <span className="text-[10px] text-ink/40 font-mono">
                            +{item.images.length} photos
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
