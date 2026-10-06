
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

import HeroSlider from '../components/HeroSlider.jsx';
import FeaturedProductsSlider from '../components/FeaturedProductsSlider.jsx';
import NewArrivalsSlider from '../components/NewArrivalsSlider.jsx';
import ExploreProductsSlider from '../components/ExploreProductsSlider.jsx';
import EngineerTradeSection from '../components/EngineerTradeSection.jsx';
import PartnersSlider from '../components/PartnersSlider.jsx';
import GlobalServedMap from '../components/GlobalServedMap.jsx';
import CertificateSlider from '../components/CertificateSlider.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Home() {
  const { t } = useLanguage();
  const [data, setData] = useState({
    segments: [],
    featured: [],
    newArrivals: [],
    partners: [],
    engineerTrade: null,
    homeHero: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHomeData = async () => {
      try {
        const [seg, prodFeatured, prodLatest, part, content] = await Promise.all([
          api.get('/segments'),
          api.get('/products', {
            params: {
              featured: 'true',
              limit: 12,
            },
          }),
          api.get('/products', {
            params: {
              sort: 'latest',
              limit: 12,
            },
          }),
          api.get('/partners'),
          api.get('/site-content'),
        ]);

        if (!mounted) return;

        const segments = Array.isArray(seg?.data) ? seg.data : [];
        const featured = Array.isArray(prodFeatured?.data?.products) ? prodFeatured.data.products : [];
        const newArrivals = Array.isArray(prodLatest?.data?.products) ? prodLatest.data.products : [];
        const partners = Array.isArray(part?.data) ? part.data : [];
        const engineerTrade = content?.data?.engineerTrade || null;
        const homeHero = content?.data?.homeHero || null;
        const newArrivalsContent = content?.data?.newArrivals || null;
        const featuredSection = content?.data?.featuredSection || null;
        const exploreProductsSection = content?.data?.exploreProductsSection || null;
        const partnersSection = content?.data?.partnersSection || null;
        const homeCta = content?.data?.homeCta || null;

        setData({
          segments,
          featured,
          newArrivals,
          partners,
          engineerTrade,
          homeHero,
          newArrivalsContent,
          featuredSection,
          exploreProductsSection,
          partnersSection,
          homeCta,
        });
      } catch (error) {
        console.error('Home page API error:', error);

        if (!mounted) return;

        setData({
          segments: [],
          featured: [],
          newArrivals: [],
          partners: [],
          engineerTrade: null,
          newArrivalsContent: null,
          featuredSection: null,
          exploreProductsSection: null,
          partnersSection: null,
          homeCta: null,
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll('.home-reveal, .home-reveal-item');
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [loading, data.featured.length, data.newArrivals.length, data.segments.length, data.partners.length, data.engineerTrade]);

  return (
    <div className="overflow-x-hidden">
      {/* 1. HERO BANNER */}
      <HeroSlider heroContent={data.homeHero} />

      {/* EXPORT CREDENTIALS & PORT PROXIMITY TRUST RIBBON */}
      <div className="border-y border-line/70 bg-[#fbf9f4] dark:bg-[#101b15] py-3 sm:py-3.5 transition-colors">
        <div className="container-x flex items-center justify-between gap-4 overflow-x-auto scrollbar-none text-xs font-mono">
          <div className="flex items-center gap-2 shrink-0 text-ink/80 dark:text-paper/80 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>APEDA Reg. Merchant Exporter</span>
          </div>
          <span className="text-ink/20 dark:text-paper/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 shrink-0 text-ink/80 dark:text-paper/80 font-bold">
            <span>🌿</span>
            <span>Spices Board of India</span>
          </div>
          <span className="text-ink/20 dark:text-paper/20 hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 shrink-0 text-ink/80 dark:text-paper/80 font-bold">
            <span>📜</span>
            <span>FSSAI Central Food Safety</span>
          </div>
          <span className="text-ink/20 dark:text-paper/20 hidden lg:inline">•</span>
          <div className="flex items-center gap-1.5 shrink-0 text-ink/80 dark:text-paper/80 font-bold">
            <span>⚓</span>
            <span>Port Direct: Mundra &amp; JNPT</span>
          </div>
          <span className="text-ink/20 dark:text-paper/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 shrink-0 text-gold font-bold">
            <span>🌍</span>
            <span>40+ Global Destination Ports</span>
          </div>
        </div>
      </div>

      {/* API CONTENT */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* 2. FEATURED PRODUCTS (AUTO-ROTATING CAROUSEL) */}
          {data.featured.length > 0 && (!data.featuredSection || data.featuredSection.isActive !== false) && (
            <section className="container-x py-16 md:py-20 home-reveal-section">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end home-reveal">
                <SectionHeading
                  eyebrow={data.featuredSection?.eyebrow || t('nextShipment') || 'The next shipment'}
                  title={data.featuredSection?.title || t('featuredProducts') || 'Featured product details'}
                />
                <Link
                  to={data.featuredSection?.linkTo || '/product-details'}
                  className="text-sm font-semibold text-forest hover:text-ink transition hover:underline"
                >
                  {data.featuredSection?.linkText || t('viewAll') || 'All product details →'}
                </Link>
              </div>

              <FeaturedProductsSlider products={data.featured} />
            </section>
          )}

          {/* 3. NEW PRODUCT ARRIVALS (AUTO-ROTATING CAROUSEL SLIDE) */}
          {(!data.newArrivalsContent || data.newArrivalsContent.isActive !== false) && (
            <section className="container-x py-16 md:py-20 home-reveal-section border-t border-line/60">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end home-reveal">
                <div>
                  <SectionHeading
                    eyebrow={data.newArrivalsContent?.eyebrow || 'Fresh Season Harvest'}
                    title={data.newArrivalsContent?.title || 'New Arrival Export Consignments'}
                  />
                  {data.newArrivalsContent?.description && (
                    <p className="mt-2 text-sm text-ink/70 dark:text-paper/70 max-w-2xl">
                      {data.newArrivalsContent.description}
                    </p>
                  )}
                </div>
                <Link
                  to="/products"
                  className="text-sm font-semibold text-forest dark:text-gold hover:text-ink dark:hover:text-paper transition hover:underline"
                >
                  {t('browseProducts') || 'Browse all categories →'}
                </Link>
              </div>

              <NewArrivalsSlider
                config={data.newArrivalsContent}
                products={data.newArrivals}
              />
            </section>
          )}

          {/* 4. EXPLORE OUR PRODUCTS (AUTO-ROTATING CAROUSEL) */}
          {data.segments.length > 0 && (!data.exploreProductsSection || data.exploreProductsSection.isActive !== false) && (
            <ExploreProductsSlider
              segments={data.segments}
              config={data.exploreProductsSection}
            />
          )}

          {/* 5. ENGINEER HIGH-VOLUME TRADE (ADMIN-MANAGED WITH GREEN BACKGROUND) */}
          <EngineerTradeSection content={data.engineerTrade} />

          {/* 6. COMPANIES WE WORK WITH (AUTO-ROTATING CAROUSEL) */}
          {data.partners.length > 0 && (!data.partnersSection || data.partnersSection.isActive !== false) && (
            <PartnersSlider
              partners={data.partners}
              config={data.partnersSection}
            />
          )}
        </>
      )}

      {/* 7. GLOBAL EXPORT DESTINATIONS MAP */}
      <GlobalServedMap />

      {/* 8. CERTIFICATES & ACCREDITATIONS (AUTO-ROTATING CAROUSEL) */}
      <CertificateSlider />

      {/* 9. CALL TO ACTION */}
      {(!data.homeCta || data.homeCta.isActive !== false) && (
        <section className="container-x py-16 md:py-24 home-reveal-section">
          <div className="home-reveal overflow-hidden rounded-3xl bg-forest px-8 py-16 text-center text-paper md:px-16 shadow-2xl">
            <p className="eyebrow text-gold">
              {(data.homeCta?.eyebrow || t('readyToTalk') || 'Ready to talk?').replace(/\?+$/, '?')}
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {data.homeCta?.title || t('buyingPrompt') || "Tell us what you're buying — we'll send samples and pricing."}
            </h2>
            {data.homeCta?.description && (
              <p className="mx-auto mt-3 max-w-xl text-paper/75 text-sm sm:text-base leading-relaxed">
                {data.homeCta.description}
              </p>
            )}
            <Link to={data.homeCta?.buttonLink || '/inquiry'} className="btn-gold mt-8 inline-block">
              {data.homeCta?.buttonText || t('sendInquiry') || 'Send an inquiry'}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

