import { useState, useEffect, useRef } from 'react';
import api, { asset } from '../../api/axios.js';

// Uploads an image and returns the stored URL via onChange.
export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState('');
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  // Reset imgError when value changes
  useEffect(() => {
    setImgError(false);
  }, [value]);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant local preview so the user never sees a broken image icon
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setImgError(false);

    setBusy(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview('');
    }
    setImgError(false);
    setError('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displaySrc = localPreview || (value ? asset(value) : '');

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="label">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-clay hover:underline pb-1"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Preview Box */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-mist/20">
          {displaySrc && !imgError ? (
            <img
              src={displaySrc}
              alt=""
              className="h-full w-full object-cover"
              onError={() => {
                // If remote asset failed to load, fall back gracefully
                if (!localPreview) {
                  setImgError(true);
                }
              }}
            />
          ) : imgError ? (
            <div
              className="flex h-full w-full flex-col items-center justify-center p-1 text-center text-[10px] text-clay bg-clay/5 cursor-pointer"
              title="Click to retry loading image"
              onClick={() => setImgError(false)}
            >
              <span>Broken link</span>
              <span className="underline">Retry</span>
            </div>
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-ink/40">
              none
            </div>
          )}

          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white backdrop-blur-[1px]">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        {/* File and URL inputs */}
        <div className="flex-1 min-w-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={upload}
            disabled={busy}
            className="text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-forest file:text-white hover:file:opacity-90"
          />
          <input
            className="field mt-2"
            placeholder="…or paste an image URL"
            value={value || ''}
            onChange={(e) => {
              if (localPreview) {
                URL.revokeObjectURL(localPreview);
                setLocalPreview('');
              }
              setImgError(false);
              onChange(e.target.value);
            }}
          />
        </div>
      </div>

      {busy && <p className="mt-1 text-xs text-moss font-medium">Uploading image to server…</p>}
      {error && <p className="mt-1 text-xs text-clay">{error}</p>}
    </div>
  );
}
