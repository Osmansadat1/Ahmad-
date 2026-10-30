import React, { useId, useState } from 'react';

export interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt?: string;
  afterAlt?: string;
  isDemoConcept?: boolean;
  styleName?: string;
  roomTypeName?: string;
  compact?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'Demo concept',
  beforeAlt = 'Original room before makeover',
  afterAlt = 'Damage-free redesign concept',
  fetchPriority,
  className = '',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const sliderId = useId();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div
      className={`relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden select-none bg-[#F0ECE1] dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] ${className}`}
      style={{
        ['--slider-pos' as string]: `${sliderPos}%`,
      }}
    >
      {/* 1. AFTER Image (Base Layer) */}
      <img
        src={afterImage}
        alt={afterAlt}
        width={1400}
        height={900}
        loading={fetchPriority === 'high' ? undefined : 'lazy'}
        fetchPriority={fetchPriority}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 2. BEFORE Image (Clipped Overlay Layer) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, var(--slider-pos) 0, var(--slider-pos) 100%, 0 100%)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          width={1400}
          height={900}
          loading={fetchPriority === 'high' ? undefined : 'lazy'}
          fetchPriority={fetchPriority}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* 3. Divider Line & Handle Indicator */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[#FAF8F5] pointer-events-none z-10 shadow-sm"
        style={{ left: 'var(--slider-pos)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-[#1B1613] border-2 border-[#4A3B32] dark:border-[#C69C6D] shadow-md flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#4A3B32] dark:text-[#C69C6D]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 3 12 9 6" />
          </svg>
        </div>
      </div>

      {/* 4. Tag Labels (Editorial Pill Badges) */}
      <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#4A3B32]/85 dark:bg-[#1B1613]/90 text-[#FAF8F5] border border-white/20 shadow-xs">
          {beforeLabel}
        </span>
      </div>

      <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#FAF8F5]/90 dark:bg-[#251E19]/90 text-[#4A3B32] dark:text-[#FAF8F5] border border-[#E8E2D8] dark:border-[#3A3029] shadow-xs">
          {afterLabel}
        </span>
      </div>

      {/* 5. Invisible Full-Size Range Input (Touch, Mouse, and Keyboard accessible) */}
      <label htmlFor={sliderId} className="sr-only">
        Compare Before and After photos (use left and right arrows to adjust)
      </label>
      <input
        id={sliderId}
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={handleSliderChange}
        aria-label="Before and after image comparison slider"
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0 p-0 focus:outline-none"
      />
    </div>
  );
};
