import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { BRAND } from '../config.js';
import SectionHeading from '../components/SectionHeading.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSiteContent } from '../context/SiteContentContext.jsx';

const empty = { name: '', email: '', phone: '', company: '', country: '', message: '' };

export default function Inquiry() {
  const [params] = useSearchParams();
  const { productSlug } = useParams();
  const fromAboutConversation = params.get('source') === 'aboutConversation';
  const countryParam = params.get('country') || '';
  const routeParam = params.get('route') || '';
  
  const [form, setForm] = useState({
    ...empty,
    country: countryParam || '',
    message: routeParam ? `Inquiry regarding container export freight to ${routeParam}. Please provide quote and transit schedule.` : '',
  });
  const [interest, setInterest] = useState('');
  const [segments, setSegments] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const nameInputRef = useRef(null);

  const { t } = useLanguage();
  const { siteContent, footer } = useSiteContent();

  const [hero, setHero] = useState({
    eyebrow: siteContent?.inquiryHero?.eyebrow || 'Get in touch',
    title: siteContent?.inquiryHero?.title || "We're ready to talk.",
    description:
      siteContent?.inquiryHero?.description ||
      'Tell us what you are looking for and our export team will get back to you with product details, samples and pricing.',
  });

  const contactEmail = footer?.email || BRAND.email;
  const contactPhone = footer?.phone || BRAND.phone;
  const contactAddress = footer?.address || BRAND.address;

  useEffect(() => {
    // Focus first input field when arriving at inquiry form
    const focusTimer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (siteContent?.inquiryHero) {
      setHero(siteContent.inquiryHero);
    }
  }, [siteContent]);

  useEffect(() => {
    Promise.all([
      api.get('/segments'),
      api.get('/products', { params: { limit: 100 } }),
      api.get('/site-content'),
    ])
      .then(([segRes, productRes, contentRes]) => {
        const segs = segRes.data || [];
        const prods = productRes.data?.products || [];
        setSegments(segs);
        setProducts(prods);

        if (contentRes.data?.inquiryHero) setHero(contentRes.data.inquiryHero);

        // Pre-select if URL params or route param provided
        const segParam = params.get('segment');
        const prodParam = params.get('product') || productSlug;

        if (segParam && segParam !== 'all') {
          const match = segs.find((s) => s._id === segParam || s.slug === segParam);
          if (match) setInterest(`segment:${match._id}`);
        } else if (prodParam) {
          const match = prods.find((p) => p._id === prodParam || p.slug === prodParam);
          if (match) setInterest(`product:${match._id}`);
        }
      })
      .catch((err) => console.error('Inquiry page content error:', err));
  }, [params, productSlug]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });

    try {
      const payload = { ...form };

      if (interest.startsWith('segment:')) {
        const segId = interest.replace('segment:', '');
        const seg = segments.find((s) => s._id === segId);
        payload.segment = segId;
        payload.productInterest = seg ? seg.name : '';
        payload.interestType = 'segment';
      } else if (interest.startsWith('product:')) {
        const prodId = interest.replace('product:', '');
        const prod = products.find((p) => p._id === prodId);
        payload.product = prodId;
        payload.productInterest = prod ? prod.name : '';
        payload.interestType = 'product';
      } else {
        payload.productInterest = routeParam ? `Export Route: ${routeParam}` : 'General inquiry';
        payload.interestType = 'general';
      }

      const res = await api.post('/inquiries', payload);
      setStatus({ state: 'success', message: res.data.message });
      setForm({ ...empty });
      setInterest('');
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <div className="container-x grid gap-12 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-20">
      <div>
        <SectionHeading
          eyebrow={hero.eyebrow}
          title={fromAboutConversation ? "We're ready to talk." : (hero.title === "We're ready to talk." ? '' : hero.title)}
        >
          {hero.description}
        </SectionHeading>

        <div className="mt-8 space-y-5 text-sm">
          <div className="rounded-2xl border border-line bg-white/50 dark:bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-moss font-bold">{t('email') || 'Email'}</p>
            <a href={`mailto:${contactEmail}`} className="font-display text-lg font-bold text-ink hover:text-forest hover:underline">
              {contactEmail}
            </a>
          </div>

          <div className="rounded-2xl border border-line bg-white/50 dark:bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-moss font-bold">{t('phone') || 'Phone'}</p>
            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="font-display text-lg font-bold text-ink hover:text-forest">
              {contactPhone}
            </a>
          </div>

          <div className="rounded-2xl border border-line bg-white/50 dark:bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-moss font-bold">{t('office') || 'Registered Office & Port Hub'}</p>
            <p className="font-display text-base font-bold text-ink">{contactAddress}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white dark:bg-surface p-6 shadow-card md:p-8">
        {status.state === 'success' ? (
          <div className="grid place-items-center py-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-forest text-2xl text-paper">✓</span>
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">{t('inquirySent') || 'Inquiry Sent!'}</h3>
            <p className="mt-2 max-w-sm text-sm text-ink/70">{status.message}</p>
            <button className="btn-outline mt-6" onClick={() => setStatus({ state: 'idle', message: '' })}>
              {t('sendAnother') || 'Send Another Inquiry'}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">{t('name')} *</label>
              <input
                id="name"
                name="name"
                ref={nameInputRef}
                autoFocus
                className="field"
                required
                value={form.name}
                onChange={update}
              />
            </div>
            <div>
              <label className="label" htmlFor="email">{t('email')} *</label>
              <input id="email" name="email" type="email" className="field" required value={form.email} onChange={update} />
            </div>
            <div>
              <label className="label" htmlFor="phone">{t('phone')}</label>
              <input id="phone" name="phone" className="field" value={form.phone} onChange={update} placeholder="+1 / +44 / +971..." />
            </div>
            <div>
              <label className="label" htmlFor="company">{t('company')}</label>
              <input id="company" name="company" className="field" value={form.company} onChange={update} placeholder="e.g. Global Foods Trading" />
            </div>
            <div>
              <label className="label" htmlFor="country">{t('country')}</label>
              <input id="country" name="country" className="field" value={form.country} onChange={update} placeholder="e.g. United States, UAE, UK" />
            </div>
            <div>
              <label className="label" htmlFor="interest">{t('productInterest') || 'Product Interest'}</label>
              <select
                id="interest"
                name="interest"
                className="field"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              >
                <option value="">{t('generalInquiry') || 'General Inquiry / Freight Quote'}</option>
                {segments.length > 0 && (
                  <optgroup label={t('productSegments') || 'Product Categories'}>
                    {segments.map((s) => (
                      <option key={s._id} value={`segment:${s._id}`}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {products.length > 0 && (
                  <optgroup label={t('specificProducts') || 'Specific Products'}>
                    {products.map((p) => (
                      <option key={p._id} value={`product:${p._id}`}>
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="message">{t('message')}</label>
              <textarea id="message" name="message" rows="5" className="field" required value={form.message} onChange={update} placeholder="Please describe required quantities, packing preferences (e.g. 25kg bulk bags, retail pouches), and port of delivery..." />
            </div>
            {status.state === 'error' && (
              <p className="sm:col-span-2 rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay font-medium">{status.message}</p>
            )}
            <div className="sm:col-span-2">
              <button className="btn-primary w-full shadow-md hover:shadow-lg" disabled={status.state === 'loading'}>
                {status.state === 'loading' ? (t('sending') || 'Sending…') : (t('submitInquiry') || 'Submit Inquiry →')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
