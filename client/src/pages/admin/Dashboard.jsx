import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';

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
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerMsg, setBannerMsg] = useState('');

  const loadData = () => {
    return Promise.all([
      api.get('/segments', { params: { all: true } }).catch(() => ({ data: [] })),
      api.get('/subsegments', { params: { all: true } }).catch(() => ({ data: [] })),
      api.get('/products', { params: { admin: true, limit: 1 } }).catch(() => ({ data: { total: 0 } })),
      api.get('/partners', { params: { all: true } }).catch(() => ({ data: [] })),
      api.get('/inquiries').catch(() => ({ data: [] })),
      api.get('/subscribers').catch(() => ({ data: [] })),
      api.get('/brochures').catch(() => ({ data: [] })),
    ])
      .then(([seg, subseg, prod, part, inq, subs, broch]) => {
        const inqList = inq.data || [];
        setStats({
          products: prod.data?.total || 0,
          segments: seg.data?.length || 0,
          subsegments: subseg.data?.length || 0,
          partners: part.data?.length || 0,
          inquiries: inqList.length,
          newInquiries: inqList.filter((i) => i.status === 'new').length,
          subscribers: subs.data?.totalCount ?? (Array.isArray(subs.data) ? subs.data.length : (subs.data?.subscribers?.length || 0)),
          brochures: Array.isArray(broch.data) ? broch.data.length : 0,
        });
        setRecentInquiries(inqList.slice(0, 5));
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

  const cards = [
    { label: 'Products', value: stats?.products, to: '/admin/products', icon: '🏷️', sub: 'Active catalogue items', color: 'from-amber-500/15 to-amber-500/5' },
    { label: 'Categories', value: stats?.segments, to: '/admin/segments', icon: '📦', sub: 'Main product segments', color: 'from-emerald-500/15 to-emerald-500/5' },
    { label: 'Sub-Categories', value: stats?.subsegments, to: '/admin/subsegments', icon: '📑', sub: 'Sub-group classifications', color: 'from-teal-500/15 to-teal-500/5' },
    { label: 'Buyer Inquiries', value: stats?.inquiries, to: '/admin/inquiries', badge: stats?.newInquiries, icon: '✉️', sub: 'International RFQ requests', color: 'from-blue-500/15 to-blue-500/5' },
    { label: 'Partners & Suppliers', value: stats?.partners, to: '/admin/partners', icon: '🤝', sub: 'Producer network', color: 'from-purple-500/15 to-purple-500/5' },
    { label: 'Subscribers', value: stats?.subscribers, to: '/admin/subscribers', icon: '📬', sub: 'Marketing newsletter list', color: 'from-rose-500/15 to-rose-500/5' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="rounded-2xl border border-line/90 bg-white p-5 sm:p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold text-ink">Admin Dashboard</h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Manage your global agro-food export catalogue, incoming buyer inquiries, and website settings.
          </p>
        </div>

        {/* Primary Quick Actions for Admin */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/products?action=new"
            className="btn-primary h-9 px-3.5 text-xs shadow-sm inline-flex items-center gap-1.5 font-bold"
          >
            <span>+</span>
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/segments"
            className="h-9 px-3.5 rounded-xl border border-line bg-paper text-xs font-semibold text-ink hover:border-gold hover:text-forest transition shadow-xs inline-flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/inquiries"
            className="relative h-9 px-3.5 rounded-xl border border-line bg-paper text-xs font-semibold text-ink hover:border-gold hover:text-forest transition shadow-xs inline-flex items-center gap-1.5"
          >
            <span>✉️</span>
            <span>Inquiries</span>
            {stats?.newInquiries > 0 && (
              <span className="ml-1 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-ink">
                {stats.newInquiries}
              </span>
            )}
          </Link>
          <Link
            to="/admin/content"
            className="h-9 px-3.5 rounded-xl border border-line bg-paper text-xs font-semibold text-ink hover:border-gold hover:text-forest transition shadow-xs inline-flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span>CMS</span>
          </Link>
        </div>
      </div>

      {bannerMsg && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm flex items-center justify-between">
          <span>{bannerMsg}</span>
          <button type="button" onClick={() => setBannerMsg('')} className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 6 Performance Stat Cards */}
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

      {/* Two Column Grid: Recent Inquiries + Quick Navigation */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Inquiries (2 Columns on large) */}
        <div className="lg:col-span-2 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/70 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-ink">Recent Buyer Inquiries</h2>
                {stats?.newInquiries > 0 && (
                  <span className="rounded-full bg-gold/20 border border-gold/40 text-ink px-2 py-0.5 text-[10px] font-bold">
                    {stats.newInquiries} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-ink/60 mt-0.5">Direct international quote requests from website inquiry forms.</p>
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

              return (
                <div key={i._id} className="p-3 sm:px-3.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 rounded-xl hover:bg-[#fbf9f4] transition-colors">
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
                      {i.company && <span>· 🏢 {i.company}</span>}
                      {i.country && <span>· 🌍 {i.country}</span>}
                      <span className="font-mono text-ink/40 text-[10px]">
                        {fmtDate(i.createdAt)}
                      </span>
                    </p>
                    {i.message && (
                      <p className="mt-1 text-xs text-ink/55 line-clamp-1 italic">
                        &quot;{i.message}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {i.status === 'new' && (
                      <button
                        type="button"
                        onClick={(e) => markInquiryRead(i._id, e)}
                        className="h-8 px-2.5 rounded-lg border border-line bg-paper text-[11px] font-semibold text-ink/75 hover:border-gold hover:text-forest transition inline-flex items-center cursor-pointer"
                        title="Mark as read"
                      >
                        Mark Read
                      </button>
                    )}
                    <Link
                      to="/admin/inquiries"
                      className="h-8 px-3 rounded-lg bg-forest text-xs font-semibold text-white hover:bg-[#0d1e17] transition shadow-2xs inline-flex items-center"
                    >
                      Open →
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

        {/* Quick Management Shortcuts */}
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-card space-y-3 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-ink">Quick Shortcuts</h2>
            <p className="text-xs text-ink/60 mt-0.5">Direct links to primary administrative tasks.</p>
          </div>

          <div className="space-y-2 pt-1">
            <Link to="/admin/products" className="group rounded-xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🏷️</span>
                <div>
                  <p className="text-xs font-bold text-ink group-hover:text-forest">Products Catalogue</p>
                  <p className="text-[10px] text-ink/50">Manage items, packaging, MOQ</p>
                </div>
              </div>
              <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
            </Link>

            <Link to="/admin/segments" className="group rounded-xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📦</span>
                <div>
                  <p className="text-xs font-bold text-ink group-hover:text-forest">Product Categories</p>
                  <p className="text-[10px] text-ink/50">Spices, Grains, Savories</p>
                </div>
              </div>
              <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
            </Link>

            <Link to="/admin/subsegments" className="group rounded-xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📑</span>
                <div>
                  <p className="text-xs font-bold text-ink group-hover:text-forest">Sub-Categories</p>
                  <p className="text-[10px] text-ink/50">Subgroups & classifications</p>
                </div>
              </div>
              <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
            </Link>

            <Link to="/admin/content" className="group rounded-xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚙️</span>
                <div>
                  <p className="text-xs font-bold text-ink group-hover:text-forest">Website Content CMS</p>
                  <p className="text-[10px] text-ink/50">Hero banners, loader, headers</p>
                </div>
              </div>
              <span className="text-xs text-ink/40 group-hover:text-forest">→</span>
            </Link>

            <Link to="/admin/subscribers" className="group rounded-xl border border-line bg-[#fbf9f4] p-3 hover:border-gold hover:bg-gold/10 transition flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📬</span>
                <div>
                  <p className="text-xs font-bold text-ink group-hover:text-forest">Newsletter Broadcast</p>
                  <p className="text-[10px] text-ink/50">Send trade updates to buyers</p>
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
              className="w-full rounded-xl border border-forest/30 bg-forest/5 p-2.5 text-center text-xs font-bold text-forest hover:bg-forest hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span>Preview Live Website</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

