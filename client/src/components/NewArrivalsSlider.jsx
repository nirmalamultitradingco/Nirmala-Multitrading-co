import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const DEFAULT_NEW_ARRIVALS = [
  {
    _id: 'na-1',
    name: 'Sortex-Cleaned Cumin Seeds (Jeera)',
    slug: 'sortex-cumin-seeds-jeera',
    segment: { name: 'Spices & Seasonings' },
    origin: 'Unjha, Gujarat',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=75',
    shortDescription: '99.5% European purity, Sortex machine graded with volatile oil content > 3.0% and low moisture.',
    hsCode: '090931',
    packageType: '25kg Multi-wall Paper',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-2',
    name: '1121 Steam Basmati Rice (8.35mm+)',
    slug: '1121-steam-basmati-rice',
    segment: { name: 'Grains & Pulses' },
    origin: 'Punjab & Haryana',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Extra-long slender grain, rich aroma, and 2.5x elongation upon cooking. Aflatoxin tested.',
    hsCode: '100630',
    packageType: '10kg / 25kg Non-Woven',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-3',
    name: 'High Curcumin Turmeric Fingers',
    slug: 'high-curcumin-turmeric-fingers',
    segment: { name: 'Spices & Seasonings' },
    origin: 'Salem / Nizamabad',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Deep golden yellow fingers with 3.8%–5.2% natural curcumin. Free of Sudan dyes and lead chromate.',
    hsCode: '091030',
    packageType: '25kg / 50kg Jute & PP',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-4',
    name: 'Dehydrated White Onion Flakes / Kibbled',
    slug: 'dehydrated-white-onion-flakes',
    segment: { name: 'Dehydrated Foods' },
    origin: 'Mahuva, Gujarat',
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Crisp, pungent dehydrated onion kibbled with moisture < 5.5%. Microbial assay for zero Salmonella.',
    hsCode: '071220',
    packageType: '14kg Carton with Poly Liner',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-5',
    name: 'Hulled White Sesame Seeds (99.98% Purity)',
    slug: 'hulled-white-sesame-seeds',
    segment: { name: 'Oil Seeds & Commodities' },
    origin: 'Saurashtra, Gujarat',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Auto-sortex mechanical hulled white sesame for premium bakery, confectioneries, and tahini paste.',
    hsCode: '120740',
    packageType: '25kg Paper Bag / 50lb PP',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-6',
    name: 'Teja S17 Stemless Red Chilli',
    slug: 'teja-s17-stemless-red-chilli',
    segment: { name: 'Spices & Seasonings' },
    origin: 'Guntur, Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Hot fiery grade with 75,000–100,000 SHU heat value, natural red ASTA color, and stemless sorting.',
    hsCode: '090421',
    packageType: '10kg / 25kg PP Bale Packing',
    moq: '1 x 20ft FCL',
  },
];

export default function NewArrivalsSlider({ products = [], config = null }) {
  const { t } = useLanguage();

  // Prioritize active products from database (same as Featured Products), falling back to admin items or defaults
  const customItems = Array.isArray(config?.items)
    ? config.items.filter((item) => item.isActive !== false)
    : [];

  const rawProducts =
    products && products.length > 0
      ? products
      : (customItems.length > 0 ? customItems : DEFAULT_NEW_ARRIVALS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const touchStartX = useRef(null);

  // Exact same dynamic visible card count as FeaturedProductsSlider
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 768) setVisibleCount(2);
      else if (w < 1150) setVisibleCount(3);
      else setVisibleCount(4);
    };

    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  // Ensure seamless rotation without empty gaps when item count is small
  const displayProducts =
    rawProducts.length > 1 && rawProducts.length <= visibleCount
      ? [...rawProducts, ...rawProducts, ...rawProducts]
      : rawProducts;

  const total = displayProducts.length;
  const maxIndex = Math.max(0, total - visibleCount);

  // Reset index if screen resized or maxIndex changed
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [maxIndex, currentIndex]);

  // Smooth auto-rotation matching FeaturedProductsSlider (3.2s default or admin config)
  useEffect(() => {
    if (total <= 1 || maxIndex <= 0 || isHovered) return undefined;

    const intervalSeconds = Number(config?.autoRotateSeconds);
    const intervalMs =
      !isNaN(intervalSeconds) && intervalSeconds > 0
        ? intervalSeconds * 1000
        : 3200;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [total, maxIndex, isHovered, config?.autoRotateSeconds]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  if (!rawProducts.length) return null;

  const cardWidthPercent = 100 / visibleCount;

  return (
    <div
      className="relative mt-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="New Arrival Export Consignments"
    >
      {/* Slider Carousel Window with generous padding for card shadows */}
      <div className="overflow-hidden rounded-2xl py-3 px-1">
        <div
          className="flex items-stretch transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
          }}
        >
          {displayProducts.map((product, idx) => {
            const detailUrl = product.slug ? `/product-details/${product.slug}` : '/products';
            const segmentName = product.segment?.name || product.categoryName || '';
            const badgeText = product.badge || config?.badge || t('newArrival') || '✨ New Arrival';
            const imgSrc = product.image
              ? product.image.startsWith('http')
                ? product.image
                : asset(product.image)
              : '';

            return (
              <div
                key={`${product._id || product.slug || 'na'}-${idx}`}
                className="shrink-0 px-3 flex flex-col transition-all duration-300"
                style={{ width: `${cardWidthPercent}%` }}
              >
                {/* Product Card matching ProductCard design & dimensions */}
                <article className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line/80 dark:border-line bg-white dark:bg-[#132019] shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_16px_32px_rgba(22,56,43,0.12)]">
                  {/* Top Image Frame - Background fit edge-to-edge */}
                  <Link
                    to={detailUrl}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#faf8f4] dark:bg-[#0d1611] rounded-t-2xl block"
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/NMC logo.png';
                        }}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-ink/30 dark:text-paper/30 font-mono text-xs">
                        {t('noImage') || 'No image'}
                      </div>
                    )}

                    {/* HS Code Badge (Top-left) */}
                    {product.hsCode && (
                      <span className="absolute left-3 top-3 rounded-full bg-ink/85 dark:bg-black/80 backdrop-blur px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-paper border border-white/20 shadow-sm">
                        HS {product.hsCode}
                      </span>
                    )}

                    {/* New Arrival Badge (Top-right) */}
                    <span className="absolute right-3 top-3 rounded-full bg-forest/90 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-gold border border-gold/40 shadow-sm">
                      {badgeText}
                    </span>
                  </Link>

                  {/* Card Content with strict alignment and flex-1 */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    {/* Category Pill */}
                    {segmentName ? (
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest dark:text-gold bg-forest/10 dark:bg-gold/15 px-2 py-0.5 rounded w-fit mb-1.5 border border-forest/15 dark:border-gold/30 truncate max-w-full">
                        {segmentName}
                        {product.subSegment?.name ? ` · ${product.subSegment.name}` : ''}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-moss dark:text-gold bg-moss/10 dark:bg-gold/15 px-2 py-0.5 rounded w-fit mb-1.5">
                        Agro Export
                      </span>
                    )}

                    {/* Product Title (2-line clamped with uniform min-height) */}
                    <h3 className="font-display text-base font-extrabold leading-snug text-ink dark:text-paper group-hover:text-forest dark:group-hover:text-gold transition-colors line-clamp-2 min-h-[2.75rem]">
                      <Link to={detailUrl}>{product.name}</Link>
                    </h3>

                    {/* Product Short Description (2-line clamped) */}
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/65 dark:text-paper/65 min-h-[2rem]">
                      {product.shortDescription || 'Sortex cleaned export grade commodity with certified testing.'}
                    </p>

                    {/* Metadata Bar (Origin & MOQ / Packing) */}
                    <div className="mt-auto pt-3 border-t border-line/60 dark:border-line flex items-center justify-between gap-2 text-xs">
                      {product.origin ? (
                        <span className="font-mono text-[11px] text-ink/60 dark:text-paper/60 truncate" title={product.origin}>
                          📍 {product.origin}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-moss dark:text-gold font-semibold">
                          Export Grade
                        </span>
                      )}

                      {product.moq ? (
                        <span className="font-mono text-[11px] text-moss dark:text-gold font-semibold truncate">
                          MOQ: {product.moq}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-ink/50 dark:text-paper/50 truncate">
                          {product.packageType || 'Sortex Cleaned'}
                        </span>
                      )}
                    </div>

                    {/* Actions Footer: Get a Quote & Specs buttons kept as requested */}
                    <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-line/40 dark:border-line/40">
                      <Link
                        to={`/inquiry?product=${product._id || product.slug || ''}`}
                        className="flex-1 text-center rounded-xl bg-forest px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-forest/90 hover:shadow"
                      >
                        {t('getQuote') || 'Get a quote'} →
                      </Link>

                      <Link
                        to={detailUrl}
                        className="rounded-xl border border-line dark:border-line bg-white dark:bg-[#1a2c23] px-3.5 py-2 text-xs font-semibold text-ink/80 dark:text-paper/90 transition hover:border-gold hover:text-ink dark:hover:text-gold"
                      >
                        {t('specs') || 'Specs'}
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows matching FeaturedProductsSlider */}
      {rawProducts.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous arrival"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line dark:border-line bg-white/95 dark:bg-[#132019]/95 text-ink dark:text-paper shadow-lg backdrop-blur transition hover:border-gold hover:bg-forest hover:text-white dark:hover:bg-forest dark:hover:text-white"
          >
            <span className="text-xl leading-none select-none">‹</span>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next arrival"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line dark:border-line bg-white/95 dark:bg-[#132019]/95 text-ink dark:text-paper shadow-lg backdrop-blur transition hover:border-gold hover:bg-forest hover:text-white dark:hover:bg-forest dark:hover:text-white"
          >
            <span className="text-xl leading-none select-none">›</span>
          </button>
        </>
      )}

      {/* Slide Indicator Dots matching FeaturedProductsSlider */}
      {rawProducts.length > 1 && (
        <div className="mt-7 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(rawProducts.length, 8) }).map((_, idx) => {
            const activeDot = (currentIndex % Math.min(rawProducts.length, 8)) === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeDot
                    ? 'w-8 bg-forest dark:bg-gold shadow-sm'
                    : 'w-2 bg-ink/20 dark:bg-paper/20 hover:bg-ink/40'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

