import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = {
  name: '',
  segment: '',
  description: '',
  image: '',
  order: 0,
  isActive: true,
};

export default function ManageSubSegments() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [bannerError, setBannerError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const [filterSegment, setFilterSegment] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    return Promise.all([
      api.get('/subsegments', { params: { all: true } }),
      api.get('/segments', { params: { all: true } }),
      api.get('/products', { params: { admin: true, limit: 1000 } }).catch(() => ({ data: { products: [] } })),
    ]).then(([subRes, segRes, prodRes]) => {
      setItems(subRes.data || []);
      setSegments(segRes.data || []);

      const counts = {};
      (prodRes.data?.products || []).forEach((p) => {
        const subId = p.subSegment?._id || p.subSegment;
        if (subId) counts[subId] = (counts[subId] || 0) + 1;
      });
      setProductCounts(counts);
    });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const segParam = searchParams.get('segment');
    if (segParam) setFilterSegment(segParam);

    if (searchParams.get('action') === 'new') {
      openNew();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...blank, segment: filterSegment || (segments[0]?._id || '') });
    setError('');
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...blank,
      ...item,
      segment: item.segment?._id || item.segment || '',
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Sub-category name is required.');
      return;
    }
    if (!form.segment) {
      setError('Parent category is required.');
      return;
    }

    setBusy(true);
    setError('');
    setBannerError('');

    try {
      if (editing) {
        await api.put(`/subsegments/${editing._id}`, form);
        setBannerSuccess(`✓ Sub-category "${form.name}" updated successfully!`);
      } else {
        await api.post('/subsegments', form);
        setBannerSuccess(`✓ Sub-category "${form.name}" created successfully!`);
      }
      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 5000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save sub-category.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      const updated = { ...item, isActive: !item.isActive };
      await api.put(`/subsegments/${item._id}`, updated);
      setItems((prev) => prev.map((s) => (s._id === item._id ? updated : s)));
      setBannerSuccess(`✓ Visibility updated!`);
      setTimeout(() => setBannerSuccess(''), 3000);
    } catch {
      setBannerError('Failed to update status.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/subsegments/${deleteTarget._id}`);
      setBannerSuccess(`✓ Sub-category "${deleteTarget.name}" deleted successfully!`);
      setTimeout(() => setBannerSuccess(''), 5000);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete sub-category.';
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    }
  };

  const activeSegments = useMemo(() => {
    return segments.filter((s) => s.isActive !== false);
  }, [segments]);

  // Grouped and filtered
  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();

    return segments
      .filter((s) => !filterSegment || s._id === filterSegment)
      .map((seg) => {
        const segItems = items.filter((item) => {
          const belongs = (item.segment?._id || item.segment) === seg._id;
          if (!belongs) return false;
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q))
          );
        });

        return {
          segment: seg,
          items: segItems,
        };
      })
      .filter((g) => !filterSegment || g.segment._id === filterSegment);
  }, [segments, items, filterSegment, search]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold text-ink">Sub-Categories</h1>
            <span className="rounded-full bg-forest/10 border border-forest/20 px-2.5 py-0.5 text-xs font-mono font-bold text-forest">
              {items.length} sub-categories
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Manage second-level category classifications shown inside each product segment.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary h-9.5 px-4 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          onClick={openNew}
        >
          <span className="text-base leading-none">+</span>
          <span>Add Sub-Category</span>
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

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sub-categories by name…"
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

        <div className="flex items-center gap-2">
          <select
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="h-9.5 rounded-xl border border-line bg-[#fbf9f4] px-3 text-xs font-semibold text-ink focus:border-gold focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="">All Parent Categories ({segments.length})</option>
            {segments.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {filterSegment && (
            <button
              type="button"
              onClick={() => setFilterSegment('')}
              className="text-xs text-forest hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* GROUPED LIST BY CATEGORY */}
      <div className="space-y-6">
        {filteredGroups.map(({ segment, items: segmentItems }) => (
          <section key={segment._id} className="rounded-2xl border border-line bg-white p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📦</span>
                <h2 className="font-display font-bold text-ink text-base">{segment.name}</h2>
                <span className="rounded-full bg-forest/10 border border-forest/20 px-2 py-0.5 text-[11px] font-mono font-bold text-forest">
                  {segmentItems.length} {segmentItems.length === 1 ? 'sub-category' : 'sub-categories'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ ...blank, segment: segment._id });
                  setError('');
                  setOpen(true);
                }}
                className="text-xs font-bold text-forest hover:underline cursor-pointer"
              >
                + Add to {segment.name}
              </button>
            </div>

            <div className="grid gap-2.5">
              {segmentItems.map((item) => {
                const prodCount = productCounts[item._id] || 0;

                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line/80 bg-[#fbf9f4] p-3 hover:border-gold/60 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-line/30 border border-line">
                        {item.image ? (
                          <img src={asset(item.image)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-ink/30 text-[10px] font-mono">NMC</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-ink text-sm">{item.name}</p>
                          <span className="rounded-full bg-white border border-line px-2 py-0.5 text-[10px] font-mono text-ink/65">
                            {prodCount} Products
                          </span>
                        </div>
                        {item.description && (
                          <p className="truncate text-xs text-ink/55 mt-0.5 max-w-lg">{item.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        className={`h-7.5 px-2.5 rounded-full text-[10px] font-bold uppercase transition inline-flex items-center cursor-pointer ${
                          item.isActive !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-300'
                        }`}
                      >
                        {item.isActive !== false ? '● Active' : '○ Hidden'}
                      </button>

                      <button
                        type="button"
                        className="h-8 px-3 rounded-lg border border-line bg-white text-xs font-semibold text-ink hover:border-forest hover:bg-forest hover:text-white transition inline-flex items-center cursor-pointer"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="h-8 px-3 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-clay hover:bg-red-100 transition inline-flex items-center cursor-pointer"
                        onClick={() => setDeleteTarget(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {segmentItems.length === 0 && (
                <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-ink/50 bg-white">
                  No sub-categories created for this category yet.
                </p>
              )}
            </div>
          </section>
        ))}

        {segments.length === 0 && (
          <div className="rounded-2xl border border-line bg-white p-8 text-center text-xs text-ink/50">
            Please create a product category first.
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-clay">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-display text-lg font-bold text-ink">Delete Sub-Category?</h3>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Are you sure you want to delete <strong>&quot;{deleteTarget.name}&quot;</strong>?
              {productCounts[deleteTarget._id] > 0 && (
                <span className="block mt-1 font-bold text-amber-900">
                  Notice: There are {productCounts[deleteTarget._id]} products currently categorized under this sub-category.
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
        title={editing ? `Edit: ${editing.name}` : 'New Sub-Category'}
        onClose={() => setOpen(false)}
        wide
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Parent Category *</label>
            <select
              className="field cursor-pointer"
              required
              value={form.segment}
              onChange={(e) => setForm({ ...form, segment: e.target.value })}
            >
              <option value="">Select Category…</option>
              {activeSegments.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Sub-Category Name *</label>
            <input
              className="field"
              required
              placeholder="e.g. Whole Spices, Steam Basmati, Namkeen"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="field"
              rows="3"
              placeholder="Brief description of this second-level classification..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <ImageUpload
            label="Sub-Category Image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />

          <div className="flex items-center gap-4">
            <div className="w-24">
              <label className="label">Sort Order</label>
              <input
                type="number"
                className="field font-mono"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <label className="mt-6 flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-2 rounded-xl border border-forest/20">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Visible on website
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
              {busy ? 'Saving…' : editing ? 'Update Sub-Category' : 'Create Sub-Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
