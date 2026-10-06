import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';

const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  } catch {
    return '';
  }
};

export default function NewsDetail() {
  const { slug } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mediaTab, setMediaTab] = useState('video'); // 'video' | 'image'

  useEffect(() => {
    api
      .get(`/news/${slug}`)
      .then((r) => {
        setItem(r.data);
        if (r.data?.video) {
          setMediaTab('video');
        } else if (r.data?.image) {
          setMediaTab('image');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error || !item)
    return (
      <div className="container-x py-20">
        <p className="text-clay">{error || 'Blog article not found.'}</p>
        <Link to="/blog" className="btn-outline mt-5">
          ← Back to Blog
        </Link>
      </div>
    );

  const galleryImages = (item.images || []).filter(Boolean);
  const sections = (item.sections || []).filter((s) => s.subtitle || s.text || s.image);

  return (
    <article className="overflow-x-hidden min-h-screen bg-paper text-ink transition-colors pb-20">

      <div className="container-x pt-6">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4 mb-6">
          <Link to="/blog" className="text-xs font-mono font-bold text-forest hover:text-gold transition inline-flex items-center gap-1.5">
            <span>←</span>
            <span>Back to All Articles</span>
          </Link>
          {item.publishedAt && (
            <span className="font-mono text-xs text-ink/50">
              Published on {formatDate(item.publishedAt)}
            </span>
          )}
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Eyebrow & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="eyebrow text-gold">Export Intelligence & Insights</span>
            {item.featured && (
              <span className="rounded-full bg-gold/20 text-gold-dark border border-gold/30 px-2.5 py-0.5 font-mono text-[10px] font-bold">
                ★ Featured Article
              </span>
            )}
            {item.video && (
              <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 font-mono text-[10px] font-bold">
                🎬 Video Available
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            {item.title || 'Untitled Article'}
          </h1>

          {item.excerpt && (
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink/75 font-medium border-l-2 border-gold pl-4 italic">
              {item.excerpt}
            </p>
          )}

          {/* Primary Featured Media Showcase with Strict 16:9 Alignment & Ambient Glow */}
          {(item.video || item.image) && (
            <div className="mt-8 relative group">
              {/* Ambient theater glow reflection */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-gold/30 via-emerald-600/20 to-gold/20 blur-2xl opacity-60 pointer-events-none group-hover:opacity-90 transition-opacity duration-700" />

              {/* Luxury Frame */}
              <div className="relative rounded-[26px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 p-2 sm:p-2.5 backdrop-blur-xl border border-line shadow-2xl">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#07130e] border border-gold/30 flex items-center justify-center">
                  {/* Switcher pills when both video and image exist */}
                  {item.video && item.image && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1 rounded-full bg-black/80 p-1 backdrop-blur-md border border-white/20 shadow-lg">
                      <button
                        type="button"
                        onClick={() => setMediaTab('video')}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          mediaTab === 'video'
                            ? 'bg-gold text-ink shadow-sm'
                            : 'text-paper/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>🎬</span>
                        <span>Video Tour</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaTab('image')}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          mediaTab === 'image'
                            ? 'bg-gold text-ink shadow-sm'
                            : 'text-paper/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>🖼️</span>
                        <span>Cover Photo</span>
                      </button>
                    </div>
                  )}

                  {/* Video View */}
                  {((mediaTab === 'video' && item.video) || (!item.image && item.video)) ? (
                    <div className="relative h-full w-full bg-black flex items-center justify-center">
                      <video
                        key={item.video}
                        src={asset(item.video)}
                        poster={item.image ? asset(item.image) : undefined}
                        controls
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                      <div className="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 font-mono text-[9px] font-bold text-gold border border-gold/40 backdrop-blur shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          HD 1080p Video
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Image View */
                    <div className="relative h-full w-full bg-[#102018] group/img overflow-hidden">
                      <img
                        src={asset(item.image)}
                        alt={item.title || ''}
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/NMC logo.png';
                          e.currentTarget.className = 'h-full w-full object-contain p-8 bg-[#102018]';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 font-mono text-[9px] font-bold text-gold border border-gold/40 backdrop-blur shadow-sm">
                          Official Article Photo
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Article Content */}
          {item.content && (
            <div className="mt-10 whitespace-pre-line text-base leading-relaxed text-ink/85 font-sans space-y-4">
              {item.content}
            </div>
          )}

          {/* Multiple Content Sections */}
          {sections.length > 0 && (
            <div className="mt-14 space-y-12 border-t border-line/80 pt-10">
              {sections.map((sec, idx) => (
                <div key={sec._id || idx} className="space-y-4">
                  {sec.subtitle && (
                    <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl border-l-3 border-forest pl-3">
                      {sec.subtitle}
                    </h2>
                  )}
                  {sec.image && (
                    <div className="overflow-hidden rounded-2xl border border-line bg-line/30 shadow-md aspect-[16/9] w-full">
                      <img
                        src={asset(sec.image)}
                        alt={sec.subtitle || `Section image ${idx + 1}`}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/NMC logo.png';
                          e.currentTarget.className = 'h-full w-full object-contain p-6 bg-forest/5';
                        }}
                      />
                    </div>
                  )}
                  {sec.text && (
                    <div className="whitespace-pre-line text-base leading-relaxed text-ink/80">
                      {sec.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Photo Gallery with strict aspect ratio grid */}
          {galleryImages.length > 0 && (
            <div className="mt-16 border-t border-line/80 pt-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="eyebrow text-gold">Media Documentation</span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-ink">Photo Gallery ({galleryImages.length})</h3>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-forest/5 shadow-card relative"
                  >
                    <img
                      src={asset(img)}
                      alt={`Gallery photo ${idx + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/NMC logo.png';
                        e.currentTarget.className = 'h-full w-full object-contain p-4 bg-forest/5';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                      Photo #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Back & Inquiry Banner */}
          <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/blog" className="btn-outline text-xs py-2 px-4">
              ← Return to Blog Articles
            </Link>
            <Link
              to={`/inquiry?subject=${encodeURIComponent(`Inquiry from Blog: ${item.title}`)}`}
              className="btn-primary text-xs py-2.5 px-5 shadow-md"
            >
              Inquire About Commodities Mentioned ✉️
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
