import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ProductCard({ product, disableLink = false }) {
  const { t } = useLanguage();

  const content = (
    <>
      {/* Top Image Frame - Background fit edge-to-edge */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#faf8f4] dark:bg-[#0d1611] rounded-t-2xl">
        {product.image ? (
          <img
            src={asset(product.image)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/NMC logo.png';
              e.target.className = 'h-full w-full object-contain p-4';
            }}
          />
        ) : (
          <div className="grid h-full place-items-center text-ink/30 dark:text-paper/30 font-mono text-xs">
            {t('noImage') || 'Export Product'}
          </div>
        )}

        {/* HS Code Badge (Top-left) */}
        {product.hsCode && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 dark:bg-black/80 backdrop-blur-md px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-paper border border-white/20 shadow-sm">
            HS {product.hsCode}
          </span>
        )}

        {/* Featured Tag (Top-right) */}
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-forest/90 dark:bg-forest/95 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-gold border border-gold/40 shadow-sm backdrop-blur-md">
            {t('featured') || 'Featured'}
          </span>
        )}
      </div>

      {/* Card Content with strict alignment and flex-1 */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category Pill */}
        {product.segment?.name ? (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest dark:text-gold bg-forest/10 dark:bg-gold/15 px-2 py-0.5 rounded w-fit mb-1.5 border border-forest/15 dark:border-gold/30 truncate max-w-full">
            {product.segment.name}
            {product.subSegment?.name ? ` · ${product.subSegment.name}` : ''}
          </span>
        ) : (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-moss dark:text-gold bg-moss/10 dark:bg-gold/15 px-2 py-0.5 rounded w-fit mb-1.5">
            Agro Export
          </span>
        )}

        {/* Product Title (2-line clamped with uniform min-height) */}
        <h3 className="font-display text-base font-extrabold leading-snug text-ink dark:text-paper group-hover:text-forest dark:group-hover:text-gold transition-colors line-clamp-2 min-h-[2.75rem]">
          {product.name}
        </h3>

        {/* Product Short Description (2-line clamped) */}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/65 dark:text-paper/65 min-h-[2rem]">
          {product.shortDescription || 'Sortex cleaned export grade commodity with certified testing.'}
        </p>

        {/* Bottom Alignment Bar (Sticks to bottom of card via mt-auto) */}
        <div className="mt-auto pt-3 border-t border-line/60 dark:border-line flex items-center justify-between gap-2 text-xs">
          {product.origin ? (
            <span className="font-mono text-[11px] text-ink/65 dark:text-paper/65 truncate" title={product.origin}>
              📍 {product.origin}
            </span>
          ) : product.moq ? (
            <span className="font-mono text-[11px] text-ink/65 dark:text-paper/65 truncate">
              MOQ: {product.moq}
            </span>
          ) : (
            <span className="font-mono text-[11px] text-moss dark:text-gold font-semibold">
              Export Grade
            </span>
          )}

          {!disableLink && (
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-forest dark:text-gold group-hover:text-gold transition-colors shrink-0">
              {t('viewProduct') || 'View'} →
            </span>
          )}
        </div>
      </div>
    </>
  );

  const cardClasses =
    'group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line/80 dark:border-line bg-white dark:bg-[#132019] shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_16px_32px_rgba(22,56,43,0.12)]';

  if (disableLink) {
    return <article className={cardClasses}>{content}</article>;
  }

  return (
    <Link to={`/product-details/${product.slug}`} className={cardClasses}>
      {content}
    </Link>
  );
}
