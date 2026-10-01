import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = {
  name: '',
  segment: '',
  subSegment: '',
  partner: '',
  shortDescription: '',
  description: '',
  image: '',
  origin: '',
  hsCode: '',
  boxSize: '',
  packageType: '',
  flavour: '',
  moq: '',
  specifications: [],
  featured: false,
  isActive: true,
};

const SPEC_PRESETS = [
  { key: 'Purity', value: '99.5% Sortex Cleaned' },
  { key: 'Moisture', value: '< 5% Max' },
  { key: 'Curcumin Content', value: '3.5% – 5.0% Min' },
  { key: 'Aflatoxin & MRL', value: 'ASTA / EU Compliant' },
  { key: 'Shelf Life', value: '24 Months' },
  { key: 'Sortex Cleaning', value: '100% Optical Laser Sorted' },
  { key: 'Volatile Oil', value: '3.0% Min' },
  { key: 'Certifications', value: 'APEDA, FSSAI, Spice Board' },
];

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [allSubsegments, setAllSubsegments] = useState([]);
  const [formSubsegments, setFormSubsegments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [activeFormTab, setActiveFormTab] = useState('basic'); // 'basic' | 'specs' | 'custom'
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [bannerError, setBannerError] = useState('');

  // Search & Filters
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filterSegment, setFilterSegment] = useState('');
  const [filterSubSegment, setFilterSubSegment] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    return api
      .get('/products', {
        params: {
          admin: true,
          limit: 300,
        },
      })
      .then((r) => setItems(r.data.products || []))
      .catch((err) => {
        setBannerError('Failed to load products: ' + (err.message || ''));
      });
  };

  useEffect(() => {
    load();

    api
      .get('/segments', { params: { all: true } })
      .then((r) => setSegments(r.data || []))
      .catch(() => {});

    api
      .get('/subsegments', { params: { all: true } })
      .then((r) => setAllSubsegments(r.data || []))
      .catch(() => {});

    api
      .get('/partners', { params: { all: true } })
      .then((r) => setPartners(r.data || []))
      .catch(() => {});
  }, []);

  // Handle URL shortcut ?action=new or ?segment=XYZ
  useEffect(() => {
    const action = searchParams.get('action');
    const segParam = searchParams.get('segment');

    if (segParam) {
      setFilterSegment(segParam);
    }

    if (action === 'new') {
      openNew();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  // Update form subsegments when form.segment changes
  useEffect(() => {
    if (!form.segment) {
      setFormSubsegments([]);
      return;
    }

    const selectedSegment = segments.find(
      (s) => s._id === form.segment || s.slug === form.segment
    );
    if (!selectedSegment) {
      setFormSubsegments([]);
      return;
    }

    api
      .get('/subsegments', { params: { segment: selectedSegment.slug } })
      .then((r) => setFormSubsegments(r.data || []))
      .catch(() => setFormSubsegments([]));
  }, [form.segment, segments]);

  // Filter toolbar subsegments based on filterSegment
  const toolbarSubsegments = useMemo(() => {
    if (!filterSegment) return allSubsegments;
    return allSubsegments.filter(
      (sub) => (sub.segment?._id || sub.segment) === filterSegment
    );
  }, [filterSegment, allSubsegments]);

  const openNew = () => {
    setEditing(null);
    setForm(blank);
    setActiveFormTab('basic');
    setError('');
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...blank,
      ...p,
      segment: p.segment?._id || p.segment || '',
      subSegment: p.subSegment?._id || p.subSegment || '',
      partner: p.partner?._id || p.partner || '',
      boxSize: p.boxSize || '',
      packageType: p.packageType || '',
      flavour: p.flavour || '',
      specifications: Array.isArray(p.specifications) ? p.specifications : [],
    });
    setActiveFormTab('basic');
    setError('');
    setOpen(true);
  };

  const cloneProduct = (p) => {
    setEditing(null);
    setForm({
      ...blank,
      ...p,
      _id: undefined,
      slug: undefined,
      name: `${p.name} (Copy)`,
      segment: p.segment?._id || p.segment || '',
      subSegment: p.subSegment?._id || p.subSegment || '',
      partner: p.partner?._id || p.partner || '',
      boxSize: p.boxSize || '',
      packageType: p.packageType || '',
      flavour: p.flavour || '',
      specifications: Array.isArray(p.specifications)
        ? JSON.parse(JSON.stringify(p.specifications))
        : [],
    });
    setActiveFormTab('basic');
    setError('');
    setOpen(true);
    setBannerSuccess(`Cloning product "${p.name}". Edit details and click Save.`);
    setTimeout(() => setBannerSuccess(''), 4000);
  };

  const addSpecification = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { key: '', value: '' }],
    }));
  };

  const addPresetSpec = (preset) => {
    setForm((prev) => {
      const exists = (prev.specifications || []).some(
        (s) => s.key.toLowerCase() === preset.key.toLowerCase()
      );
      if (exists) return prev;
      return {
        ...prev,
        specifications: [...(prev.specifications || []), { key: preset.key, value: preset.value }],
      };
    });
  };

  const updateSpecification = (index, field, value) => {
    setForm((prev) => {
      const next = [...(prev.specifications || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, specifications: next };
    });
  };

  const removeSpecification = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index),
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Please provide a product name.');
      setActiveFormTab('basic');
      return;
    }
    if (!form.segment) {
      setError('Please select a parent category for the product.');
      setActiveFormTab('basic');
      return;
    }

    setBusy(true);
    setError('');

    const payload = {
      ...form,
      name: form.name.trim(),
      partner: form.partner || undefined,
      subSegment: form.subSegment || undefined,
      boxSize: form.boxSize ? form.boxSize.trim() : '',
      packageType: form.packageType ? form.packageType.trim() : '',
      flavour: form.flavour ? form.flavour.trim() : '',
      specifications: (form.specifications || []).filter((s) => s.key && s.key.trim()),
    };

    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
        setBannerSuccess(`✓ Product "${payload.name}" updated successfully!`);
      } else {
        await api.post('/products', payload);
        setBannerSuccess(`✓ Product "${payload.name}" created successfully!`);
      }

      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 5000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product in MongoDB.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (p, field) => {
    try {
      const updatedVal = !p[field];
      await api.put(`/products/${p._id}`, { ...p, [field]: updatedVal });
      setItems((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, [field]: updatedVal } : item))
      );
      setBannerSuccess(`✓ Product "${p.name}" updated!`);
      setTimeout(() => setBannerSuccess(''), 3000);
    } catch {
      setBannerError('✗ Failed to update product status');
      setTimeout(() => setBannerError(''), 4000);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      setBannerSuccess(`✓ Product "${deleteTarget.name}" deleted successfully!`);
      setTimeout(() => setBannerSuccess(''), 5000);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete product.';
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    }
  };

  // Filter & Sort
  const filteredItems = useMemo(() => {
    return items
      .filter((p) => {
        const q = search.trim().toLowerCase();
        const matchSearch =
          !q ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.hsCode && p.hsCode.toLowerCase().includes(q)) ||
          (p.origin && p.origin.toLowerCase().includes(q)) ||
          (p.packageType && p.packageType.toLowerCase().includes(q)) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q));

        const segId = p.segment?._id || p.segment;
        const matchSegment = !filterSegment || segId === filterSegment;

        const subId = p.subSegment?._id || p.subSegment;
        const matchSubSegment = !filterSubSegment || subId === filterSubSegment;

        const matchStatus =
          filterStatus === 'all' ||
          (filterStatus === 'active' && p.isActive !== false) ||
          (filterStatus === 'hidden' && p.isActive === false) ||
          (filterStatus === 'featured' && p.featured);

        return matchSearch && matchSegment && matchSubSegment && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0; // default order
      });
  }, [items, search, filterSegment, filterSubSegment, filterStatus, sortBy]);

  // Counts summary
  const counts = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.isActive !== false).length;
    const featured = items.filter((i) => i.featured).length;
    return { total, active, featured };
  }, [items]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl font-extrabold text-ink">Products Catalogue</h1>
            <span className="rounded-full bg-forest/10 border border-forest/20 px-2.5 py-0.5 text-xs font-mono font-bold text-forest">
              {counts.total} items
            </span>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800">
              {counts.active} active
            </span>
            {counts.featured > 0 && (
              <span className="rounded-full bg-gold/20 border border-gold/40 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-900">
                ★ {counts.featured} featured
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Manage export products, packaging types, HS codes, origins, and custom technical specifications.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary h-9.5 px-4 text-xs font-bold inline-flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
          onClick={openNew}
        >
          <span className="text-base leading-none">+</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* SUCCESS / ERROR BANNERS */}
      {bannerSuccess && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm flex items-center justify-between animate-in fade-in">
          <span>{bannerSuccess}</span>
          <button
            type="button"
            onClick={() => setBannerSuccess('')}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {bannerError && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-xs sm:text-sm font-bold text-red-800 shadow-sm flex items-center justify-between animate-in fade-in">
          <span>{bannerError}</span>
          <button
            type="button"
            onClick={() => setBannerError('')}
            className="text-red-700 hover:text-red-950 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, HS code, origin, packaging, MOQ…"
              className="w-full h-9.5 rounded-xl border border-line bg-[#fbf9f4] px-3.5 pl-9 text-xs text-ink placeholder-ink/40 focus:border-gold focus:bg-white focus:outline-hidden transition"
            />
            <span className="absolute left-3 top-2.5 text-xs text-ink/40 pointer-events-none">🔍</span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-xs text-ink/40 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Cluster */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter */}
            <select
              value={filterSegment}
              onChange={(e) => {
                setFilterSegment(e.target.value);
                setFilterSubSegment(''); // Reset subsegment filter on category change
              }}
              className="h-9.5 rounded-xl border border-line bg-[#fbf9f4] px-3 text-xs font-semibold text-ink focus:border-gold focus:bg-white focus:outline-hidden cursor-pointer"
              title="Filter by Category"
            >
              <option value="">All Categories ({segments.length})</option>
              {segments.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Sub-Category Filter (dynamically populated) */}
            <select
              value={filterSubSegment}
              onChange={(e) => setFilterSubSegment(e.target.value)}
              disabled={toolbarSubsegments.length === 0}
              className="h-9.5 rounded-xl border border-line bg-[#fbf9f4] px-3 text-xs font-semibold text-ink focus:border-gold focus:bg-white focus:outline-hidden disabled:opacity-50 cursor-pointer"
              title="Filter by Sub-Category"
            >
              <option value="">All Sub-Categories ({toolbarSubsegments.length})</option>
              {toolbarSubsegments.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9.5 rounded-xl border border-line bg-[#fbf9f4] px-3 text-xs font-semibold text-ink focus:border-gold focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="hidden">Hidden Only</option>
              <option value="featured">Featured (★) Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9.5 rounded-xl border border-line bg-[#fbf9f4] px-3 text-xs font-semibold text-ink focus:border-gold focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="featured">Sort: Featured First</option>
              <option value="newest">Sort: Newest</option>
            </select>

            {/* View Mode Toggle: Table vs Grid */}
            <div className="h-9.5 inline-flex items-center rounded-xl border border-line bg-paper p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`h-full rounded-lg px-3 text-xs font-bold transition inline-flex items-center cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-forest shadow-xs' : 'text-ink/60 hover:text-ink'
                }`}
                title="Table view"
              >
                ☰ Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`h-full rounded-lg px-3 text-xs font-bold transition inline-flex items-center cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-forest shadow-xs' : 'text-ink/60 hover:text-ink'
                }`}
                title="Grid cards view"
              >
                ☷ Cards
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Summary Bar */}
        <div className="flex items-center justify-between text-xs text-ink/65 px-1 pt-2 border-t border-line/60">
          <span>
            Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> products
            {search && ` matching "${search}"`}
            {filterSegment && ` in category`}
            {filterSubSegment && ` in sub-category`}
          </span>

          {(search || filterSegment || filterSubSegment || filterStatus !== 'all' || sortBy !== 'default') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setFilterSegment('');
                setFilterSubSegment('');
                setFilterStatus('all');
                setSortBy('default');
              }}
              className="text-forest hover:underline font-bold cursor-pointer"
            >
              Reset Filters ✕
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: PRODUCT TABLE */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-[#fbf9f4] font-mono text-[11px] uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 sm:px-5 py-3.5">Product Name & Code</th>
                <th className="px-4 sm:px-5 py-3.5">Category / Sub-Category</th>
                <th className="px-4 sm:px-5 py-3.5">Origin & Packaging</th>
                <th className="px-4 sm:px-5 py-3.5">MOQ</th>
                <th className="px-4 sm:px-5 py-3.5">Visibility & Status</th>
                <th className="px-4 sm:px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line/70">
              {filteredItems.map((p) => (
                <tr key={p._id} className="hover:bg-[#fcfbf7] transition-colors">
                  {/* Product Details & Thumbnail */}
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-line/30 relative">
                        {p.image ? (
                          <img
                            src={asset(p.image)}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = '/NMC logo.png';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-ink/30 font-mono">
                            NMC
                          </div>
                        )}
                        {p.featured && (
                          <span
                            className="absolute top-0.5 right-0.5 text-gold text-[10px]"
                            title="Featured on home page"
                          >
                            ★
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="font-bold text-ink block truncate max-w-[220px]">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink/50">
                          {p.hsCode && <span>HS: {p.hsCode}</span>}
                          {p.partner?.name && (
                            <span className="truncate max-w-[120px]">· 🤝 {p.partner.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category / Sub-Category */}
                  <td className="px-4 sm:px-5 py-3.5 text-xs">
                    <span className="font-semibold text-ink/85 block">
                      {p.segment?.name || '—'}
                    </span>
                    {p.subSegment?.name && (
                      <span className="text-[11px] text-ink/50 block">
                        ↳ {p.subSegment.name}
                      </span>
                    )}
                  </td>

                  {/* Origin & Packaging */}
                  <td className="px-4 sm:px-5 py-3.5 text-xs text-ink/75">
                    <span className="font-medium text-ink block">{p.origin || 'India'}</span>
                    <span className="text-[11px] text-ink/50 truncate block max-w-[150px]">
                      {p.packageType || p.boxSize || 'Standard Export'}
                    </span>
                  </td>

                  {/* MOQ */}
                  <td className="px-4 sm:px-5 py-3.5 text-xs font-mono text-ink/70">
                    {p.moq || '1 x 20ft FCL'}
                  </td>

                  {/* Status Flags */}
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => toggleStatus(p, 'isActive')}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer ${
                          p.isActive !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-300 hover:bg-zinc-200'
                        }`}
                        title="Click to toggle site visibility"
                      >
                        {p.isActive !== false ? '● Active' : '○ Hidden'}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStatus(p, 'featured')}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer ${
                          p.featured
                            ? 'bg-gold/25 text-amber-900 border border-gold/50 hover:bg-gold/40'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                        }`}
                        title="Click to toggle featured spotlight on homepage"
                      >
                        {p.featured ? '★ Featured' : '☆ Normal'}
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 sm:px-5 py-3.5 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      {/* Live View link */}
                      <Link
                        to={`/product-details/${p.slug || p._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 rounded-lg border border-line bg-paper text-xs font-semibold text-ink/70 hover:border-gold hover:text-forest transition inline-flex items-center justify-center"
                        title="Preview live product on website"
                      >
                        ↗
                      </Link>

                      {/* Duplicate / Clone button */}
                      <button
                        type="button"
                        className="h-8 px-2.5 rounded-lg border border-line bg-paper text-xs font-semibold text-ink hover:border-gold hover:text-forest transition inline-flex items-center justify-center cursor-pointer"
                        onClick={() => cloneProduct(p)}
                        title="Duplicate this product with all specs"
                      >
                        Copy
                      </button>

                      {/* Edit button */}
                      <button
                        type="button"
                        className="h-8 px-2.5 rounded-lg border border-line bg-paper text-xs font-semibold text-ink hover:border-forest hover:bg-forest hover:text-white transition inline-flex items-center justify-center cursor-pointer"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        className="h-8 px-2.5 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-clay hover:bg-red-100 transition inline-flex items-center justify-center cursor-pointer"
                        onClick={() => setDeleteTarget(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 sm:px-5 py-12 text-center text-ink/50 text-xs">
                    No products match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW 2: PRODUCT CARD GRID */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl border border-line bg-white p-4 shadow-card hover:border-gold/60 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-line bg-line/30">
                  {p.image ? (
                    <img
                      src={asset(p.image)}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = '/NMC logo.png';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-ink/30 font-mono">
                      No Image
                    </div>
                  )}
                  {p.featured && (
                    <span className="absolute top-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase text-ink shadow-sm">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-moss font-semibold block">
                    {p.segment?.name || 'General Category'}
                  </span>
                  <h3 className="font-bold text-sm text-ink truncate mt-0.5" title={p.name}>
                    {p.name}
                  </h3>
                  {p.shortDescription && (
                    <p className="text-xs text-ink/60 line-clamp-2 mt-1">
                      {p.shortDescription}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-ink/60 bg-[#fbf9f4] p-2 rounded-lg">
                  <div>
                    <span className="text-ink/40 block text-[9px]">ORIGIN</span>
                    <span className="font-semibold text-ink/80 truncate block">{p.origin || 'India'}</span>
                  </div>
                  <div>
                    <span className="text-ink/40 block text-[9px]">MOQ</span>
                    <span className="font-semibold text-ink/80 truncate block">{p.moq || '1 x 20ft FCL'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-line/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(p, 'isActive')}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase cursor-pointer ${
                    p.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {p.isActive !== false ? '● Active' : '○ Hidden'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="h-7.5 px-2.5 rounded-lg border border-line bg-paper text-xs font-semibold text-ink hover:border-gold hover:text-forest transition inline-flex items-center justify-center cursor-pointer"
                    onClick={() => cloneProduct(p)}
                    title="Clone Product"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    className="h-7.5 px-2.5 rounded-lg border border-line bg-paper text-xs font-semibold text-ink hover:border-forest hover:bg-forest hover:text-white transition inline-flex items-center justify-center cursor-pointer"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="h-7.5 px-2.5 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-clay hover:bg-red-100 transition inline-flex items-center justify-center cursor-pointer"
                    onClick={() => setDeleteTarget(p)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-ink/50 text-xs bg-white rounded-2xl border border-line">
              No products match the selected criteria.
            </div>
          )}
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-clay">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-display text-lg font-bold text-ink">Delete Product?</h3>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Are you sure you want to permanently delete <strong>&quot;{deleteTarget.name}&quot;</strong>? This action will remove the product details from the website catalogue and MongoDB.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                className="btn-outline text-xs cursor-pointer"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-clay px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-sm cursor-pointer"
                onClick={confirmDelete}
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      <Modal
        open={open}
        title={editing ? `Edit: ${editing.name}` : 'New Product Details'}
        onClose={() => setOpen(false)}
        wide
      >
        {/* Form Modal Tabs */}
        <div className="border-b border-line flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveFormTab('basic')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeFormTab === 'basic'
                ? 'bg-forest text-white'
                : 'text-ink/60 hover:text-ink hover:bg-paper'
            }`}
          >
            1. Basic Information *
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('specs')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeFormTab === 'specs'
                ? 'bg-forest text-white'
                : 'text-ink/60 hover:text-ink hover:bg-paper'
            }`}
          >
            2. Export & Shipping Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('custom')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeFormTab === 'custom'
                ? 'bg-forest text-white'
                : 'text-ink/60 hover:text-ink hover:bg-paper'
            }`}
          >
            <span>3. Technical Specs</span>
            {(form.specifications || []).length > 0 && (
              <span className="rounded-full bg-white/20 px-1.5 text-[10px]">
                {form.specifications.length}
              </span>
            )}
          </button>
        </div>

        <form onSubmit={save} className="space-y-4">
          {/* TAB 1: BASIC INFORMATION */}
          {activeFormTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Product Name */}
              <div>
                <label className="label">Product Name *</label>
                <input
                  className="field"
                  required
                  placeholder="e.g. Sortex-Cleaned Cumin Seeds (Jeera)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Category, Sub-Category, Partner */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Parent Category *</label>
                  <select
                    className="field cursor-pointer"
                    required
                    value={form.segment}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        segment: e.target.value,
                        subSegment: '',
                      })
                    }
                  >
                    <option value="">Select Category…</option>
                    {segments.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Sub-Category (Optional)</label>
                  <select
                    className="field cursor-pointer disabled:opacity-50"
                    value={form.subSegment}
                    disabled={!form.segment}
                    onChange={(e) => setForm({ ...form, subSegment: e.target.value })}
                  >
                    <option value="">None / General</option>
                    {formSubsegments.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {form.segment && formSubsegments.length === 0 && (
                    <p className="mt-1 text-[11px] text-ink/45">No sub-categories created for this category.</p>
                  )}
                </div>

                <div>
                  <label className="label">Partner / Producer</label>
                  <select
                    className="field cursor-pointer"
                    value={form.partner}
                    onChange={(e) => setForm({ ...form, partner: e.target.value })}
                  >
                    <option value="">None (In-House NMC Consignment)</option>
                    {partners.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} {p.country ? `(${p.country})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="label">Short Description (Cards & Previews)</label>
                <input
                  className="field"
                  placeholder="e.g. 99.5% European purity, Sortex machine graded with volatile oil content > 3.0%"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="label">Full Product Description</label>
                <textarea
                  className="field"
                  rows="3"
                  placeholder="Detailed agricultural description, harvest methods, culinary or industrial applications…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Product Image */}
              <ImageUpload
                label="Product Main Image"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />

              {/* Next Tab Shortcut */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('specs')}
                  className="text-xs font-bold text-forest hover:underline"
                >
                  Continue to Shipping & Export Specs →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EXPORT & SHIPPING SPECS */}
          {activeFormTab === 'specs' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Origin / Growing Region</label>
                  <input
                    className="field"
                    placeholder="e.g. Unjha, Gujarat, India"
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">HS Code (Harmonized System)</label>
                  <input
                    className="field"
                    placeholder="e.g. 0909.31 or 1006.30"
                    value={form.hsCode}
                    onChange={(e) => setForm({ ...form, hsCode: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Packaging Type</label>
                  <input
                    className="field"
                    placeholder="e.g. 25kg Multi-wall Paper Bag / PP Bag"
                    value={form.packageType}
                    onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Retail Box / Unit Size</label>
                  <input
                    className="field"
                    placeholder="e.g. 200 g, 500 g, 1 kg, Bulk"
                    value={form.boxSize}
                    onChange={(e) => setForm({ ...form, boxSize: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Flavour / Variety</label>
                  <input
                    className="field"
                    placeholder="e.g. Extra Slender, Natural, Roasted"
                    value={form.flavour}
                    onChange={(e) => setForm({ ...form, flavour: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Minimum Order Quantity (MOQ)</label>
                  <input
                    className="field"
                    placeholder="e.g. 1 x 20ft FCL (18 MT) or 3 MT LCL"
                    value={form.moq}
                    onChange={(e) => setForm({ ...form, moq: e.target.value })}
                  />
                </div>
              </div>

              {/* Status & Visibility Switches */}
              <div className="rounded-xl border border-line bg-[#fbf9f4] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-line text-forest focus:ring-forest cursor-pointer"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>Visible in Public Catalogue</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-line text-gold focus:ring-gold cursor-pointer"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <span>★ Feature on Homepage Showcase</span>
                </label>
              </div>

              {/* Next Tab Shortcut */}
              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('basic')}
                  className="text-xs font-bold text-ink/60 hover:underline"
                >
                  ← Back to Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('custom')}
                  className="text-xs font-bold text-forest hover:underline"
                >
                  Continue to Technical Specs →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM TECHNICAL SPECIFICATIONS */}
          {activeFormTab === 'custom' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-xl border border-line bg-[#fbf9f4] p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/70 pb-2">
                  <div>
                    <h4 className="font-display text-sm font-bold text-ink">
                      Technical & Export Specifications Table
                    </h4>
                    <p className="text-[11px] text-ink/60">
                      Add parameters like Purity, Moisture, Curcumin, or Shelf Life displayed on the product page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="inline-flex items-center gap-1 rounded-lg bg-forest px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-forest/90 transition shrink-0 cursor-pointer"
                  >
                    <span>+</span> Add Custom Field
                  </button>
                </div>

                {/* 1-Click Quick Preset Buttons */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink/50 block mb-1.5">
                    Quick Preset Suggestions:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SPEC_PRESETS.map((preset) => (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => addPresetSpec(preset)}
                        className="rounded-lg border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink/75 hover:border-gold hover:text-forest transition cursor-pointer shadow-2xs"
                      >
                        + {preset.key}
                      </button>
                    ))}
                  </div>
                </div>

                {(!form.specifications || form.specifications.length === 0) && (
                  <p className="text-xs text-ink/40 py-4 italic text-center">
                    No custom specifications added yet. Click &quot;+ Add Custom Field&quot; or choose a quick preset above.
                  </p>
                )}

                {/* Specs List */}
                <div className="space-y-2">
                  {(form.specifications || []).map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          className="field text-xs py-1.5"
                          placeholder="Parameter Name (e.g. Moisture)"
                          value={spec.key || ''}
                          onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          className="field text-xs py-1.5"
                          placeholder="Standard Value (e.g. < 5%)"
                          value={spec.value || ''}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="rounded-lg p-2 text-clay hover:bg-clay/10 transition text-sm font-bold shrink-0 cursor-pointer"
                        title="Remove specification"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Back */}
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('specs')}
                  className="text-xs font-bold text-ink/60 hover:underline"
                >
                  ← Back to Shipping Specs
                </button>
              </div>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800">
              {error}
            </div>
          )}

          {/* FORM ACTIONS */}
          <div className="flex items-center justify-between pt-4 border-t border-line">
            <span className="text-xs text-ink/45">
              * Required fields to publish product
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-outline text-xs cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs px-5 shadow-sm font-bold cursor-pointer"
                disabled={busy}
              >
                {busy ? 'Saving to Database…' : editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}