import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';

export default function SubSegmentCard({ subsegment, segmentSlug }) {
  return (
    <Link
      to={`/products/${segmentSlug}/${subsegment.slug}`}
      className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-ink shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_20px_40px_-12px_rgba(198,145,46,0.3)]"
    >
      {/* Background Image with Zoom */}
      {subsegment.image ? (
        <img
          src={asset(subsegment.image)}
          alt={subsegment.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.src = '/NMC logo.png';
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#123125] to-[#0a1e16]" />
      )}

      {/* Multi-tier gradient overlay for maximum readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-[#07130e]/65 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Top Floating Badge */}
      <div className="relative z-10 p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-ink/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur-md shadow-sm transition-colors group-hover:border-gold/50">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          Sub Category
        </span>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 p-5 text-paper">
        <div className="mb-2 h-0.5 w-7 rounded-full bg-gold transition-all duration-500 group-hover:w-full" />
        <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-gold-light">
          {subsegment.name}
        </h3>
        {subsegment.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-paper/75">
            {subsegment.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-gold">
          <span>View range</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
