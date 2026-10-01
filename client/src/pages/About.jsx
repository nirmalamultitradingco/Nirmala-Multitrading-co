import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';
import api from '../api/axios.js';
import TestimonialsSlider from '../components/TestimonialsSlider.jsx';

const defaultAboutHero = {
  eyebrow: 'About NMC',
  title: 'India’s Taste. The World’s Table',
  description:
    'We connect trusted Indian food products with international buyers through a clear, organised export process.',
  badges: [
    '✓ APEDA & Spice Board Registered',
    '✓ Port Direct Mundra & JNPT',
    '✓ 40+ Destination Ports',
  ],
};

const defaultAboutApproach = {
  eyebrow: 'Our approach',
  title: 'What sets us apart',
  description:
    'A structured approach to sourcing, documentation and export coordination — designed to make international buying clearer and more dependable.',
  items: [
    {
      side: 'left',
      icon: '01',
      title: 'The beginning',
      description:
        'We started with a simple idea: make quality Indian food products easier for international buyers to source with confidence.',
      image:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    },
    {
      side: 'right',
      icon: '02',
      title: 'Built around quality',
      description:
        'Every product opportunity is supported with clear specifications, packaging details, certifications and practical export documentation.',
      image:
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
    },
    {
      side: 'left',
      icon: '03',
      title: 'Ready for global buyers',
      description:
        'From product selection and samples to pricing and shipment coordination, we keep the process organised around the buyer and destination market.',
      image:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    },
  ],
};

const defaultWhyChooseUs = {
  eyebrow: 'Why choose us',
  title: 'A practical partner for international food sourcing',
  description:
    'We combine product knowledge, supplier coordination and export documentation to make buying from India clearer and easier.',
  items: [
    {
      icon: '01',
      title: 'Reliable sourcing',
      description:
        'We coordinate with established growers and food companies and match products to buyer requirements.',
    },
    {
      icon: '02',
      title: 'Export-ready information',
      description:
        'Clear specifications, packaging, certifications and documentation support before shipment.',
    },
    {
      icon: '03',
      title: 'Buyer-focused coordination',
      description:
        'One organised point of contact for samples, pricing, production updates and logistics.',
    },
  ],
};

const defaultTestimonials = {
  eyebrow: 'Client feedback',
  title: 'What our clients say about us',
  description:
    'Feedback from buyers and partners who value clear communication, reliable information and a well-coordinated export process.',
  items: [
    {
      logo: 'NMC',
      quote:
        'Clear communication, practical product information and a smooth process from inquiry to shipment.',
      name: 'Amanda Smith',
      role: 'Import Buyer',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80',
      order: 1,
    },
    {
      logo: 'GLOBAL FOODS',
      quote:
        'The team understood our market requirements and helped us coordinate samples, specifications and pricing efficiently.',
      name: 'Mark Wilson',
      role: 'Procurement Manager',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80',
      order: 2,
    },
    {
      logo: 'TRADE PARTNERS',
      quote:
        'A dependable point of contact for Indian food products, export documentation and shipment coordination.',
      name: 'Jessica Smith',
      role: 'Category Manager',
      avatar:
        'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=180&q=80',
      order: 3,
    },
  ],
};

export default function About() {
  const { t } = useLanguage();
  const { siteContent } = useSiteContent();
  const [content, setContent] = useState({
    aboutHero: siteContent?.aboutHero || defaultAboutHero,
    aboutApproach: siteContent?.aboutApproach || defaultAboutApproach,
    aboutWhyChooseUs: siteContent?.aboutWhyChooseUs || defaultWhyChooseUs,
    testimonials: siteContent?.testimonials || defaultTestimonials,
    certificates: siteContent?.certificates || null,
    aboutCommitment: siteContent?.aboutCommitment || null,
    aboutCta: siteContent?.aboutCta || null,
  });

  useEffect(() => {
    if (siteContent) {
      setContent((prev) => ({
        ...prev,
        ...siteContent,
      }));
    } else {
      api
        .get('/site-content')
        .then((res) => setContent((prev) => ({ ...prev, ...res.data })))
        .catch((err) => console.error('About page content error:', err));
    }
  }, [siteContent]);

  const aboutHero = content.aboutHero || defaultAboutHero;
  const aboutApproach = content.aboutApproach || defaultAboutApproach;
  const whyChooseUs = content.aboutWhyChooseUs || defaultWhyChooseUs;
  const feedback = content.testimonials || defaultTestimonials;
  const certsConfig = content.certificates || siteContent?.certificates;
  const commitment = content.aboutCommitment;
  const aboutCta = content.aboutCta;

  return (
    <div className="overflow-x-hidden">
      {/* 1. About Header Hero */}
      <section className="border-b border-line bg-gradient-to-b from-[#fbf8f4] to-white dark:from-[#0d1611] dark:to-[#132019]">
        <div className="container-x py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="eyebrow text-gold font-mono uppercase tracking-widest text-xs">
              {aboutHero.eyebrow || 'About NMC'}
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink dark:text-paper sm:text-5xl lg:text-6xl">
              {aboutHero.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/75 dark:text-paper/75">
              {aboutHero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 text-xs font-mono">
              {(Array.isArray(aboutHero.badges) && aboutHero.badges.length > 0
                ? aboutHero.badges
                : defaultAboutHero.badges
              ).map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className={`rounded-full px-4 py-2 border font-semibold tracking-wide transition-all shadow-sm ${
                    bIdx === 0
                      ? 'bg-forest/5 dark:bg-forest/20 border-forest/20 text-forest dark:text-emerald-400'
                      : bIdx === 1
                      ? 'bg-gold/10 border-gold/30 text-gold'
                      : 'bg-ink/5 dark:bg-white/10 border-line text-ink dark:text-paper'
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Approach / What Sets Us Apart */}
      <section className="bg-paper border-b border-line py-16 md:py-24">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
            <span className="eyebrow text-gold font-mono uppercase tracking-widest text-xs font-bold">
              {aboutApproach.eyebrow || t('ourApproach') || 'Our Approach'}
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink dark:text-paper tracking-tight">
              {aboutApproach.title || t('whatSetsApart') || 'What Sets Us Apart'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink/70 dark:text-paper/70 leading-relaxed font-light">
              {aboutApproach.description}
            </p>
          </div>

          <div className="space-y-10 sm:space-y-14 max-w-5xl mx-auto">
            {(aboutApproach.items || [])
              .filter((item) => item.isActive !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => {
                const isReversed = index % 2 === 1;
                const stageNumber = item.icon || String(index + 1).padStart(2, '0');
                return (
                  <article
                    key={item._id || index}
                    className="group rounded-3xl border border-line/80 bg-white/80 dark:bg-white/[0.03] p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:border-gold/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-center">
                      {/* Media Card (5 cols) */}
                      <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/10 border border-line/60 shadow-md">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title || 'Our approach'}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full bg-forest flex items-center justify-center text-white/40 font-mono text-sm">
                              NMC Export Logistics
                            </div>
                          )}
                          <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-xs font-bold text-gold border border-white/15">
                            STEP {stageNumber}
                          </div>
                        </div>
                      </div>

                      {/* Content Card (7 cols) - Left-aligned for supreme readability */}
                      <div className={`lg:col-span-7 space-y-4 text-left ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="inline-flex items-center gap-2 rounded-full bg-forest/5 dark:bg-emerald-500/10 border border-forest/15 dark:border-emerald-500/20 px-3.5 py-1 text-xs font-mono font-bold text-forest dark:text-emerald-400">
                          <span>STAGE {stageNumber}</span>
                          <span className="text-forest/40 dark:text-emerald-500/40">•</span>
                          <span className="text-gold font-semibold uppercase">Export Excellence</span>
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink dark:text-paper leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-base sm:text-lg leading-relaxed text-ink/75 dark:text-paper/75 font-normal">
                          {item.description}
                        </p>

                        <div className="pt-2 flex items-center gap-2 text-xs font-mono text-moss dark:text-emerald-400 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          <span>NMC Certified Export Protocol</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>

      {/* 3. Our Promise / Start a conversation */}
      {(!commitment || commitment.isActive !== false) && (
        <section className="border-b border-line bg-white dark:bg-surface py-14 md:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-[#fbf9f4] dark:bg-[#122119] p-8 md:p-12 shadow-sm text-center">
              <span className="eyebrow text-gold font-mono uppercase tracking-widest text-xs">
                {commitment?.eyebrow || 'Our Commitment'}
              </span>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold text-ink dark:text-paper">
                {commitment?.title || 'Transparent, Direct & Zero-Friction Exporting'}
              </h3>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-ink/75 dark:text-paper/75">
                {commitment?.description ||
                  'We understand that every export requirement is different. We combine product knowledge, supplier coordination and documentation support to help buyers move from enquiry to shipment with fewer surprises.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  to={commitment?.buttonPrimaryLink || '/inquiry?source=aboutConversation'}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <span>{commitment?.buttonPrimaryText || 'Start a conversation'}</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  to={commitment?.buttonSecondaryLink || '/products'}
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <span>{commitment?.buttonSecondaryText || 'Browse Products'}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Why Choose Us (Aligned Grid with Equal Heights) */}
      <section className="border-b border-line bg-white dark:bg-surface py-16 md:py-20">
        <div className="container-x">
          <div className="about-section-intro">
            <p className="eyebrow text-moss font-mono uppercase tracking-widest text-xs">{whyChooseUs.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink dark:text-paper">{whyChooseUs.title}</h2>
            <p className="max-w-2xl text-ink/70 dark:text-paper/70">{whyChooseUs.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-10">
            {(whyChooseUs.items || [])
              .filter((item) => item.isActive !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => (
                <article
                  key={item._id || index}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-[#fbf9f4] dark:bg-[#122119] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white dark:hover:bg-[#15271e] hover:shadow-xl"
                >
                  <div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="mb-5 h-40 w-full rounded-xl object-cover"
                      />
                    )}
                    <span className="font-mono text-sm font-bold text-gold">
                      {item.icon || String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-ink dark:text-paper group-hover:text-forest dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/50 font-mono text-[11px] text-moss font-semibold">
                    ✓ NMC Quality Verified
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Slider */}
      <TestimonialsSlider testimonials={feedback} />

      {/* 7. Call To Action */}
      {(!aboutCta || aboutCta.isActive !== false) && (
        <section className="container-x py-16 md:py-24">
          <div className="rounded-3xl border border-line bg-white dark:bg-surface p-8 text-center shadow-card md:p-14">
            <h2 className="font-display text-2xl font-extrabold text-ink dark:text-paper sm:text-3xl lg:text-4xl">
              {aboutCta?.title || t('specificProduct')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/70 dark:text-paper/70">
              {aboutCta?.description || t('specificPrompt')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to={aboutCta?.buttonPrimaryLink || '/inquiry'} className="btn-primary">
                {aboutCta?.buttonPrimaryText || t('getInTouch')}
              </Link>
              <Link to={aboutCta?.buttonSecondaryLink || '/brochures'} className="btn-outline">
                {aboutCta?.buttonSecondaryText || t('downloadLineCard') || 'Download Line Cards'}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
