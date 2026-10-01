import { useEffect, useState, useCallback } from 'react';
import { BRAND } from '../config.js';
import { useSiteContent } from '../context/SiteContentContext.jsx';
import { asset } from '../api/axios.js';

export default function FirstVisitLoader() {
  const { loader } = useSiteContent();
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(0);

  // If disabled from admin CMS
  const isActive = loader ? loader.isActive !== false : true;

  // Direct duration from admin panel (default 2.5s)
  const baseSeconds = Number(loader?.durationSeconds) || 2.5;
  const displayDuration = Math.max(800, Math.min(10000, Math.round(baseSeconds * 1000)));

  // Allow triggering a live replay via custom event
  const replayLoader = useCallback(() => {
    setIsExiting(false);
    setVisible(true);
    setPlayTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handlePreview = () => replayLoader();
    window.addEventListener('nmc:preview-loader', handlePreview);
    return () => window.removeEventListener('nmc:preview-loader', handlePreview);
  }, [replayLoader]);

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      window.dispatchEvent(new CustomEvent('nmc:loader-finished'));
      return undefined;
    }

    setIsExiting(false);
    setVisible(true);

    const fadeMs = Math.max(300, displayDuration - 400);

    const fadeTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, fadeMs);

    const finishTimer = window.setTimeout(() => {
      setVisible(false);
      window.dispatchEvent(new CustomEvent('nmc:loader-finished'));
    }, displayDuration);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [isActive, displayDuration, playTrigger]);

  if (!isActive || !visible) return null;

  // Preserve exact user customization: empty string hides the field, non-empty displays it
  const brandName = loader?.title !== undefined && loader?.title !== '' ? loader.title : BRAND.fullName;
  const brandTagline = loader?.tagline !== undefined ? loader.tagline : BRAND.tagline;
  const eyebrow = loader?.eyebrow !== undefined ? loader.eyebrow : 'Certified Indian Agro-Food Exporter';
  const subtitle = loader?.subtitle !== undefined ? loader.subtitle : 'Connecting Trusted Indian Agro-Food Products Globally';
  const statusText = loader?.statusText !== undefined ? loader.statusText : 'Preparing Premium Consignments…';
  const badgeText = loader?.badgeText !== undefined ? loader.badgeText : 'APEDA • SPICE BOARD INDIA • FSSAI';
  const showProgress = loader?.showProgress !== false;
  const imageFit = loader?.imageFit || 'cover';

  const logoSrc = asset(loader?.logo || '/NMC logo.png');

  return (
    <div
      className={`first-visit-loader ${isExiting ? 'is-exiting' : ''}`}
      aria-label={`Loading ${brandName}`}
      role="status"
    >
      <div className="first-visit-loader__content">
        {/* Top Eyebrow Chip */}
        {eyebrow && eyebrow.trim() !== '' && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gold shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
            <span>{eyebrow}</span>
          </div>
        )}

        {/* Brand Logo / Image Frame with Edge-to-Edge Background Fit */}
        <div className="first-visit-loader__logo-circle overflow-hidden relative">
          <img
            src={logoSrc}
            alt={brandName}
            className={`h-full w-full ${
              imageFit === 'contain'
                ? 'object-contain p-2.5'
                : 'object-cover object-center transition-transform duration-700 ease-out hover:scale-105'
            }`}
            onError={(e) => {
              e.target.src = '/NMC logo.png';
            }}
          />
        </div>

        {/* Brand Name Title */}
        {brandName && brandName.trim() !== '' && (
          <h2 className="first-visit-loader__brand">
            {brandName}
          </h2>
        )}

        {/* Brand Tagline Slogan */}
        {brandTagline && brandTagline.trim() !== '' && (
          <p className="first-visit-loader__tagline">
            {brandTagline}
          </p>
        )}

        {/* Mission Subtitle */}
        {subtitle && subtitle.trim() !== '' && (
          <p className="mt-2 text-xs sm:text-sm text-paper/80 font-sans max-w-sm leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Synchronized Gold Progress Bar */}
        {showProgress && (
          <div className="first-visit-loader__progress" aria-hidden="true">
            <span
              style={{
                animationDuration: `${Math.max(600, displayDuration - 300)}ms`,
              }}
            />
          </div>
        )}

        {/* Loading Status / Progress Label */}
        {statusText && statusText.trim() !== '' && (
          <p className="mt-2.5 text-[11px] font-mono tracking-wide text-paper/75">
            {statusText}
          </p>
        )}

        {/* Government & Port Accreditation Badges */}
        {badgeText && badgeText.trim() !== '' && (
          <div className="mt-4 font-mono text-[10px] uppercase tracking-wider text-paper/50">
            {badgeText}
          </div>
        )}
      </div>
    </div>
  );
}

