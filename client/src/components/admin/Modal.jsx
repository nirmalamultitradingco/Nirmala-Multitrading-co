export default function Modal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center sm:items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-4 py-4 sm:py-10">
      <div
        className={`w-full max-h-[92vh] flex flex-col rounded-2xl border border-line bg-paper shadow-2xl transition-all ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-4 sm:px-6 py-3.5 sm:py-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-ink truncate pr-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-2xl leading-none text-ink/50 hover:bg-black/5 hover:text-ink transition cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

