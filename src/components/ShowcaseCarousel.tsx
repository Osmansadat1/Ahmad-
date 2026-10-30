import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export interface ShowcaseItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  style: string;
  roomType: string;
  beforeUrl: string;
  afterUrl: string;
  highlights: string[];
}

interface ShowcaseCarouselProps {
  items: ShowcaseItem[];
  onTryRoom: (id: string) => void;
}

const SLIDE_MS = 8000;

export const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ items, onTryRoom }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within current slide
  const [manualPos, setManualPos] = useState<number | null>(null); // set while dragging
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const modalStageRef = useRef<HTMLDivElement | null>(null);
  const elapsedRef = useRef(0);
  const draggingRef = useRef(false);

  // Compute available categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => set.add(item.roomType));
    return ['All', ...Array.from(set)];
  }, [items]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter((item) => item.roomType === activeCategory);
  }, [items, activeCategory]);

  const count = filteredItems.length;
  const paused = userPaused || hovering || manualPos !== null || reducedMotion || isFullscreen;

  // Prefers reduced motion check
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Reset index when category changes
  useEffect(() => {
    setIndex(0);
    setProgress(0);
    setManualPos(null);
    elapsedRef.current = 0;
  }, [activeCategory]);

  const goTo = useCallback(
    (next: number) => {
      elapsedRef.current = 0;
      setProgress(0);
      setManualPos(null);
      if (count > 0) {
        setIndex(((next % count) + count) % count);
      }
    },
    [count]
  );

  // Autoplay loop: the reveal line sweeps across smoothly, then advances to next slide
  useEffect(() => {
    if (paused || count < 2) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsedRef.current += now - last;
      last = now;
      if (elapsedRef.current >= SLIDE_MS) {
        elapsedRef.current = 0;
        setProgress(0);
        setIndex((i) => (i + 1) % count);
      } else {
        setProgress(elapsedRef.current / SLIDE_MS);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, count]);

  // 10% -> 90% -> 10% sweep over one slide cycle
  const autoPos = reducedMotion ? 50 : 50 - 40 * Math.cos(progress * Math.PI * 2);
  const pos = manualPos ?? autoPos;

  const posFromClientX = (clientX: number, targetRef: React.RefObject<HTMLDivElement | null>) => {
    const rect = targetRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return 50;
    return Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, isModal: boolean = false) => {
    draggingRef.current = true;
    setManualPos(posFromClientX(e.clientX, isModal ? modalStageRef : stageRef));
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>, isModal: boolean = false) => {
    if (draggingRef.current) {
      setManualPos(posFromClientX(e.clientX, isModal ? modalStageRef : stageRef));
    }
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
  };

  if (count === 0) return null;
  const active = filteredItems[index] || filteredItems[0];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Before and after rental room makeovers"
      onKeyDown={onKeyDown}
      className="space-y-6"
    >
      {/* Category Filter Pills & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            const countForCat =
              cat === 'All' ? items.length : items.filter((it) => it.roomType === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F4D3D] text-[#FFFFFF] shadow-sm ring-2 ring-[#1F4D3D]/20'
                    : 'bg-[#FFFFFF] text-[#4B554D] hover:text-[#1C2420] hover:bg-[#FAF7F2] border border-[#E8E1D6]'
                }`}
              >
                {cat} <span className="opacity-75 ml-0.5">({countForCat})</span>
              </button>
            );
          })}
        </div>

        {/* Fullscreen presentation button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="View slideshow in fullscreen presentation"
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E8E1D6] text-[#4B554D] hover:text-[#1F4D3D] hover:border-[#1F4D3D]/30 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Open fullscreen presentation"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Stage + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* STAGE CONTAINER - INTERACTIVE BEFORE/AFTER SLIDER */}
        <div className="lg:col-span-8">
          <div
            ref={stageRef}
            tabIndex={0}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => {
              setHovering(false);
              setManualPos(null);
            }}
            onPointerDown={(e) => onPointerDown(e, false)}
            onPointerMove={(e) => onPointerMove(e, false)}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-[#1C2420] border border-[#E8E1D6] shadow-[0_24px_60px_-28px_rgba(31,77,61,0.35)] select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D9E7DC] cursor-ew-resize touch-pan-y"
          >
            {/* Active transformation pair */}
            <div key={active.id} className="absolute inset-0">
              <img
                src={active.afterUrl}
                alt={`${active.title} — After transformation`}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <img
                src={active.beforeUrl}
                alt={`${active.title} — Before transformation`}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              />
            </div>

            {/* Badges */}
            <span
              className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#1C2420]/80 backdrop-blur-md text-[#FFFFFF] text-xs font-semibold transition-opacity duration-200 pointer-events-none shadow-md ${
                pos < 12 ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Before
            </span>
            <span
              className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#1F4D3D]/90 backdrop-blur-md text-[#FFFFFF] text-xs font-semibold transition-opacity duration-200 pointer-events-none shadow-md ${
                pos > 88 ? 'opacity-0' : 'opacity-100'
              }`}
            >
              After
            </span>

            {/* Divider Line + Circular Drag Handle */}
            <div
              className="absolute inset-y-0 w-0.5 bg-[#FFFFFF] shadow-[0_0_14px_rgba(0,0,0,0.5)] pointer-events-none"
              style={{ left: `${pos}%` }}
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFFFFF] shadow-xl flex items-center justify-center text-[#1F4D3D] ring-4 ring-[#1F4D3D]/25">
                <ArrowLeft className="w-3.5 h-3.5" />
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Bottom info pill & quick comparison presets */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF]/95 backdrop-blur-md text-[11px] font-medium text-[#1C2420] shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#C2623F]" />
                Drag slider or use arrow keys
              </span>

              {/* Quick Jump Buttons: Before / 50-50 / After */}
              <div className="pointer-events-auto hidden sm:flex items-center gap-1 p-1 rounded-full bg-[#1C2420]/75 backdrop-blur-md text-[11px] text-[#FFFFFF] shadow-md">
                <button
                  type="button"
                  onClick={() => setManualPos(97)}
                  className="px-2.5 py-0.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Before
                </button>
                <button
                  type="button"
                  onClick={() => setManualPos(50)}
                  className="px-2.5 py-0.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer font-medium"
                >
                  50/50
                </button>
                <button
                  type="button"
                  onClick={() => setManualPos(3)}
                  className="px-2.5 py-0.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                >
                  After
                </button>
              </div>
            </div>

            {/* Arrows */}
            <button
              type="button"
              aria-label="Previous room makeover"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#1C2420] shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 hidden sm:flex"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next room makeover"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#1C2420] shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 hidden sm:flex"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div key={active.id} aria-live="polite">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#D9E7DC] text-[#1F4D3D] text-xs font-bold tracking-wide">
                {active.badge}
              </span>
              <span className="text-xs font-bold text-[#C2623F] uppercase tracking-wider">
                {active.style}
              </span>
            </div>

            <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-[#1C2420] tracking-tight">
              {active.title}
            </h3>

            <p className="mt-1 text-xs font-semibold text-[#667067] uppercase tracking-wider">
              {active.roomType} · 100% Lease-Compliant
            </p>

            <p className="mt-3.5 text-sm text-[#3F4841] leading-relaxed">
              {active.description}
            </p>

            <div className="mt-5 space-y-2.5">
              <span className="text-xs font-bold text-[#1C2420] uppercase tracking-wider block">
                Rental-Friendly Redesign Features:
              </span>
              <ul className="space-y-2">
                {active.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-[#1C2420]">
                    <CheckCircle2 className="w-4 h-4 text-[#1F4D3D] shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onTryRoom(active.id)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1F4D3D] text-[#FFFFFF] text-sm font-semibold hover:bg-[#153A2E] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Try this room concept free <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide selector with thumbnail grid & controls */}
          <div className="pt-4 border-t border-[#E8E1D6]">
            <div className="flex items-center justify-end mb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManualPos(null)}
                  title="Reset reveal slider"
                  className="p-1 rounded-md text-[#667067] hover:text-[#1C2420] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                {!reducedMotion && (
                  <button
                    type="button"
                    onClick={() => setUserPaused((p) => !p)}
                    aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B554D] hover:text-[#1C2420] cursor-pointer px-2 py-0.5 rounded-md hover:bg-[#FAF7F2] transition-colors"
                  >
                    {userPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    {userPaused ? 'Play' : 'Pause'}
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail navigation items with preview & badge */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {filteredItems.map((item, i) => {
                const isCurrent = i === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show ${item.title}`}
                    aria-current={isCurrent}
                    className={`group relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer text-left ${
                      isCurrent
                        ? 'border-[#1F4D3D] shadow-md ring-2 ring-[#1F4D3D]/25'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:border-[#1F4D3D]/40'
                    }`}
                  >
                    <img
                      src={item.afterUrl}
                      alt=""
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-1.5">
                      <span className="text-[10px] font-bold text-[#FFFFFF] truncate drop-shadow-xs">
                        {item.roomType}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="absolute inset-x-0 bottom-0 h-1 bg-[#FFFFFF]/40">
                        <span
                          className="block h-full bg-[#C2623F]"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal Lightbox - Interactive Slider */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen room slideshow presentation"
          className="fixed inset-0 z-50 bg-[#1C2420]/95 backdrop-blur-md flex flex-col p-4 sm:p-6 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C2623F]">
                {active.badge} · {active.roomType}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-white mt-0.5">
                {active.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen view"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content: Fullscreen Interactive Before/After Slider */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0">
            <div
              ref={modalStageRef}
              onPointerDown={(e) => onPointerDown(e, true)}
              onPointerMove={(e) => onPointerMove(e, true)}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative w-full max-w-5xl aspect-[16/10] rounded-2xl overflow-hidden bg-black/50 border border-white/15 select-none cursor-ew-resize shadow-2xl"
            >
              <img
                src={active.afterUrl}
                alt={`${active.title} — After`}
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain"
              />
              <img
                src={active.beforeUrl}
                alt={`${active.title} — Before`}
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              />

              {/* Badges in modal */}
              <span
                className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#1C2420]/80 backdrop-blur-md text-xs font-bold text-white shadow-md ${
                  pos < 12 ? 'opacity-0' : 'opacity-100'
                }`}
              >
                Before
              </span>
              <span
                className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#1F4D3D]/95 backdrop-blur-md text-xs font-bold text-white shadow-md ${
                  pos > 88 ? 'opacity-0' : 'opacity-100'
                }`}
              >
                After
              </span>

              {/* Divider in modal */}
              <div
                className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_14px_rgba(0,0,0,0.6)] pointer-events-none"
                style={{ left: `${pos}%` }}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1F4D3D] ring-4 ring-[#1F4D3D]/30">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-2 overflow-x-auto max-w-[50vw] py-1">
              {filteredItems.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    i === index ? 'bg-[#C2623F] scale-125 ring-2 ring-white/50' : 'bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}: ${item.title}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
