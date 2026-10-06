import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';

const blank = { title: '', description: '', segment: '', file: null };

export default function ManageBrochures() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [bannerError, setBannerError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSegmentFilter = searchParams.get('segment') || '';

  const load = () =>
    Promise.all([
      api.get('/brochures'),
      api.get('/segments', { params: { all: true } }),
    ])
      .then(([bRes, sRes]) => {
        setItems(bRes.data || []);
        setSegments(sRes.data || []);
      })
      .catch((err) => setBannerError('Failed to load data: ' + err.message));

  useEffect(() => {
    load();
  }, []);

  // Handle ?action=new from Command Palette or Quick Add
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openNew();
      const next = new URLSearchParams(searchParams);
      next.delete('action');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams]);

  // Calculate brochure counts per segment
  const segmentCounts = useMemo(() => {
    const counts = {};
    items.forEach((b) => {
      const segId = b.segment?._id || b.segment;
      if (segId) counts[segId] = (counts[segId] || 0) + 1;
    });
    return counts;
  }, [items]);

  const uncategorizedCount = useMemo(() => {
    return items.filter((b) => !b.segment).length;
  }, [items]);

  const setSegmentFilter = (segId) => {
    const next = new URLSearchParams(searchParams);
    if (segId) {
      next.set('segment', segId);
    } else {
      next.delete('segment');
    }
    setSearchParams(next);
  };

  const openNew = (preselectedSegmentId = '') => {
    setEditing(null);
    setForm({
      ...blank,
      segment: preselectedSegmentId || selectedSegmentFilter || '',
    });
    setError('');
    setOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      title: b.title || '',
      description: b.description || '',
      segment: b.segment?._id || b.segment || '',
      file: null,
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please provide a brochure title.');
      return;
    }
    if (!editing && !form.file) {
      setError('Please attach a PDF catalogue file.');
      return;
    }
    setBusy(true);
    setError('');
    setBannerError('');

    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('description', form.description.trim());
      fd.append('segment', form.segment || '');
      if (form.file) {
        fd.append('file', form.file);
      }

      if (editing) {
        await api.put(`/brochures/${editing._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setBannerSuccess(`✓ Brochure "${form.title}" updated successfully!`);
      } else {
        await api.post('/brochures', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setBannerSuccess(`✓ Brochure "${form.title}" uploaded successfully!`);
      }

      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 5000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save brochure.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 7000);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
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
    } finally {
      setDeleteBusy(false);
    }
  };

  const filteredItems = useMemo(() => {
    let result = items;

    // Segment filter
    if (selectedSegmentFilter === 'none') {
      result = result.filter((b) => !b.segment);
    } else if (selectedSegmentFilter) {
      result = result.filter((b) => {
        const segId = b.segment?._id || b.segment;
        return segId === selectedSegmentFilter;
      });
    }

    // Search query filter
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.description && b.description.toLowerCase().includes(q)) ||
          (b.segment?.name && b.segment.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [items, selectedSegmentFilter, search]);

  const activeSegmentObj = useMemo(() => {
    if (!selectedSegmentFilter || selectedSegmentFilter === 'none') return null;
    return segments.find((s) => s._id === selectedSegmentFilter) || null;
  }, [segments, selectedSegmentFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold text-ink">Brochures & Catalogues</h1>
            <span className="rounded-full bg-forest/10 border border-forest/20 px-2.5 py-0.5 text-xs font-mono font-bold text-forest">
              {items.length} files
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Downloadable PDF product specification sheets, catalogues, and export line cards organized by Product Segment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Link
            to="/brochures"
            target="_blank"
            rel="noreferrer"
            className="btn-outline h-9.5 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            title="Preview public brochures page in new tab"
          >
            <span>View Public Page</span>
            <span>↗</span>
          </Link>

          <button
            type="button"
            className="btn-primary h-9.5 px-4 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            onClick={() => openNew()}
          >
            <span className="text-base leading-none">+</span>
            <span>Upload PDF Brochure</span>
          </button>
        </div>
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

      {/* 2. PRODUCT SEGMENTS OVERVIEW CARDS */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <span>🗂️</span> Product Segments Overview
            </h2>
            <p className="text-xs text-ink/65 mt-0.5">
              Click any segment to filter catalogues, or click &quot;+ Add PDF&quot; on that card to attach a new brochure directly to that segment.
            </p>
          </div>
          {selectedSegmentFilter && (
            <button
              type="button"
              onClick={() => setSegmentFilter('')}
              className="text-xs text-forest hover:underline font-semibold cursor-pointer"
            >
              Clear Segment Filter ✕
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* All Segments Card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSegmentFilter('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSegmentFilter('');
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              !selectedSegmentFilter
                ? 'border-gold bg-[#fbf9f4] ring-2 ring-gold/30 shadow-xs'
                : 'border-line/70 hover:border-gold/40 hover:bg-[#fbf9f4]/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">📁</span>
              <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                {items.length} files
              </span>
            </div>
            <div className="mt-2">
              <h3 className="font-display text-xs font-bold text-ink">All Segments</h3>
              <p className="text-[11px] text-ink/60 mt-0.5">Entire export catalogue</p>
            </div>
            <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-ink/50">
              <span>{!selectedSegmentFilter ? '✓ Showing All' : 'Click to filter'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Dynamic Segment Cards */}
          {segments.map((s) => {
            const count = segmentCounts[s._id] || 0;
            const isSelected = selectedSegmentFilter === s._id;

            return (
              <div
                key={s._id}
                role="button"
                tabIndex={0}
                onClick={() => setSegmentFilter(s._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSegmentFilter(s._id);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-gold bg-[#fbf9f4] ring-2 ring-gold/30 shadow-xs'
                    : 'border-line/70 hover:border-gold/40 hover:bg-[#fbf9f4]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-forest/10 shrink-0">
                    {s.image ? (
                      <img src={asset(s.image)} alt={s.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs">🌿</div>
                    )}
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                      count > 0 ? 'bg-gold/20 text-gold-dark' : 'bg-line/40 text-ink/40'
                    }`}
                  >
                    {count} {count === 1 ? 'file' : 'files'}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <h3 className="font-display text-xs font-bold text-ink truncate" title={s.name}>
                    {s.name}
                  </h3>
                  <Link
                    to={`/brochures/${s.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] text-ink/40 hover:text-forest transition ml-1"
                    title={`View ${s.name} public brochures page`}
                  >
                    ↗
                  </Link>
                </div>
                <p className="text-[11px] text-ink/60 mt-0.5 line-clamp-1">
                  {s.description || 'Export line'}
                </p>

                <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-forest font-bold' : 'text-ink/50'}>
                    {isSelected ? '✓ Filtered' : 'Filter files'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openNew(s._id);
                    }}
                    className="h-6 px-2 rounded-md bg-gold/15 hover:bg-gold text-ink font-bold text-[10px] transition border border-gold/30 cursor-pointer"
                    title={`Add new brochure to ${s.name}`}
                  >
                    + Add PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & SEGMENT PILLS TOOLBAR */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card space-y-3">
        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-line/60">
          <span className="text-xs font-mono font-bold text-ink/50 mr-1">Filter by Segment:</span>
          <button
            type="button"
            onClick={() => setSegmentFilter('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              !selectedSegmentFilter
                ? 'bg-forest text-white shadow-xs'
                : 'bg-paper text-ink/70 hover:bg-surface hover:text-ink border border-line'
            }`}
          >
            All ({items.length})
          </button>

          {segments.map((s) => {
            const count = segmentCounts[s._id] || 0;
            const isSelected = selectedSegmentFilter === s._id;
            return (
              <button
                key={s._id}
                type="button"
                onClick={() => setSegmentFilter(s._id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-paper text-ink/70 hover:bg-surface hover:text-ink border border-line'
                }`}
              >
                <span>{s.name}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-gold' : 'text-ink/50'}`}>
                  ({count})
                </span>
              </button>
            );
          })}

          {uncategorizedCount > 0 && (
            <button
              type="button"
              onClick={() => setSegmentFilter('none')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedSegmentFilter === 'none'
                  ? 'bg-forest text-white shadow-xs'
                  : 'bg-paper text-ink/70 hover:bg-surface hover:text-ink border border-line'
              }`}
            >
              General / Uncategorized ({uncategorizedCount})
            </button>
          )}
        </div>

        {/* Live Search & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
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
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink/50 whitespace-nowrap">
              {filteredItems.length} of {items.length} brochures
            </span>
            {activeSegmentObj && (
              <button
                type="button"
                onClick={() => openNew(activeSegmentObj._id)}
                className="btn-primary h-8 px-3 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                + Add to {activeSegmentObj.name}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. BROCHURES GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((b) => (
          <div
            key={b._id}
            className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-card hover:border-gold/60 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-3xl">📄</span>
                {b.segment?.name ? (
                  <button
                    type="button"
                    onClick={() => setSegmentFilter(b.segment._id)}
                    className="rounded-full bg-forest/10 hover:bg-forest/20 border border-forest/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-forest cursor-pointer transition"
                  >
                    {b.segment.name}
                  </button>
                ) : (
                  <span className="rounded-full bg-paper border border-line px-2.5 py-0.5 text-[10px] font-mono text-ink/50">
                    General Catalogue
                  </span>
                )}
              </div>

              <h3 className="font-display text-base font-bold text-ink leading-snug">{b.title}</h3>

              {b.description ? (
                <p className="text-xs text-ink/65 line-clamp-2 leading-relaxed">{b.description}</p>
              ) : (
                <p className="text-xs text-ink/40 italic">No description provided.</p>
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-8 px-3 rounded-lg border border-line bg-white text-xs font-semibold text-ink hover:border-gold hover:text-gold transition cursor-pointer"
                  onClick={() => openEdit(b)}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="h-8 px-3 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-clay hover:bg-red-100 transition cursor-pointer"
                  onClick={() => setDeleteTarget(b)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-ink/50 text-xs bg-white rounded-2xl border border-line space-y-3">
            <p>
              No brochures found{' '}
              {activeSegmentObj ? `for segment "${activeSegmentObj.name}"` : search ? 'matching your search' : ''}.
            </p>
            <button
              type="button"
              onClick={() => openNew(activeSegmentObj?._id || '')}
              className="btn-primary text-xs py-2 px-4 cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Upload New PDF Brochure</span>
            </button>
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
                disabled={deleteBusy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-clay px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-sm cursor-pointer"
                onClick={confirmDelete}
                disabled={deleteBusy}
              >
                {deleteBusy ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / EDIT MODAL */}
      <Modal
        open={open}
        title={editing ? `Edit Brochure: ${editing.title}` : 'Upload PDF Brochure'}
        onClose={() => setOpen(false)}
      >
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
            <label className="label">Associated Category / Product Segment</label>
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
            <label className="label">
              PDF Document File {editing ? '(Leave empty to keep current file)' : '*'}
            </label>
            {editing && (
              <p className="text-[11px] font-mono text-ink/60 mb-2">
                Current PDF:{' '}
                <a
                  href={asset(editing.file)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-forest underline font-bold"
                >
                  View current file ↗
                </a>
              </p>
            )}
            <input
              type="file"
              required={!editing}
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
              {busy ? 'Saving to Server…' : editing ? 'Save Changes' : 'Upload Brochure'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
