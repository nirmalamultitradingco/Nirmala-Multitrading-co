import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { asset } from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const statusStyles = {
  new: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
  read: 'bg-sky-100 text-sky-900 border-sky-300 font-semibold',
  responded: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerMsg, setBannerMsg] = useState('');

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: '☀️', message: 'Review new buyer inquiries and keep your export catalogue updated.' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: '🌤️', message: 'Tracking trade consignments, buyer inquiries, and catalogue items.' };
    if (hour >= 17 && hour < 22) return { text: 'Good Evening', icon: '🌙', message: 'Wrap up your daily export operations and inspect website traffic.' };
    return { text: 'Good Night / Late Shift', icon: '🌌', message: 'Admin portal is active 24/7 with automated inquiry capture.' };
  };

  const greeting = getTimeGreeting();

  const loadData = () => {
    return Promise.all([
      api.get('/segments', { params: { all: true } }).catch(() => ({ data: [] })),
      api.get('/subsegments', { params: { all: true } }).catch(() => ({ data: [] })),
      api.get('/products', { params: { admin: true, limit: 6 } }).catch(() => ({ data: { total: 0, products: [] } })),
      api.get('/partners', { params: { all: true } }).catch(() => ({ data: [] })),
      api.get('/inquiries').catch(() => ({ data: [] })),
      api.get('/subscribers').catch(() => ({ data: [] })),
      api.get('/brochures').catch(() => ({ data: [] })),
    ])
      .then(([seg, subseg, prod, part, inq, subs, broch]) => {
        const inqList = inq.data || [];
        const prods = prod.data?.products || [];
        setStats({
          products: prod.data?.total || prods.length || 0,
          segments: seg.data?.length || 0,
          subsegments: subseg.data?.length || 0,
          partners: part.data?.length || 0,
          inquiries: inqList.length,
          newInquiries: inqList.filter((i) => i.status === 'new').length,
          subscribers: subs.data?.totalCount ?? (Array.isArray(subs.data) ? subs.data.length : (subs.data?.subscribers?.length || 0)),
          brochures: Array.isArray(broch.data) ? broch.data.length : 0,
        });
        setRecentInquiries(inqList.slice(0, 5));
        setRecentProducts(prods.slice(0, 6));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const markInquiryRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.patch(`/inquiries/${id}`, { status: 'read' });
      setBannerMsg('✓ Inquiry marked as read');
      setTimeout(() => setBannerMsg(''), 3000);
      loadData();
    } catch {}
  };

  const markInquiryResponded = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.patch(`/inquiries/${id}`, { status: 'responded' });
      setBannerMsg('✓ Inquiry marked as responded');
      setTimeout(() => setBannerMsg(''), 3000);
      loadData();
    } catch {}
  };

  const cards = [
    { label: 'Products', value: stats?.products, to: '/admin/products', icon: '📦', sub: 'Catalogue items with photos & MOQ', color: 'from-amber-500/15 to-amber-500/5' },
    { label: 'Categories', value: stats?.segments, to: '/admin/segments', icon: '🏷️', sub: 'Spices, Grains, Savories, etc.', color: 'from-emerald-500/15 to-emerald-500/5' },
    { label: 'Sub-Categories', value: stats?.subsegments, to: '/admin/subsegments', icon: '📑', sub: 'Sub-commodity classifications', color: 'from-teal-500/15 to-teal-500/5' },
    { label: 'Buyer Inquiries', value: stats?.inquiries, to: '/admin/inquiries', badge: stats?.newInquiries, icon: '✉️', sub: 'Direct international RFQ requests', color: 'from-blue-500/15 to-blue-500/5' },
    { label: 'Brochures', value: stats?.brochures, to: '/admin/brochures', icon: '📄', sub: 'Downloadable PDF catalogues', color: 'from-violet-500/15 to-violet-500/5' },
    { label: 'Subscribers', value: stats?.subscribers, to: '/admin/subscribers', icon: '📬', sub: 'Newsletter marketing recipients', color: 'from-rose-500/15 to-rose-500/5' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Psychological Welcome Header & Quick Action Launcher */}
      <div className="rounded-3xl border border-line/90 bg-gradient-to-br from-white via-[#fcfbfa] to-paper p-5 sm:p-7 shadow-card relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-56 h-56 bg-forest/5 rounded-full pointer-events-none blur-2xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">{greeting.icon}</span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                {greeting.text}, {user?.name || 'Administrator'}!
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono font-semibold text-emerald-800 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live & Operational
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-ink/70 max-w-2xl">
              {greeting.message} Everything is synchronized with your MongoDB database in real-time.
            </p>
          </div>

          {/* Quick Action Dock */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/admin/products?action=new"
              className="btn-primary h-10 px-4 text-xs shadow-md inline-flex items-center gap-2 font-bold cursor-pointer transition hover:scale-102"
              title="Add a new product with images and specs"
            >
              <span className="text-gold font-bold text-base leading-none">+</span>
              <span>New Product</span>
            </Link>
            <Link
              to="/admin/segments?action=new"
              className="h-10 px-3.5 rounded-xl border border-line bg-white text-xs font-bold text-ink hover:border-gold hover:text-forest hover:bg-gold/10 transition shadow-2xs inline-flex items-center gap-1.5"
              title="Create a new business category"
            >
              <span>🏷️</span>
              <span>New Category</span>
            </Link>
            <Link
              to="/admin/brochures?action=new"
              className="h-10 px-3.5 rounded-xl border border-line bg-white text-xs font-bold text-ink hover:border-gold hover:text-forest hover:bg-gold/10 transition shadow-2xs inline-flex items-center gap-1.5"
              title="Upload buyer brochure PDF"
            >
              <span>📑</span>
              <span>Upload PDF</span>
            </Link>
            <Link
              to="/admin/content?tab=home_hero"
              className="h-10 px-3.5 rounded-xl border border-line bg-white text-xs font-bold text-ink hover:border-gold hover:text-forest hover:bg-gold/10 transition shadow-2xs inline-flex items-center gap-1.5"
              title="Edit hero slider, videos and website CMS"
            >
              <span>🎬</span>
              <span>Edit Hero / CMS</span>
            </Link>
          </div>
        </div>

        {/* Psychological Attention Priority Bar (Cognitive Ergonomics) */}
        <div className="mt-6 pt-5 border-t border-line/70">
          {stats?.newInquiries > 0 ? (
            <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100/60 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-lg shadow-sm">
                  ✉️
                </span>
                <div>
                  <h4 className="font-bold text-sm text-amber-950">
                    Priority Attention: {stats.newInquiries} Unread Buyer {stats.newInquiries === 1 ? 'Inquiry' : 'Inquiries'} Pending
                  </h4>
                  <p className="text-xs text-amber-900/80 mt-0.5">
                    International buyers have submitted quotation requests. Responding quickly drastically boosts export deal conversions.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/inquiries"
                className="self-start sm:self-auto rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-black transition flex items-center gap-1.5 shrink-0"
              >
                <span>Review Inquiries Now</span>
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                    All caught up! No pending unread inquiries.
                  </h4>
                  <p className="text-[11px] text-emerald-800/80">
                    Your export catalogue is live and accepting RFQs directly from global buyers.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/inquiries"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline shrink-0"
              >
                View inquiry logs →
              </Link>
            </div>
          )}
        </div>
      </div>

      {bannerMsg && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm flex items-center justify-between animate-in fade-in">
          <span>{bannerMsg}</span>
          <button type="button" onClick={() => setBannerMsg('')} className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 6 Key Management Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group relative overflow-hidden rounded-2xl border border-line bg-white p-4.5 sm:p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-gold/60 flex flex-col justify-between"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${c.color} rounded-bl-full pointer-events-none -mr-4 -mt-4`} />
            <div className="flex items-center justify-between">
              <span className="text-2xl" aria-hidden="true">{c.icon}</span>
              {c.badge > 0 ? (
                <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-ink uppercase animate-pulse">
                  {c.badge} new
                </span>
              ) : (
                <span className="text-[11px] font-mono text-ink/35 group-hover:text-gold transition-colors font-bold">↗</span>
              )}
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                {loading ? '…' : (c.value ?? '0')}
              </p>
              <p className="mt-1 font-bold text-xs text-ink group-hover:text-forest transition-colors">{c.label}</p>
              <p className="text-[10px] text-ink/45 line-clamp-1 mt-0.5">{c.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Core Workspaces: Inquiries RFQ Queue + Catalogue Fast Editor */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Buyer Inquiries + Recent Product Shelf */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Buyer Inquiries Queue */}
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/70 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base sm:text-lg font-bold text-ink">Recent Buyer Inquiries & RFQs</h2>
                  {stats?.newInquiries > 0 && (
                    <span className="rounded-full bg-gold/20 border border-gold/40 text-ink px-2 py-0.5 text-[10px] font-bold">
                      {stats.newInquiries} unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink/60 mt-0.5">International quote and sample requests from importers.</p>
              </div>
              <Link to="/admin/inquiries" className="text-xs font-bold text-forest hover:underline shrink-0">
                View all ({stats?.inquiries ?? 0}) →
              </Link>
            </div>

            <div className="divide-y divide-line/60">
              {recentInquiries.map((i) => {
                const interestLabel =
                  i.segment?.name ? `Category: ${i.segment.name}` :
                  i.product?.name ? `Product: ${i.product.name}` :
                  i.productInterest || 'General Export Inquiry';

                const cleanPhone = i.phone ? i.phone.replace(/[^0-9+]/g, '') : '';
                const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hello ${i.name}, thank you for contacting Nirmala Multitrading Co. (NMC) regarding ${interestLabel}.`)}` : null;

                return (
                  <div key={i._id} className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl hover:bg-[#fbf9f4] transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-ink">{i.name}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase font-mono ${statusStyles[i.status] || ''}`}>
                          {i.status}
                        </span>
                        <span className="rounded-full bg-forest/10 text-forest border border-forest/20 px-2 py-0.5 text-[10px] font-medium">
                          {interestLabel}
                        </span>
                      </div>
                      <p className="text-xs text-ink/65 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-ink/80">{i.email}</span>
                        {i.phone && <span className="font-mono text-ink/70">· 📞 {i.phone}</span>}
                        {i.company && <span>· 🏢 {i.company}</span>}
                        {i.country && <span>· 🌍 {i.country}</span>}
                        <span className="font-mono text-ink/40 text-[10px]">
                          {fmtDate(i.createdAt)}
                        </span>
                      </p>
                      {i.message && (
                        <p className="mt-1 text-xs text-ink/60 line-clamp-2 italic bg-paper/60 p-2 rounded-lg border border-line/40">
                          &quot;{i.message}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 px-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition inline-flex items-center gap-1 shadow-2xs"
                          title="Chat with buyer on WhatsApp"
                        >
                          <span>💬</span>
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      )}
                      {i.status === 'new' ? (
                        <button
                          type="button"
                          onClick={(e) => markInquiryRead(i._id, e)}
                          className="h-8 px-2.5 rounded-xl border border-line bg-paper text-[11px] font-semibold text-ink/75 hover:border-gold hover:text-forest transition inline-flex items-center cursor-pointer"
                          title="Mark as read"
                        >
                          Mark Read
                        </button>
                      ) : i.status === 'read' ? (
                        <button
                          type="button"
                          onClick={(e) => markInquiryResponded(i._id, e)}
                          className="h-8 px-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition inline-flex items-center cursor-pointer"
                          title="Mark as responded"
                        >
                          Mark Responded
                        </button>
                      ) : null}
                      <Link
                        to="/admin/inquiries"
                        className="h-8 px-3 rounded-xl bg-forest text-xs font-semibold text-white hover:bg-[#0d1e17] transition shadow-2xs inline-flex items-center"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                );
              })}

              {!loading && recentInquiries.length === 0 && (
                <div className="py-8 text-center text-xs text-ink/50 space-y-1">
                  <span className="text-2xl block">📭</span>
                  <p>No buyer inquiries received yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Product Shelf (Direct Edit & Fast Management) */}
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/70 pb-3">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-ink">
                  Recent Catalogue Items (Quick Edit Shelf)
                </h2>
                <p className="text-xs text-ink/60 mt-0.5">
                  1-Click to edit product photos, packaging, specifications, or pricing details.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/products?action=new"
                  className="btn-primary text-xs py-1 px-3 shadow-2xs font-bold inline-flex items-center gap-1"
                >
                  <span>+</span>
                  <span>Add Product</span>
                </Link>
                <Link to="/admin/products" className="text-xs font-bold text-forest hover:underline">
                  All Products ({stats?.products ?? 0}) →
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentProducts.map((p) => {
                const imgUrl = p.images?.[0] || p.image;
                return (
                  <div
                    key={p._id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white border border-line/60">
                        {imgUrl ? (
                          <img
                            src={asset(imgUrl)}
                            alt={p.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-xs text-ink/30 font-mono">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-ink truncate group-hover:text-forest transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-ink/50 truncate mt-0.5 font-medium">
                          {p.segment?.name || 'General Product'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {p.origin && (
                            <span className="rounded bg-paper px-1.5 py-0.2 font-mono text-[9px] text-ink/70 border border-line">
                              {p.origin}
                            </span>
                          )}
                          {p.moq && (
                            <span className="rounded bg-paper px-1.5 py-0.2 font-mono text-[9px] text-ink/70 border border-line">
                              MOQ: {p.moq}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-line/50 flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 ${p.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {p.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                      <Link
                        to={`/admin/products?edit=${p._id}`}
                        className="rounded-lg bg-forest/10 hover:bg-forest hover:text-white text-forest px-2.5 py-1 text-xs font-bold transition flex items-center gap-1"
                        title="Edit this product"
                      >
                        <span>✏️ Edit</span>
                      </Link>
                    </div>
                  </div>
                );
              })}

              {!loading && recentProducts.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-ink/50">
                  No products in catalogue yet. Click &quot;Add Product&quot; to create your first export item.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Fast Jump Hub & System Health */}
        <div className="space-y-6">
          {/* Quick Management Hub */}
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-card space-y-3">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Management Fast Jump</h2>
              <p className="text-xs text-ink/60 mt-0.5">Quick access to essential configuration modules.</p>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                to="/admin/content?tab=home_hero"
                className="group rounded-2xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🎬</span>
                  <div>
                    <p className="text-xs font-bold text-ink group-hover:text-forest">Home Hero & Videos</p>
                    <p className="text-[10px] text-ink/50">Edit ad slides, badges & videos</p>
                  </div>
                </div>
                <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
              </Link>

              <Link
                to="/admin/content?tab=brochures_cms"
                className="group rounded-2xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📑</span>
                  <div>
                    <p className="text-xs font-bold text-ink group-hover:text-forest">Brochures Page Hero & Video</p>
                    <p className="text-[10px] text-ink/50">Sliders, small screen & downloads</p>
                  </div>
                </div>
                <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
              </Link>

              <Link
                to="/admin/content?tab=header_cms"
                className="group rounded-2xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🎨</span>
                  <div>
                    <p className="text-xs font-bold text-ink group-hover:text-forest">Header, Logo & Favicon</p>
                    <p className="text-[10px] text-ink/50">Brand assets, nav links & titles</p>
                  </div>
                </div>
                <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
              </Link>

              <Link
                to="/admin/content?tab=loader_cms"
                className="group rounded-2xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⏳</span>
                  <div>
                    <p className="text-xs font-bold text-ink group-hover:text-forest">Brand Loader Screen</p>
                    <p className="text-[10px] text-ink/50">Welcome animation & certificates</p>
                  </div>
                </div>
                <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
              </Link>

              <Link
                to="/admin/news"
                className="group rounded-2xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📰</span>
                  <div>
                    <p className="text-xs font-bold text-ink group-hover:text-forest">Trade Blog & News</p>
                    <p className="text-[10px] text-ink/50">Publish articles, photos & videos</p>
                  </div>
                </div>
                <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
              </Link>

              <Link
                to="/admin/subscribers"
                className="group rounded-2xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📬</span>
                  <div>
                    <p className="text-xs font-bold text-ink group-hover:text-forest">Newsletter Broadcast</p>
                    <p className="text-[10px] text-ink/50">Send market updates to buyers</p>
                  </div>
                </div>
                <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-line/60">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl border border-forest/30 bg-forest/5 p-3 text-center text-xs font-bold text-forest hover:bg-forest hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <span>Preview Live Public Website</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* System Peace-of-Mind & Connectivity Checklist */}
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-card space-y-3">
            <h3 className="font-display text-sm font-bold text-ink">System Status & Shield</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-paper/60 border border-line/40">
                <span className="flex items-center gap-2 text-ink/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Database
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-800">MongoDB Online</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-paper/60 border border-line/40">
                <span className="flex items-center gap-2 text-ink/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Media Storage
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-800">Local & Cloud Uploads</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-paper/60 border border-line/40">
                <span className="flex items-center gap-2 text-ink/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Spotlight Search
                </span>
                <span className="font-mono text-[11px] font-bold text-ink/70">Press Ctrl+K anywhere</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-paper/60 border border-line/40">
                <span className="flex items-center gap-2 text-ink/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Public Editing Shield
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-800">Protected & Hidden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
