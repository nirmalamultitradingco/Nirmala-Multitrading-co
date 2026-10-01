import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard.jsx';

export default function FeaturedProductsSlider({ products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const touchStartX = useRef(null);

  // Dynamically calculate visible cards based on screen size with proper spacious proportions
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 768) setVisibleCount(2);
      else if (w < 1150) setVisibleCount(3);
      else setVisibleCount(4);
    };

    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  // Ensure there are enough items to slide across even if database only has 2-4 products
  const displayProducts =
    products.length > 1 && products.length <= visibleCount
      ? [...products, ...products, ...products]
      : products;

  const total = displayProducts.length;
  const maxIndex = Math.max(0, total - visibleCount);

  // Reset index if screen resized or maxIndex changed
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [maxIndex, currentIndex]);

  // Auto rotation effect: smoothly rotates every 3.2 seconds
  useEffect(() => {
    if (total <= 1 || maxIndex <= 0 || isHovered) return undefined;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3200);

    return () => clearInterval(timer);
  }, [total, maxIndex, isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  if (!products.length) return null;

  const cardWidthPercent = 100 / visibleCount;

  return (
    <div
      className="relative mt-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Carousel Window with generous padding for shadows */}
      <div className="overflow-hidden rounded-2xl py-3 px-1">
        <div
          className="flex items-stretch transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
          }}
        >
          {displayProducts.map((product, idx) => (
            <div
              key={`${product._id || product.slug || 'fp'}-${idx}`}
              className="shrink-0 px-3 flex flex-col transition-all duration-300"
              style={{ width: `${cardWidthPercent}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (visible if items can rotate) */}
      {products.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous product"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-lg backdrop-blur transition hover:border-gold hover:bg-forest hover:text-white"
          >
            <span className="text-xl leading-none select-none">‹</span>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next product"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-lg backdrop-blur transition hover:border-gold hover:bg-forest hover:text-white"
          >
            <span className="text-xl leading-none select-none">›</span>
          </button>
        </>
      )}

      {/* Slide Indicator Dots */}
      {products.length > 1 && (
        <div className="mt-7 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(products.length, 8) }).map((_, idx) => {
            const activeDot = (currentIndex % Math.min(products.length, 8)) === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeDot
                    ? 'w-8 bg-forest shadow-sm'
                    : 'w-2 bg-ink/20 hover:bg-ink/40'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
