import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface HeroProps {
  onTryFreeClick: () => void;
  onSeePricingClick: () => void;
  userBeforeImage?: string;
  hasCustomUpload?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onTryFreeClick,
  onSeePricingClick,
  userBeforeImage,
  hasCustomUpload = false,
}) => {
  const defaultBefore = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85';
  const defaultAfter = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85';

  const beforePhoto = userBeforeImage || defaultBefore;
  const beforeLabel = hasCustomUpload ? 'Your Room' : 'Before';
  const afterLabel = hasCustomUpload ? 'Sample makeover' : 'Demo concept';

  return (
    <section className="relative w-full pt-8 pb-14 sm:pt-14 sm:pb-20 bg-[#FAF8F5] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] transition-colors border-b border-[#E8E2D8] dark:border-[#3A3029]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Trust badge pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0ECE1] dark:bg-[#251E19] text-[#6E7864] dark:text-[#C69C6D] border border-[#E8E2D8] dark:border-[#3A3029] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#C69C6D]" />
              <span>100% Lease-Safe · Zero Wall Penetrations</span>
            </div>

            {/* H1 Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#4A3B32] dark:text-[#FAF8F5] leading-[1.12]">
              Make your rental feel like home.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#7C7267] dark:text-[#B8B2A6] leading-relaxed max-w-xl mx-auto lg:mx-0">
              See a room that fits your style, your budget, and your lease before you buy a thing.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onTryFreeClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] text-sm sm:text-base font-semibold hover:bg-[#382C24] dark:hover:bg-[#B88E5F] active:scale-98 transition-all shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69C6D]"
              >
                <Sparkles className="w-4 h-4 text-[#C69C6D] dark:text-[#1B1613]" />
                <span>Try it free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onSeePricingClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#FAF8F5] dark:bg-[#251E19] text-[#4A3B32] dark:text-[#FAF8F5] border border-[#E8E2D8] dark:border-[#3A3029] text-sm sm:text-base font-semibold hover:bg-[#F0ECE1] dark:hover:bg-[#2F2721] transition-all shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69C6D]"
              >
                See pricing
              </button>
            </div>

            {/* Note */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-[#7C7267] dark:text-[#B8B2A6] pt-1">
              <CheckCircle2 className="w-4 h-4 text-[#6E7864] dark:text-[#8B9680]" />
              <span>Includes 3 free credits. No card needed.</span>
            </div>
          </div>

          {/* Right Column: Flat Touch-and-Drag Before/After Slider */}
          <div className="lg:col-span-6">
            <div className="relative p-2 sm:p-3 bg-white dark:bg-[#251E19] rounded-3xl border border-[#E8E2D8] dark:border-[#3A3029] shadow-sm">
              <BeforeAfterSlider
                beforeImage={beforePhoto}
                afterImage={defaultAfter}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                beforeAlt="Rental room original state"
                afterAlt="Eden Canvas damage-free redesign preview"
                fetchPriority="high"
              />
              <p className="mt-2.5 text-center text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
                Drag the divider or use arrow keys to inspect the lease-safe transformation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
