import { useEffect, useState, useMemo } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';

const blank = { title: '', description: '', segment: '', file: null };

export default function ManageBrochures() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [bannerError, setBannerError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () =>
    api
      .get('/brochures')
      .then((r) => setItems(r.data || []))
      .catch((err) => setBannerError('Failed to load brochures: ' + err.message));

  useEffect(() => {
    load();
    api
      .get('/segments', { params: { all: true } })
      .then((r) => setSegments(r.data || []))
      .catch(() => {});
  }, []);

  const openNew = () => {
    setForm(blank);
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please provide a brochure title.');
      return;
    }
    if (!form.file) {
      setError('Please attach a PDF catalogue file.');
      return;
    }
    setBusy(true);
    setError('');
    setBannerError('');

    try {
      const fd = new FormData();
      fd.append('file', form.file);
      fd.append('title', form.title.trim());
      fd.append('description', form.description.trim());
      if (form.segment) fd.append('segment', form.segment);

      await api.post('/brochures', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBannerSuccess(`✓ Brochure "${form.title}" uploaded successfully!`);
      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 5000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload brochure.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/brochures/${deleteTarget._id}`);
      setBannerSuccess(`✓ Brochure "${deleteTarget.title}" deleted successfully!`);
      setTimeout(() => setBannerSuccess(''), 5000);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete brochure.';
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.segment?.name && b.segment.name.toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold text-ink">Brochures & Catalogues</h1>
            <span className="rounded-full bg-forest/10 border border-forest/20 px-2.5 py-0.5 text-xs font-mono font-bold text-forest">
              {items.length} files
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Downloadable PDF product specification sheets, catalogues, and export line cards.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary h-9.5 px-4 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          onClick={openNew}
        >
          <span className="text-base leading-none">+</span>
          <span>Upload PDF Brochure</span>
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
            placeholder="Search brochures by title, description or category…"
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

      {/* BROCHURES GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((b) => (
          <div
            key={b._id}
            className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-card hover:border-gold/60 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">📄</span>
                {b.segment?.name ? (
                  <span className="rounded-full bg-forest/10 border border-forest/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-forest">
                    {b.segment.name}
                  </span>
                ) : (
                  <span className="rounded-full bg-paper border border-line px-2.5 py-0.5 text-[10px] font-mono text-ink/50">
                    General Catalogue
                  </span>
                )}
              </div>

              <h3 className="font-display text-base font-bold text-ink leading-snug">{b.title}</h3>
              {b.description && (
                <p className="text-xs text-ink/65 line-clamp-2 leading-relaxed">{b.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-line/60 flex items-center justify-between gap-2">
              <a
                href={asset(b.file)}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-3 rounded-lg border border-line bg-paper text-xs font-semibold text-forest hover:bg-forest hover:text-white transition inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>View PDF</span>
                <span>↗</span>
              </a>

              <button
                type="button"
                className="h-8 px-3 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-clay hover:bg-red-100 transition inline-flex items-center cursor-pointer"
                onClick={() => setDeleteTarget(b)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-ink/50 text-xs bg-white rounded-2xl border border-line">
            No brochures found. Click &quot;+ Upload PDF Brochure&quot; above to add one.
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-clay">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-display text-lg font-bold text-ink">Delete Brochure?</h3>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Are you sure you want to permanently delete <strong>&quot;{deleteTarget.title}&quot;</strong>? This PDF will no longer be available for buyers to download.
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

      {/* UPLOAD MODAL */}
      <Modal open={open} title="Upload PDF Brochure" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Brochure / Line Card Title *</label>
            <input
              className="field"
              required
              placeholder="e.g. NMC Spices & Agro Commodities Line Card 2026"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="field"
              rows="2"
              placeholder="What this brochure contains (e.g. container loading specs, packaging, Sortex grades)..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Associated Category (Optional)</label>
            <select
              className="field cursor-pointer"
              value={form.segment}
              onChange={(e) => setForm({ ...form, segment: e.target.value })}
            >
              <option value="">General (Not tied to a specific category)</option>
              {segments.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-dashed border-line p-4 bg-[#fbf9f4] space-y-2">
            <label className="label">PDF Document File *</label>
            <input
              type="file"
              required
              accept="application/pdf"
              onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
              className="block w-full text-xs text-ink/70 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-forest file:text-white hover:file:bg-[#0d1e17] file:cursor-pointer cursor-pointer"
            />
            {form.file && (
              <p className="text-[11px] font-mono text-forest font-semibold">
                ✓ Selected: {form.file.name} ({(form.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
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
              {busy ? 'Uploading to Server…' : 'Upload Brochure'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
