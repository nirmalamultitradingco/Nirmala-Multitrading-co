/**
 * Favicon Auto-Alignment and Smart Square Framing Engine
 * Transforms any photo, rectangular logo, or graphic into a pixel-perfect,
 * centered, 1:1 square browser favicon (PNG data URI) without distortion or clipping.
 */

export function createAlignedFavicon(imgOrSrc, options = {}) {
  return new Promise((resolve) => {
    if (!imgOrSrc || typeof window === 'undefined') {
      return resolve(typeof imgOrSrc === 'string' ? imgOrSrc : '');
    }

    const {
      fit = 'contain', // 'contain' (auto-fit safe) | 'cover' (fill square)
      shape = 'rounded', // 'rounded' (app squircle) | 'circle' | 'square' | 'none'
      bg = 'transparent', // 'transparent' | '#16382b' | '#ffffff' | custom hex
      padding = 10, // 0 - 35% safe margin
      scale = 100, // 40 - 200% zoom
      offsetX = 0, // nudge X in %
      offsetY = 0, // nudge Y in %
      size = 128, // 128x128 for crystal clear Retina & high-DPI displays
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(typeof imgOrSrc === 'string' ? imgOrSrc : '');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      ctx.clearRect(0, 0, size, size);

      // 1. Setup Shape Mask & Clipping Path
      ctx.save();
      const r = size * 0.22; // modern squircle radius
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      } else if (shape === 'rounded') {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(0, 0, size, size, r);
        } else {
          ctx.rect(0, 0, size, size);
        }
        ctx.closePath();
        ctx.clip();
      }

      // 2. Background Fill
      if (bg && bg !== 'transparent') {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);
      }

      // 3. Aspect-Ratio Preserving Math & Centering
      const padFactor = Math.max(0, Math.min(40, Number(padding) || 0)) / 100;
      const zoomFactor = Math.max(20, Math.min(250, Number(scale) || 100)) / 100;
      const innerSize = size * (1 - padFactor * 2) * zoomFactor;

      const imgW = img.naturalWidth || img.width || size;
      const imgH = img.naturalHeight || img.height || size;

      let drawW, drawH;
      if (fit === 'cover') {
        const ratio = Math.max(innerSize / imgW, innerSize / imgH);
        drawW = imgW * ratio;
        drawH = imgH * ratio;
      } else {
        // 'contain' (default) - fits completely inside safe zone, never squished
        const ratio = Math.min(innerSize / imgW, innerSize / imgH);
        drawW = imgW * ratio;
        drawH = imgH * ratio;
      }

      // Precision center coordinates with user offset nudging
      const offX = ((Number(offsetX) || 0) / 100) * size;
      const offY = ((Number(offsetY) || 0) / 100) * size;
      const drawX = (size - drawW) / 2 + offX;
      const drawY = (size - drawH) / 2 + offY;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the centered, scaled photo
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 4. Subtle Luxury Border Rim for framed icons
      if (bg && bg !== 'transparent' && shape !== 'none') {
        ctx.strokeStyle = 'rgba(218, 165, 32, 0.45)'; // elegant gold rim
        ctx.lineWidth = 1.5;
        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2 - 0.75, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shape === 'rounded') {
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(0.75, 0.75, size - 1.5, size - 1.5, r);
          } else {
            ctx.rect(0.75, 0.75, size - 1.5, size - 1.5);
          }
          ctx.stroke();
        }
      }

      ctx.restore();

      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (_) {
        resolve(typeof imgOrSrc === 'string' ? imgOrSrc : '');
      }
    };

    let retriedWithoutCors = false;
    img.onerror = () => {
      if (!retriedWithoutCors && img.crossOrigin) {
        retriedWithoutCors = true;
        try {
          img.removeAttribute('crossorigin');
        } catch (_) {}
        img.crossOrigin = null;
        img.src = typeof imgOrSrc === 'string' ? imgOrSrc : (imgOrSrc?.src || '');
        return;
      }
      // Gracefully resolve with original source without alarming console warnings
      resolve(typeof imgOrSrc === 'string' ? imgOrSrc : '');
    };

    if (typeof imgOrSrc === 'string') {
      img.src = imgOrSrc;
    } else if (imgOrSrc instanceof HTMLImageElement) {
      img.src = imgOrSrc.src;
    } else {
      resolve('');
    }
  });
}
