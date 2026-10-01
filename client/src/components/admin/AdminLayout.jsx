import { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BRAND } from '../../config.js';
import api from '../../api/axios.js';

const menuGroups = [
  {
    group: 'Main Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: '📊', end: true, desc: 'Overview, analytics & quick actions' },
      { to: '/admin/inquiries', label: 'Inquiries', icon: '✉️', badgeKey: 'inquiries', desc: 'Buyer RFQs & import requests' },
      { to: '/admin/subscribers', label: 'Subscribers', icon: '📬', badgeKey: 'subscribers', desc: 'Email subscribers & broadcasts' },
    ],
  },
  {
    group: 'Product Catalogue',
    items: [
      { to: '/admin/products', label: 'Products', icon: '🏷️', badgeKey: 'products', desc: 'Full catalogue, packaging & specs' },
      { to: '/admin/segments', label: 'Categories', icon: '📦', badgeKey: 'segments', desc: 'Main product categories' },
      { to: '/admin/subsegments', label: 'Sub-Categories', icon: '📑', desc: 'Second-level product groups' },
    ],
  },
  {
    group: 'Network & Marketing',
    items: [
      { to: '/admin/partners', label: 'Partners & Suppliers', icon: '🤝', badgeKey: 'partners', desc: 'Certified producer network' },
      { to: '/admin/brochures', label: 'Brochures & Catalogues', icon: '📄', desc: 'Downloadable PDF line cards' },
      { to: '/admin/blog', label: 'Blog & Market News', icon: '📰', desc: 'Trade intelligence articles' },
    ],
  },
  {
    group: 'Design & Settings',
    items: [
      { to: '/admin/content', label: 'Site Content CMS', icon: '⚙️', badge: 'Editable', desc: 'Homepage, loader, footer & headers' },
      { to: '/admin/profile', label: 'Admin Profile', icon: '👤', desc: 'Email, phone & password credentials' },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [counts, setCounts] = useState({
    inquiries: 0,
    newInquiries: 0,
    products: 0,
    segments: 0,
    partners: 0,
    subscribers: 0,
  });

  // Load persisted sidebar state (default: open on desktop, closed on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nmc_admin_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Fetch quick metrics for sidebar badges
  useEffect(() => {
    let isMounted = true;
    const loadQuickStats = async () => {
      try {
        const [inqRes, prodRes, segRes] = await Promise.all([
          api.get('/inquiries').catch(() => ({ data: [] })),
          api.get('/products', { params: { admin: true, limit: 1 } }).catch(() => ({ data: { total: 0 } })),
          api.get('/segments', { params: { all: true } }).catch(() => ({ data: [] })),
        ]);
        if (!isMounted) return;
        const inqs = inqRes.data || [];
        const newCount = inqs.filter((i) => i.status === 'new').length;
        setCounts((prev) => ({
          ...prev,
          inquiries: inqs.length,
          newInquiries: newCount,
          products: prodRes.data?.total || 0,
          segments: (segRes.data || []).length,
        }));
      } catch {}
    };
    loadQuickStats();
    return () => { isMounted = false; };
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('nmc_admin_sidebar_open', String(next));
      return next;
    });
  };

  const handleMainScroll = (e) => {
    setShowTopBtn(e.currentTarget.scrollTop > 200);
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close drawer on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Flattened links
  const allLinks = useMemo(() => menuGroups.flatMap((g) => g.items), []);

  // Active link
  const activeLink = allLinks.find((l) =>
    l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
  );

  // Set document title
  useEffect(() => {
    document.title = activeLink ? `NMC Admin | ${activeLink.label}` : 'NMC Admin Portal';
  }, [activeLink]);

  const signOut = () => {
    logout();
    navigate('/admin/login');
  };

  // Filtered menu items based on menuSearch
  const filteredGroups = useMemo(() => {
    const q = menuSearch.trim().toLowerCase();
    if (!q) return menuGroups;
    return menuGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.desc && item.desc.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [menuSearch]);

  return (
    <div
      className="admin-panel notranslate relative min-h-screen bg-[#f8f6f0] text-ink md:flex md:h-screen md:overflow-hidden font-sans"
      translate="no"
      dir="ltr"
      lang="en"
    >
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 
        Collapsible Sidebar:
        Controlled by the three-line hamburger button on the left.
      */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col border-r border-line/80 bg-[#0d1e17] text-paper shadow-2xl transition-all duration-300 ease-in-out lg:static lg:shadow-xl ${
          sidebarOpen
            ? 'w-68 translate-x-0 opacity-100'
            : '-translate-x-full lg:w-0 lg:overflow-hidden lg:opacity-0 lg:border-none'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-forest/80 border border-gold/40 shadow-sm">
              <span className="block h-3 w-3 rounded-full bg-gold" />
            </div>
            <div className="flex flex-col font-display leading-tight">
              <strong className="text-sm font-extrabold tracking-tight text-white">{BRAND.name}</strong>
              <small className="text-[10px] text-paper/60 uppercase tracking-wider font-semibold">Admin Workspace</small>
            </div>
          </Link>

          {/* Toggle button inside sidebar header */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title="Toggle sidebar (☰)"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-paper/80 hover:bg-white/15 transition cursor-pointer"
          >
            <div className="flex flex-col gap-1 w-3.5 justify-center items-center">
              <span className="block h-0.5 w-3.5 rounded-full bg-white/80" />
              <span className="block h-0.5 w-3.5 rounded-full bg-white/80" />
              <span className="block h-0.5 w-3.5 rounded-full bg-white/80" />
            </div>
          </button>
        </div>

        {/* Quick Menu Search / Filter */}
        <div className="px-3.5 pt-3 pb-1">
          <div className="relative">
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search admin menu…"
              className="w-full rounded-xl bg-white/8 border border-white/10 px-3 py-1.5 pl-8 text-xs text-white placeholder-paper/40 focus:outline-hidden focus:border-gold/60 focus:bg-white/12 transition-all"
            />
            <span className="absolute left-2.5 top-2 text-xs text-paper/40 pointer-events-none">🔍</span>
            {menuSearch && (
              <button
                type="button"
                onClick={() => setMenuSearch('')}
                className="absolute right-2.5 top-1.5 text-xs text-paper/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu Groups */}
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3.5 no-scrollbar">
          {filteredGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold/80">
                {group.group}
              </p>
              {group.items.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-forest text-white shadow-md border-l-4 border-gold font-bold'
                        : 'text-paper/75 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0" aria-hidden="true">{l.icon}</span>
                    <div className="flex flex-col truncate">
                      <span className="truncate">{l.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* New Inquiries Badge */}
                    {l.badgeKey === 'inquiries' && counts.newInquiries > 0 && (
                      <span className="rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-bold text-ink uppercase animate-pulse">
                        {counts.newInquiries} new
                      </span>
                    )}
                    {/* Products Count Badge */}
                    {l.badgeKey === 'products' && counts.products > 0 && (
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-paper/70">
                        {counts.products}
                      </span>
                    )}
                    {/* Categories Count Badge */}
                    {l.badgeKey === 'segments' && counts.segments > 0 && (
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-paper/70">
                        {counts.segments}
                      </span>
                    )}
                    {/* Custom Badge */}
                    {l.badge && (
                      <span className="rounded-full bg-forest-dark/80 border border-gold/30 px-1.5 py-0.5 text-[9px] font-bold text-gold uppercase tracking-wider">
                        {l.badge}
                      </span>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-paper/40">
              No matching sections found for &quot;{menuSearch}&quot;
            </div>
          )}
        </nav>

        {/* Footer User Info & Sign Out */}
        <div className="border-t border-white/10 bg-black/25 p-3.5">
          <Link
            to="/admin/profile"
            className="flex items-center justify-between px-1 hover:bg-white/5 p-1 rounded-lg transition group"
            title="Edit Admin Profile & Credentials"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <p className="truncate text-xs font-mono text-paper/80 group-hover:text-gold transition font-medium">
                {user?.email || 'admin@nmc.com'}
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              Active
            </span>
          </Link>
          <div className="mt-2.5 flex gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center text-xs font-medium text-paper transition hover:bg-white/15 flex items-center justify-center gap-1"
            >
              <span>View Site</span>
              <span className="text-[10px]">↗</span>
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex-1 rounded-lg bg-clay/80 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-clay shadow-sm cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* 
        Main Workspace Area:
        Top header with three-line toggle button + Scrollable content canvas
      */}
      <div className="flex flex-1 flex-col min-w-0 md:h-screen md:overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-line/80 bg-white px-4 sm:px-6 lg:px-8 shadow-xs transition-colors">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* THREE LINE (HAMBURGER ☰) TOGGLE BUTTON ON THE LEFT */}
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              className="group flex h-9.5 w-9.5 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-paper/80 text-ink shadow-xs transition-all hover:border-gold hover:bg-forest hover:text-white cursor-pointer"
            >
              <div className="flex flex-col gap-1 w-4 sm:w-4.5 justify-center items-center">
                <span className="block h-0.5 w-4 sm:w-4.5 rounded-full bg-current transition-all duration-200" />
                <span className="block h-0.5 w-4 sm:w-4.5 rounded-full bg-current transition-all duration-200" />
                <span className="block h-0.5 w-4 sm:w-4.5 rounded-full bg-current transition-all duration-200" />
              </div>
            </button>

            {/* Active section title and breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-bold text-ink truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
                {activeLink?.label || 'Admin Panel'}
              </span>
              <span className="hidden font-mono text-[11px] text-ink/40 sm:inline-block">
                / {BRAND.fullName}
              </span>
            </div>
          </div>

          {/* Right Header Quick Actions & Status */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Server Indicator */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-mono text-emerald-800 font-semibold shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MongoDB Online</span>
            </div>

            {/* Quick Add Product Shortcut */}
            <Link
              to="/admin/products?action=new"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0d1e17] hover:border-gold border border-transparent transition"
              title="Quickly add a new product to catalogue"
            >
              <span>+</span>
              <span>New Product</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink/80 transition hover:border-gold hover:text-ink hover:bg-gold/10"
            >
              <span>View Website</span>
              <span aria-hidden="true">↗</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-line/60">
              <Link
                to="/admin/profile"
                className="flex items-center gap-2 hover:opacity-85 transition group"
                title="Admin Profile & Credentials"
              >
                <div className="h-8 w-8 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold font-mono shadow-xs border border-gold/30 group-hover:scale-105 transition-transform">
                  {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-ink leading-tight group-hover:text-forest">
                    {user?.name || 'Admin'}
                  </span>
                  <span className="text-[10px] font-mono text-ink/50 leading-tight">Profile & Security</span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Content Workspace */}
        <main
          ref={mainRef}
          onScroll={handleMainScroll}
          className="relative flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-[#f8f6f0] transition-colors"
        >
          <Outlet />

          {/* FLOATING TOP BUTTON IN ADMIN PANEL */}
          {showTopBtn && (
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll workspace to top"
              title="Scroll to Top"
              className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-forest text-gold border border-gold/40 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#0d1e17] hover:border-gold animate-in fade-in cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          )}
        </main>
      </div>
    </div>
  );
}


