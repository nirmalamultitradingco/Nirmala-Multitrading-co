import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';
import { BRAND } from '../config.js';

export default function SegmentBrochures() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { header } = useSiteContent();
  const brandName = header?.brandFullName || BRAND.fullName;

  const [segment, setSegment] = useState(null);
  const [allSegments, setAllSegments] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeMediaTab, setActiveMediaTab] = useState('video'); // 'video' | 'image'

  const loadData = () => {
    setLoading(true);
    return Promise.all([
      api.get(`/segments/${slug}`).catch(() => ({ data: null })),
      api.get('/brochures', { params: { segment: slug } }).catch(() => ({ data: [] })),
      api.get('/segments').catch(() => ({ data: [] })),
    ])
      .then(([segRes, broRes, allSegsRes]) => {
        const segData = segRes?.data?.segment || segRes?.data;
        if (!segData || !segData._id) {
          navigate('/brochures', { replace: true });
          return;
        }
        setSegment(segData);
        if (segData.video) {
          setActiveMediaTab('video');
        } else if (segData.image) {
          setActiveMediaTab('image');
        }
        setBrochures(broRes.data || []);
        setAllSegments(allSegsRes.data || []);
      })
      .catch((err) => {
        console.error('Failed to load segment brochures:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Filtered brochures by search
  const filteredBrochures = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brochures;
    return brochures.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q))
    );
  }, [brochures, search]);

  // Other segments (excluding current)
  const otherSegments = useMemo(() => {
    return allSegments.filter((s) => s.slug !== slug && s._id !== segment?._id);
  }, [allSegments, slug, segment]);

  const hasSegmentMedia = Boolean(segment?.video || segment?.image);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-paper text-ink">
        <Loader />
      </div>
    );
  }

  if (!segment) return null;

  return (
    <div className="overflow-x-hidden min-h-screen bg-paper text-ink transition-colors">
      {/* 1. SEGMENT HEADER HERO BANNER WITH CINEMA SHOWCASE */}
      <section className="relative overflow-hidden border-b border-line bg-[#0d1e17] py-14 md:py-20 text-paper">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-forest/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

        <div className="container-x relative">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <nav className="flex items-center gap-2 text-xs font-mono text-paper/70">
              <Link to="/" className="hover:text-gold transition">
                Home
              </Link>
              <span>/</span>
              <Link to="/brochures" className="hover:text-gold transition">
                Brochures
              </Link>
              <span>/</span>
              <span className="text-gold font-bold">{segment?.name || 'Segment'}</span>
            </nav>

            <Link
              to="/brochures"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-mono text-paper/90 hover:bg-white/20 hover:text-white transition cursor-pointer"
            >
              <span>←</span>
              <span>All Product Segments</span>
            </Link>
          </div>

          <div className="grid gap-10 items-center lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2.5">
                <span className="eyebrow text-gold">Official Export Catalogues</span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-gold backdrop-blur">
                  {brochures.length} {brochures.length === 1 ? 'Catalogue' : 'Catalogues'}
                </span>
              </div>

              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {segment?.name || 'Segment'} Catalogues & Specifications
              </h1>

              <p className="mt-4 text-base leading-relaxed text-paper/80 sm:text-lg max-w-2xl">
                {segment?.description ||
                  `Download verified export specifications, packing options, container stuffing capacities, and HS codes for our ${segment?.name || 'product'} range.`}
              </p>

              {/* Action buttons in hero */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={`/products/${segment?.slug || slug}`}
                  className="btn-primary text-xs py-2.5 px-5 shadow-lg inline-flex items-center gap-2"
                >
                  <span>Browse {segment?.name || 'Segment'} Products</span>
                  <span>→</span>
                </Link>

                <Link
                  to={`/inquiry?subject=${encodeURIComponent(`Catalogue Inquiry - ${segment?.name || 'Segment'}`)}`}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-paper/90 hover:bg-white/20 hover:text-white transition"
                >
                  Request Custom Quote for {segment?.name || 'Segment'} ✉️
                </Link>
              </div>
            </div>

            {/* Right Media Column: Segment Video / Image Cinema Showcase */}
            <div className="lg:col-span-5">
              <div className="relative group">
                {/* Ambient theater glow reflection */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-gold/30 via-emerald-600/25 to-gold/20 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Outer Luxury Glass Bezel */}
                <div className="relative rounded-[26px] bg-gradient-to-b from-white/15 via-white/5 to-white/10 p-2 sm:p-2.5 backdrop-blur-xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
                  {hasSegmentMedia ? (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#07130e] border border-gold/30 shadow-inner flex items-center justify-center">
                      {/* Media switcher pills when both video and image exist */}
                      {segment?.video && segment?.image && (
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
                            <span>Video</span>
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
                            <span>Photo</span>
                          </button>
                        </div>
                      )}

                      {/* Video View */}
                      {((activeMediaTab === 'video' && segment?.video) || (!segment?.image && segment?.video)) ? (
                        <div className="relative h-full w-full bg-black flex items-center justify-center">
                          <video
                            key={segment?.video}
                            src={asset(segment?.video)}
                            poster={segment?.image ? asset(segment?.image) : undefined}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                          {/* Corner Quality Tag */}
                          <div className="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 font-mono text-[9px] font-bold text-gold border border-gold/40 backdrop-blur shadow-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {segment?.name || 'Segment'} Tour
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Image View */
                        <div className="relative h-full w-full bg-[#102018] group/img overflow-hidden">
                          <img
                            src={asset(segment?.image)}
                            alt={segment?.name || 'Segment'}
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
                              Export Grade
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-paper/90 pointer-events-none">
                            <span className="font-bold text-white drop-shadow">{segment?.name || 'Segment'} Commodity Range</span>
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
                          ★ {(segment?.name || 'Segment').toUpperCase()} EXPORT
                        </span>
                        <span className="font-mono text-[10px] text-paper/60">Verified Spec</span>
                      </div>
                      <div className="text-center my-auto py-2">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30 text-2xl">
                          🌾
                        </div>
                        <h4 className="font-display text-lg font-bold text-white">{segment?.name || 'Segment'} Specifications</h4>
                        <p className="mt-1 text-xs text-paper/70 font-mono">Download official line cards and packaging metrics</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-paper/60">
                        <span>ISO 22000 / APEDA Verified</span>
                        <span className="text-gold">International Export Standard</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BROCHURES LIST SECTION */}
      <section className="container-x py-14 md:py-20">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <span className="eyebrow text-moss">Available Documents</span>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink dark:text-paper sm:text-3xl">
              {segment?.name || 'Segment'} Line Cards ({filteredBrochures.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute left-3.5 top-2.5 text-ink/40 text-xs">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${segment?.name || 'segment'}…`}
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
        </div>

        {/* Brochure Cards */}
        {filteredBrochures.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <EmptyState
              title={
                search
                  ? 'No brochures match your search query'
                  : `No brochures published yet for ${segment?.name || 'this segment'}`
              }
              hint={
                search
                  ? 'Try clearing your search term.'
                  : 'We are preparing official brochures for this segment. Please submit an inquiry for instant specs.'
              }
            />

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to={`/inquiry?subject=${encodeURIComponent(`Custom Specification Sheet - ${segment?.name || 'Segment'}`)}`}
                className="btn-primary text-xs py-2.5 px-5"
              >
                Request Specifications for {segment?.name || 'Segment'} →
              </Link>
              <Link to="/brochures" className="btn-outline text-xs py-2.5 px-4">
                ← View All Other Segments
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBrochures.map((b) => (
              <div
                key={b._id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white dark:bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-xl"
              >
                <div>
                  {/* Document Cover Thumbnail */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#0d1e17] to-[#1a382c] p-6 text-paper flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur">
                        <span>📄</span> PDF CATALOGUE
                      </span>
                      <span className="rounded-full bg-gold/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold">
                        {segment?.name || 'Segment'}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="h-1 w-10 rounded-full bg-gold mb-2 transition-all duration-300 group-hover:w-16" />
                      <h4 className="font-display text-lg font-extrabold text-white line-clamp-2">
                        {b.title}
                      </h4>
                      <p className="mt-1 font-mono text-[11px] text-paper/60">{brandName}</p>
                    </div>

                    <div className="text-[10px] font-mono text-paper/40 flex justify-between items-center border-t border-white/10 pt-2">
                      <span>Export Grade</span>
                      <span>Verified PDF Document</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink dark:text-paper group-hover:text-forest dark:group-hover:text-gold transition-colors">
                      {b.title}
                    </h3>
                    {b.description ? (
                      <p className="mt-2.5 text-xs leading-relaxed text-ink/65 dark:text-paper/65 line-clamp-3">
                        {b.description}
                      </p>
                    ) : (
                      <p className="mt-2.5 text-xs leading-relaxed text-ink/50 dark:text-paper/50 italic">
                        Official export product list and specification sheet with container load metrics.
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-2 border-t border-line/60 pt-3 text-[11px] font-mono text-moss">
                      <span>✓ Ready for download</span>
                      <span>•</span>
                      <span>PDF format</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0">
                  <div className="flex gap-2.5">
                    <a
                      href={asset(b.file)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 btn-primary text-xs py-2.5 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      aria-label={`${t('openBrochure')}: ${b.title}`}
                    >
                      <span>{t('openBrochure') || 'Open PDF'}</span>
                      <span aria-hidden="true">↗</span>
                    </a>

                    <a
                      href={asset(b.file)}
                      download
                      className="btn-outline text-xs px-3.5 py-2.5 text-center flex items-center justify-center cursor-pointer"
                      aria-label={`Download ${b.title}`}
                      title="Download PDF"
                    >
                      <span>⬇</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. EXPLORE OTHER SEGMENTS SECTION */}
        {otherSegments.length > 0 && (
          <div className="mt-20 pt-12 border-t border-line">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="eyebrow text-gold">Other Commodity Categories</span>
                <h3 className="mt-1 font-display text-xl font-bold text-ink dark:text-paper">
                  Explore Catalogues in Other Segments
                </h3>
              </div>
              <Link
                to="/brochures"
                className="text-xs font-mono font-semibold text-forest dark:text-gold hover:underline"
              >
                View all categories →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {otherSegments.map((s) => (
                <Link
                  key={s._id}
                  to={`/brochures/${s.slug || s._id}`}
                  className="group rounded-2xl border border-line bg-white dark:bg-surface p-4 shadow-xs hover:border-gold/60 hover:shadow-md transition flex items-center gap-3.5"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-forest/10 shrink-0">
                    {s.image ? (
                      <img
                        src={asset(s.image)}
                        alt={s.name}
                        className="h-full w-full object-cover object-center transition-transform group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/NMC logo.png';
                          e.currentTarget.className = 'h-full w-full object-contain p-1';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-lg">🌾</div>
                    )}
                    {s.video && (
                      <span className="absolute bottom-0 right-0 rounded-tl-md bg-emerald-950/90 text-emerald-300 text-[8px] font-mono px-1 font-bold">
                        🎬
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xs font-bold text-ink dark:text-paper truncate group-hover:text-forest dark:group-hover:text-gold transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-[11px] font-mono text-ink/50 dark:text-paper/50 mt-0.5">
                      View catalogues →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
