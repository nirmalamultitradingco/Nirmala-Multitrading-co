import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = { name: '', description: '', image: '', order: 0, isActive: true };

export default function ManageSegments() {
  const [items, setItems] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [subCounts, setSubCounts] = useState({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [bannerError, setBannerError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    return Promise.all([
      api.get('/segments', { params: { all: true } }),
      api.get('/products', { params: { admin: true, limit: 1000 } }).catch(() => ({ data: { products: [] } })),
      api.get('/subsegments', { params: { all: true } }).catch(() => ({ data: [] })),
    ]).then(([segRes, prodRes, subRes]) => {
      setItems(segRes.data || []);

      // Calculate product counts per category
      const pCounts = {};
      (prodRes.data?.products || []).forEach((p) => {
        const segId = p.segment?._id || p.segment;
        if (segId) pCounts[segId] = (pCounts[segId] || 0) + 1;
      });
      setProductCounts(pCounts);

      // Calculate subcategory counts per category
      const sCounts = {};
      (subRes.data || []).forEach((sub) => {
        const segId = sub.segment?._id || sub.segment;
        if (segId) sCounts[segId] = (sCounts[segId] || 0) + 1;
      });
      setSubCounts(sCounts);
    });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openNew();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const openNew = () => {
    setEditing(null);
    setForm(blank);
    setError('');
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...blank, ...s });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }

    setBusy(true);
    setError('');
    setBannerError('');

    try {
      if (editing) {
        await api.put(`/segments/${editing._id}`, form);
        setBannerSuccess(`✓ Category "${form.name}" updated successfully!`);
      } else {
        await api.post('/segments', form);
        setBannerSuccess(`✓ Category "${form.name}" added successfully!`);
      }
      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 5000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save category.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (s) => {
    try {
      const updated = { ...s, isActive: !s.isActive };
      await api.put(`/segments/${s._id}`, updated);
      setItems((prev) => prev.map((item) => (item._id === s._id ? updated : item)));
      setBannerSuccess(`✓ "${s.name}" visibility updated!`);
      setTimeout(() => setBannerSuccess(''), 3000);
    } catch {
      setBannerError('✗ Failed to update category status');
      setTimeout(() => setBannerError(''), 4000);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/segments/${deleteTarget._id}`);
      setBannerSuccess(`✓ Category "${deleteTarget.name}" deleted successfully!`);
      setTimeout(() => setBannerSuccess(''), 5000);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete category.';
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold text-ink">Product Categories</h1>
            <span className="rounded-full bg-forest/10 border border-forest/20 px-2.5 py-0.5 text-xs font-mono font-bold text-forest">
              {items.length} categories
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Main product segments shown across the website (e.g. Spices, Grains, Dehydrated Foods).
          </p>
        </div>

        <button
          type="button"
          className="btn-primary h-9.5 px-4 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          onClick={openNew}
        >
          <span className="text-base leading-none">+</span>
          <span>Add Category</span>
        </button>
      </div>

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

      {/* SEARCH TOOLBAR */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or description…"
            className="w-full h-9.5 rounded-xl border border-line bg-[#fbf9f4] px-3.5 pl-9 text-xs text-ink placeholder-ink/40 focus:border-gold focus:bg-white focus:outline-hidden"
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
        <span className="text-xs font-mono text-ink/50 whitespace-nowrap">
          {filteredItems.length} of {items.length}
        </span>
      </div>

      {/* CATEGORIES LIST */}
      <div className="grid gap-3">
        {filteredItems.map((s) => {
          const prodCount = productCounts[s._id] || 0;
          const subCount = subCounts[s._id] || 0;

          return (
            <div
              key={s._id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card hover:border-gold/50 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-line/30">
                  {s.image ? (
                    <img src={s.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-ink/30 text-xs font-mono">NMC</span>
                  )}
                </div>
                <div
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-forest/10 border border-forest/20 text-xs font-mono font-bold text-forest"
                  title="Display Order Position"
                >
                  #{s.order}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-bold text-ink text-sm sm:text-base">{s.name}</p>
                    <span className="rounded-full bg-paper border border-line px-2.5 py-0.5 text-[10px] font-mono text-ink/65">
                      {prodCount} {prodCount === 1 ? 'Product' : 'Products'}
                    </span>
                    {subCount > 0 && (
                      <span className="rounded-full bg-paper border border-line px-2.5 py-0.5 text-[10px] font-mono text-ink/65">
                        {subCount} {subCount === 1 ? 'Sub-Category' : 'Sub-Categories'}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-ink/60 mt-0.5 max-w-xl">
                    {s.description || 'No description entered.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons & Quick Jumps */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
                {/* Jump to Products in this category */}
                <Link
                  to={`/admin/products?segment=${s._id}`}
                  className="h-8 px-3 rounded-lg border border-line bg-paper text-xs font-semibold text-forest hover:bg-forest hover:text-white transition shadow-2xs inline-flex items-center"
                  title={`View all ${prodCount} products in this category`}
                >
                  View Products ({prodCount}) →
                </Link>

                <button
                  type="button"
                  onClick={() => toggleActive(s)}
                  className={`h-7.5 px-2.5 rounded-full text-[10px] font-bold uppercase transition inline-flex items-center cursor-pointer ${
                    s.isActive !== false
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-300'
                  }`}
                  title="Toggle website visibility"
                >
                  {s.isActive !== false ? '● Active' : '○ Hidden'}
                </button>

                <button
                  type="button"
                  className="h-8 px-3 rounded-lg border border-line bg-paper text-xs font-semibold text-ink hover:border-forest hover:bg-forest hover:text-white transition inline-flex items-center cursor-pointer"
                  onClick={() => openEdit(s)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="h-8 px-3 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-clay hover:bg-red-100 transition inline-flex items-center cursor-pointer"
                  onClick={() => setDeleteTarget(s)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-line bg-white p-8 text-center text-xs text-ink/50">
            No categories match &quot;{search}&quot;.
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-clay">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-display text-lg font-bold text-ink">Delete Category?</h3>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Are you sure you want to delete <strong>&quot;{deleteTarget.name}&quot;</strong>?
              {productCounts[deleteTarget._id] > 0 && (
                <span className="block mt-1 font-bold text-amber-900">
                  Notice: There are {productCounts[deleteTarget._id]} products currently linked to this category.
                </span>
              )}
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
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      <Modal
        open={open}
        title={editing ? `Edit: ${editing.name}` : 'New Product Category'}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input
              className="field"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Spices & Seasonings"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="field"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief summary of this product category shown on category overview..."
            />
          </div>

          <ImageUpload
            label="Category Image (Header / Banner)"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />

          <div className="flex items-center gap-4 pt-2">
            <div className="w-28">
              <label className="label">Display Order</label>
              <input
                type="number"
                className="field font-mono"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <label className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-2 rounded-xl border border-forest/20">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Visible on Website
            </label>
          </div>

          {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}

          <div className="flex justify-end gap-2 pt-3 border-t border-line/60">
            <button
              type="button"
              className="btn-outline text-xs cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs font-bold px-4 cursor-pointer"
              disabled={busy}
            >
              {busy ? 'Saving…' : editing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
