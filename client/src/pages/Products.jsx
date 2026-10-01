import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import CategoryPillBar from '../components/products/CategoryPillBar.jsx';
import { SplitProductCard, BentoHighlightCard } from '../components/products/SplitProductCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';

export default function Products() {
  const { t } = useLanguage();
  const { siteContent: contextSiteContent } = useSiteContent();
  const [params, setParams] = useSearchParams();
  const [segments, setSegments] = useState([]);
  const [siteContent, setSiteContent] = useState(contextSiteContent);
  const [data, setData] = useState({ products: [], pages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const searchQuery = params.get('search') || '';
  const explicitSegmentSlug = params.get('segment') || '';
  const page = Number(params.get('page')) || 1;

  useEffect(() => {
    if (contextSiteContent) setSiteContent(contextSiteContent);
  }, [contextSiteContent]);

  useEffect(() => {
    api.get('/segments').then((r) => setSegments(r.data || [])).catch(() => {});
    if (!contextSiteContent) {
      api.get('/site-content').then((r) => setSiteContent(r.data)).catch(() => {});
    }
  }, [contextSiteContent]);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', {
        params: {
          segment: explicitSegmentSlug || undefined,
          search: searchQuery || undefined,
          page,
          limit: 18,
        },
      })
      .then((r) => setData(r.data))
      .catch(() => setData({ products: [], pages: 1, page: 1, total: 0 }))
      .finally(() => setLoading(false));
  }, [explicitSegmentSlug, searchQuery, page]);

  // Resolve effective segment: auto-detect segment when a product is searched
  const effectiveSegmentSlug = useMemo(() => {
    if (explicitSegmentSlug) return explicitSegmentSlug;
    if (searchQuery && data.products.length > 0) {
      const matchedSlugs = [
        ...new Set(data.products.map((p) => p.segment?.slug).filter(Boolean)),
      ];
      if (matchedSlugs.length === 1) {
        return matchedSlugs[0];
      }
    }
    return '';
  }, [explicitSegmentSlug, searchQuery, data.products]);

  const currentSegmentObj = useMemo(() => {
    return segments.find((s) => s.slug === effectiveSegmentSlug);
  }, [segments, effectiveSegmentSlug]);

  // Group products by segment when search matches products across multiple segments
  const groupedProductsBySegment = useMemo(() => {
    if (!searchQuery || effectiveSegmentSlug) return null;

    const map = new Map();
    data.products.forEach((p) => {
      const segId = p.segment?._id || p.segment?.slug || 'other';
      const segName = p.segment?.name || 'General Catalogue';
      const segSlug = p.segment?.slug || '';
      const segDesc = p.segment?.description || '';

      if (!map.has(segId)) {
        map.set(segId, {
          segment: { _id: segId, name: segName, slug: segSlug, description: segDesc },
          items: [],
        });
      }
      map.get(segId).items.push(p);
    });

    return Array.from(map.values());
  }, [searchQuery, effectiveSegmentSlug, data.products]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const handleSelectSegment = (slug) => {
    setParam('segment', slug);
  };

  // When submitting a search, search globally across all products so the product can be found in its segment
  const handleSearchSubmit = (term) => {
    const query = typeof term === 'string' ? term : search;
    const next = new URLSearchParams();
    if (query && query.trim()) {
      next.set('search', query.trim());
    }
    setParams(next);
    setSearch('');
  };

  const handleClearSearch = () => {
    const next = new URLSearchParams(params);
    next.delete('search');
    setParams(next);
    setSearch('');
  };

  const gotoPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productsPageCms = siteContent?.productsPage;
  const trustBar = productsPageCms?.trustBar;
  const ctaBanner = productsPageCms?.ctaBanner;

  const bentoConfig = productsPageCms?.bento;
  const bentoTitle = currentSegmentObj
    ? `${currentSegmentObj.name} Selection, Perfected`
    : bentoConfig?.headline || 'Global Food Products, Perfected';
  const bentoSubtitle = currentSegmentObj?.description || bentoConfig?.subtitle || 'Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping.';
  const bentoBullets = bentoConfig?.bullets && bentoConfig.bullets.length > 0
    ? bentoConfig.bullets
    : [
        'Direct Mundra Port (INMUN1) & JNPT Container Stuffing',
        'APEDA, Spice Board of India & FSSAI Registered Consignments',
        'European MRL & ASTA Purity Compliance with Full Batch Traceability',
        'Customized Retail Standup Pouches & Institutional Bulk Bags',
      ];

  return (
    <div className="container-x py-10 md:py-16 space-y-12">
      {/* Page Header (Dynamic from CMS) */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="h-1.5 w-5 rounded-full bg-gold" />
          <p className="eyebrow text-moss uppercase tracking-widest font-mono text-xs">
            {productsPageCms?.hero?.eyebrow || t('products') || 'CERTIFIED INDIAN EXPORTS'}
          </p>
          <span className="h-1.5 w-5 rounded-full bg-gold" />
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-ink">
          {productsPageCms?.hero?.title || t('productDetails') || 'Export Product Catalogue'}
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 leading-relaxed max-w-xl mx-auto">
          {productsPageCms?.hero?.subtitle ||
            t('productDetailsDesc') ||
            'Explore Sortex-cleaned export specifications, packaging sizes, origins and HS codes.'}
        </p>
      </div>

      {/* Category Pill Bar & Search */}
      <CategoryPillBar
        segments={segments}
        activeSegment={effectiveSegmentSlug}
        onSelectSegment={handleSelectSegment}
        search={search}
        activeSearch={searchQuery}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />

      {/* Segment and Product Alignment Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold">Category</span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            {currentSegmentObj ? currentSegmentObj.name : 'All Product Categories'}
          </h2>
          {currentSegmentObj?.description && (
            <p className="text-xs text-ink/65 mt-0.5 max-w-2xl">{currentSegmentObj.description}</p>
          )}
        </div>
        <span className="font-mono text-xs font-semibold text-moss bg-forest/5 px-3 py-1 rounded-full border border-forest/15">
          {data.total || data.products.length} Available Items
        </span>
      </div>

      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : data.products.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title={t('noMatch') || 'No products match your filters'}
            hint={t('tryClear') || 'Try clearing filters or a different search.'}
          />
        </div>
      ) : groupedProductsBySegment ? (
        <div className="space-y-10">
          {groupedProductsBySegment.map(({ segment: seg, items }) => (
            <div key={seg._id || seg.slug || seg.name} className="space-y-4 rounded-3xl border border-line/60 bg-white/40 dark:bg-white/[0.02] p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/50 pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gold">Matched Segment</span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink dark:text-paper">{seg.name}</h3>
                  {seg.description && <p className="text-xs text-ink/65 dark:text-paper/70 mt-0.5">{seg.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectSegment(seg.slug)}
                  className="font-mono text-xs font-semibold text-moss hover:text-forest dark:text-gold bg-forest/5 dark:bg-gold/10 px-3 py-1 rounded-full border border-forest/15 dark:border-gold/20 self-start sm:self-auto cursor-pointer"
                >
                  {items.length} {items.length === 1 ? 'Product' : 'Products'} in {seg.name} →
                </button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <SplitProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.products.slice(0, 3).map((p) => (
              <SplitProductCard key={p._id} product={p} />
            ))}

            {/* Product Specifications & Sourcing Guarantee Bento Box */}
            <BentoHighlightCard
              badge={bentoConfig?.badge}
              title={bentoTitle}
              subtitle={bentoSubtitle}
              bullets={bentoBullets}
              buttonText={bentoConfig?.buttonText}
              buttonLink={bentoConfig?.buttonLink}
              secondaryButtonText={bentoConfig?.secondaryButtonText}
              secondaryButtonLink={bentoConfig?.secondaryButtonLink}
            />

            {data.products.slice(3).map((p) => (
              <SplitProductCard key={p._id} product={p} />
            ))}
          </div>

          {data.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                className="btn-outline"
                disabled={page <= 1}
                onClick={() => gotoPage(page - 1)}
              >
                {t('prev') || 'Prev'}
              </button>
              <span className="px-4 font-mono text-sm text-ink/70">
                {page} / {data.pages}
              </span>
              <button
                className="btn-outline"
                disabled={page >= data.pages}
                onClick={() => gotoPage(page + 1)}
              >
                {t('next') || 'Next'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Trust Pillars Bar */}
      {trustBar?.isActive !== false && (
        <section className="rounded-3xl border border-line/70 dark:border-line bg-gradient-to-br from-white/95 via-[#fcfbfa] to-[#f7f4ed] dark:from-[#132019] dark:via-[#16271e] dark:to-[#0f1d16] p-6 sm:p-10 shadow-sm mt-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-gold">NMC ASSURANCE</span>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-ink dark:text-paper">
              {trustBar?.title || 'Why Global Buyers Trust Nirmala Multi Trading Co.'}
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(trustBar?.items && trustBar.items.length > 0
              ? trustBar.items
              : [
                  {
                    icon: '🔍',
                    title: '100% Sortex Optical Cleaning',
                    text: 'Laser graded to 99.5% European purity with zero foreign contaminants.',
                  },
                  {
                    icon: '🚢',
                    title: 'Port-Direct Logistics',
                    text: 'Express sailings from Mundra Port and JNPT Nhava Sheva to worldwide ports.',
                  },
                  {
                    icon: '📜',
                    title: 'Phyto & MRL Compliance',
                    text: 'Pre-shipment phytosanitary and aflatoxin lab assays with every container.',
                  },
                  {
                    icon: '📦',
                    title: 'Custom Packaging & Branding',
                    text: 'From 25kg multi-wall paper bags to buyer-branded retail standup pouches.',
                  },
                ]
            ).map((pillar, idx) => (
              <div
                key={pillar._id || idx}
                className="group relative rounded-2xl border border-line/60 dark:border-line bg-white dark:bg-[#182820] p-5 shadow-xs transition duration-300 hover:border-gold/60 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-forest/5 dark:bg-gold/15 text-xl transition-transform duration-300 group-hover:scale-110">
                  {pillar.icon || '✨'}
                </div>
                <h4 className="font-display text-sm font-bold text-ink dark:text-paper">
                  {pillar.title}
                </h4>
                <p className="mt-1 text-xs text-ink/70 dark:text-paper/70 leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Container Export Quotation CTA Banner */}
      {ctaBanner?.isActive !== false && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c241b] via-[#16382b] to-[#1f4e3c] p-8 sm:p-12 text-white shadow-xl border border-gold/40 mt-8">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
              {ctaBanner?.eyebrow || 'READY FOR EXPORT ORDERS'}
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-4xl font-black leading-tight text-paper">
              {ctaBanner?.title || 'Need Container Freight Quotations or Custom Samples?'}
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-paper/85 leading-relaxed">
              {ctaBanner?.description ||
                'Our international trade desk prepares formal FOB (Mundra/JNPT) or CIF proforma invoices within 12–24 business hours. Courier sample kits dispatched worldwide.'}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={ctaBanner?.buttonPrimaryLink || '/inquiry'}
                className="rounded-full bg-gold px-6 py-3 text-xs font-bold text-ink shadow-md transition hover:bg-gold/90 hover:scale-105"
              >
                {ctaBanner?.buttonPrimaryText || 'Request Official Quotation →'}
              </Link>
              <Link
                to={ctaBanner?.buttonSecondaryLink || '/brochures'}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                {ctaBanner?.buttonSecondaryText || 'Download Product Brochures'} 📄
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
