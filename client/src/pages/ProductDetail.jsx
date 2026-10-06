import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';
import { BRAND } from '../config.js';

const Spec = ({ label, value }) =>
  value ? (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 border-b border-line/60 py-2.5 text-sm">
      <dt className="font-mono text-xs uppercase tracking-wide text-ink/60 dark:text-paper/60">
        {label}
      </dt>

      <dd className="sm:text-right font-medium text-ink dark:text-paper break-words">
        {value}
      </dd>
    </div>
  ) : null;

export default function ProductDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { footer } = useSiteContent();

  const [data, setData] = useState(null);
  const [active, setActive] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const contactPhone = footer?.phone || BRAND.phone || '+917069826082';

  useEffect(() => {
    setLoading(true);
    setError('');

    api
      .get(`/products/${slug}`)
      .then((r) => {
        setData(r.data);

        setActive(
          r.data.product.image ||
          r.data.product.gallery?.[0] ||
          ''
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container-x py-20">
        <EmptyState
          title={t('productNotFound')}
          hint={error}
        />
      </div>
    );
  }

  const { product, related } = data;

  const gallery = [
    product.image,
    ...(product.gallery || []),
  ].filter(Boolean);

  return (
    <div className="container-x py-10 md:py-14">

      {/* BREADCRUMB */}
      <nav className="font-mono text-xs uppercase tracking-widest text-ink/50">
        <Link
          to="/products"
          className="hover:underline"
        >
          {t('products') || 'Products'}
        </Link>

        {product.segment && (
          <>
            <span className="px-1.5">/</span>
            <Link
              to={`/products/${product.segment.slug}`}
              className="hover:underline"
            >
              {product.segment.name}
            </Link>
          </>
        )}

        {product.subSegment?.name && product.segment && (
          <>
            <span className="px-1.5">/</span>
            <Link
              to={`/products/${product.segment.slug}/${product.subSegment.slug}`}
              className="hover:underline"
            >
              {product.subSegment.name}
            </Link>
          </>
        )}

        <span className="px-1.5">/</span>
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">

        {/* =========================
            PRODUCT IMAGE
        ========================== */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-line bg-[#faf8f4] shadow-card">

            {active ? (
              <img
                src={asset(active)}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/NMC logo.png';
                  e.target.className = 'aspect-[4/3] w-full object-contain p-6';
                }}
              />
            ) : (
              <div className="grid aspect-[4/3] place-items-center text-ink/30 font-mono text-sm">
                {t('noImage') || 'Export Product Image'}
              </div>
            )}

          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">

              {gallery.map((g) => (
                <button
                  key={g}
                  onClick={() => setActive(g)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    active === g
                      ? 'border-forest dark:border-gold scale-105 shadow-sm'
                      : 'border-line/70 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={asset(g)}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/NMC logo.png';
                      e.target.className = 'h-full w-full object-contain p-1';
                    }}
                  />
                </button>
              ))}

            </div>
          )}
        </div>

        {/* =========================
            PRODUCT INFORMATION
        ========================== */}
        <div>

          {product.segment && (
            <p className="eyebrow">
              {product.segment.name}
            </p>
          )}

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mt-3 text-lg text-ink/65">
              {product.shortDescription}
            </p>
          )}

          {/* PARTNER */}
          {product.partner && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-line dark:border-line bg-white dark:bg-[#132019] p-3">

              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-line dark:bg-white/10">

                {product.partner.logo ? (
                  <img
                    src={asset(product.partner.logo)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display font-bold text-forest dark:text-gold">
                    {product.partner.name[0]}
                  </span>
                )}

              </div>

              <div className="text-sm">

                <p className="font-mono text-[11px] uppercase tracking-wide text-moss dark:text-gold">
                  Supplied by
                </p>

                <p className="font-display font-bold text-ink dark:text-paper">
                  {product.partner.name}
                </p>

              </div>

            </div>
          )}

          {/* ========================================================
              PRODUCT SPECIFICATIONS BOX (EDITABLE FROM ADMIN PANEL)
          ======================================================== */}
          <div className="mt-8 rounded-2xl border border-line/90 dark:border-line bg-[#faf8f4] dark:bg-[#132019] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-line dark:border-line pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-moss dark:text-gold">
                  Quality & Export Assurance
                </span>
                <h3 className="font-display text-base font-bold text-ink dark:text-paper">
                  Product Technical Specifications
                </h3>
              </div>
              <span className="rounded-full bg-forest/10 dark:bg-gold/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-forest dark:text-gold border border-forest/20 dark:border-gold/30">
                100% Export Grade
              </span>
            </div>

            <dl className="divide-y divide-line/60">
              <Spec label={t('origin')} value={product.origin} />
              <Spec label={t('hsCode')} value={product.hsCode} />
              <Spec label={t('boxSize')} value={product.boxSize} />
              <Spec label={t('packageType')} value={product.packageType} />
              <Spec label={t('flavour')} value={product.flavour} />
              <Spec label={t('moq')} value={product.moq} />

              {Array.isArray(product.specifications) &&
                product.specifications.map((spec, idx) => (
                  <Spec
                    key={idx}
                    label={spec.key}
                    value={spec.value}
                  />
                ))}
            </dl>

            {/* Buyer Trust Proof Micro-Badges */}
            <div className="mt-4 pt-3 border-t border-line/60 dark:border-line flex flex-wrap gap-2 text-[11px] font-mono text-ink/75 dark:text-paper/75">
              <span className="inline-flex items-center gap-1 rounded bg-forest/10 dark:bg-forest/20 text-forest dark:text-emerald-400 px-2 py-0.5 font-bold">
                ✓ 100% Sortex Cleaned
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-gold/15 text-gold px-2 py-0.5 font-bold">
                ✓ APEDA & Spice Board Reg.
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-ink/5 dark:bg-white/10 px-2 py-0.5 font-medium">
                ✓ Port Direct Mundra / JNPT
              </span>
            </div>
          </div>

          {/* PSYCHOLOGICALLY ALIGNED BUYER ACTIONS (INSTANT CIF/FOB RFQ + WHATSAPP PROCUREMENT DESK) */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to={`/inquiry?product=${product._id}`}
              className="btn-primary py-3 px-6 text-sm font-bold shadow-md inline-flex items-center gap-2"
            >
              <span>✉️</span>
              <span>{t('inquire') || 'Request Official CIF / FOB Quote'}</span>
            </Link>

            {contactPhone && (
              <a
                href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello Nirmala Multitrading Co. (NMC), I am interested in importing ${product.name} (HS Code: ${product.hsCode || 'N/A'}). Please provide container CIF / FOB price quote, lab assay specs and sample kit details.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-emerald-400/80 bg-emerald-50 dark:bg-emerald-950/60 px-5 py-3 text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition inline-flex items-center gap-2"
                title="Chat with export manager on WhatsApp"
              >
                <span>💬</span>
                <span>Chat on WhatsApp</span>
              </a>
            )}

            <Link
              to={
                product.segment && product.subSegment
                  ? `/products/${product.segment.slug}/${product.subSegment.slug}`
                  : product.segment
                    ? `/products/${product.segment.slug}`
                    : '/product-details'
              }
              className="btn-outline py-3 px-5 text-sm font-semibold inline-flex items-center gap-1.5"
            >
              <span>←</span>
              <span>{t('backToProducts') || 'Back to Products'}</span>
            </Link>
          </div>

        </div>
      </div>

      {/* PRODUCT DESCRIPTION */}
      {product.description && (
        <section className="mt-14 max-w-3xl">

          <h2 className="font-display text-xl font-bold text-ink">
            {t('productDescription')}
          </h2>

          <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/75">
            {product.description}
          </p>

        </section>
      )}

      {/* RELATED PRODUCTS */}
      {related?.length > 0 && (
        <section className="mt-16">

          <h2 className="font-display text-xl font-bold text-ink">
            {t('relatedProducts')}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {related.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
              />
            ))}

          </div>

        </section>
      )}

    </div>
  );
}