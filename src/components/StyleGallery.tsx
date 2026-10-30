import React, { useEffect, useRef, useState } from 'react';
import { GALLERY_STYLES } from '../data/config';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StyleGalleryProps {
  onSelectStyle?: (styleName: string) => void;
}

export const StyleGallery: React.FC<StyleGalleryProps> = ({ onSelectStyle }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Double the items for a seamless loop
  const displayItems = [...GALLERY_STYLES, ...GALLERY_STYLES];

  // Pause on user interaction and schedule resume after 2s idle
  const handleUserInteract = () => {
    isPausedRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 2000);
  };

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 1500);
  };

  // IntersectionObserver to ensure RAF runs ONLY when visible on screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Smooth RAF scrolling loop (~40px/sec)
  useEffect(() => {
    if (prefersReducedMotion || !isVisible) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    let lastTimestamp = performance.now();
    const speedPixelsPerSecond = 40;

    const step = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      const el = containerRef.current;
      if (el && !isPausedRef.current) {
        el.scrollLeft += speedPixelsPerSecond * delta;
        // Loop back seamlessly when halfway scrolled through cloned items
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(step);
    };

    animFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [isVisible, prefersReducedMotion]);

  return (
    <section
      id="styles"
      className="w-full py-16 sm:py-24 bg-[#FAF8F5] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] border-b border-[#E8E2D8] dark:border-[#3A3029] overflow-hidden transition-colors"
      style={{ contentVisibility: 'auto' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C69C6D] font-semibold">
            Curated Rental Aesthetics
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#4A3B32] dark:text-[#FAF8F5] mt-1.5">
            Six interior styles. One room that's yours.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#7C7267] dark:text-[#B8B2A6] max-w-sm">
          Swipe or hover to pause. Every aesthetic is adapted with damage-free, plug-in furnishings.
        </p>
      </div>

      {/* Auto-scrolling horizontal rail */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleUserInteract}
        onTouchMove={handleUserInteract}
        onFocusCapture={handleUserInteract}
        className="flex gap-6 overflow-x-auto no-scrollbar px-4 sm:px-8 py-2 select-none cursor-grab active:cursor-grabbing scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        tabIndex={0}
        aria-label="Style gallery carousel"
      >
        {displayItems.map((style, idx) => (
          <div
            key={`${style.id}-${idx}`}
            onClick={() => onSelectStyle?.(style.name)}
            className="group relative shrink-0 w-72 sm:w-80 bg-white dark:bg-[#251E19] rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-[#3A3029] shadow-2xs hover:border-[#C69C6D] transition-all cursor-pointer"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F0ECE1] dark:bg-[#1E1814]">
              <img
                src={style.photoUrl}
                alt={`${style.name} interior style`}
                width={800}
                height={600}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5]/90 dark:bg-[#1B1613]/90 text-[#4A3B32] dark:text-[#FAF8F5] border border-white/20 shadow-2xs">
                  {style.name}
                </span>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  {style.name}
                </h3>
                <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6] mt-0.5">
                  {style.subtitle}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F0ECE1] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#C69C6D] flex items-center justify-center group-hover:bg-[#4A3B32] group-hover:text-[#FAF8F5] dark:group-hover:bg-[#C69C6D] dark:group-hover:text-[#1B1613] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
