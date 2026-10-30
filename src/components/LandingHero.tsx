import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface LandingHeroProps {
  onLaunchStudio: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchStudio }) => {
  return (
    <section className="relative bg-[#FAF8F5] dark:bg-[#1B1613] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E2D8] dark:border-[#3A3029] overflow-hidden text-[#4A3B32] dark:text-[#FAF8F5] transition-colors">
      {/* Background radial soft aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,#F0ECE1_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,#251E19_0%,transparent_70%)] pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & High-Converting Pitch */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Floating Trust Pill */}
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/90 dark:bg-[#251E19]/90 border border-[#E8E2D8] dark:border-[#3A3029] backdrop-blur-sm text-xs font-medium text-[#4A3B32] dark:text-[#FAF8F5] shadow-2xs">
                <span className="text-[#C69C6D] font-bold">★</span>
                <span>Trusted by 250,000+ thoughtful renters across the US</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#4A3B32] dark:text-[#FAF8F5] tracking-tight leading-[1.12]">
              Transform Your Rental Without Risking Your Security Deposit
            </h1>

            <p className="text-base sm:text-lg text-[#7C7267] dark:text-[#B8B2A6] leading-relaxed max-w-xl mx-auto lg:mx-0">
              AI-powered, 100% damage-free interior design tailored for renters. Conceal ugly finishes, divide tight studios, and upgrade your home without drilling a single hole.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-medium text-[#5C4C41] dark:text-[#D5CFC7] max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6E7864] shrink-0" />
                <span>Zero drilling, nails, or hardwiring</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6E7864] shrink-0" />
                <span>Keep &amp; style your existing furniture</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6E7864] shrink-0" />
                <span>Damage-free tension &amp; removable wraps</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6E7864] shrink-0" />
                <span>Shoppable lease-safe hardware links</span>
              </div>
            </div>

            {/* Primary Action Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={onLaunchStudio}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] text-sm sm:text-base font-semibold hover:bg-[#382C24] dark:hover:bg-[#B88E5F] active:scale-98 transition-all shadow-md hover:shadow-lg cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#C69C6D] dark:text-[#1B1613]" />
                <span>Design Your Room Free (1 Free Render)</span>
                <ArrowRight className="w-4 h-4 text-[#C69C6D] dark:text-[#1B1613] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-[#7C7267] dark:text-[#B8B2A6] pt-1">
              <span>Includes 1 free high-res makeover. No credit card required.</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Split Screen Before/After */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-[#251E19] rounded-3xl p-3 sm:p-4 border border-[#E8E2D8] dark:border-[#3A3029] shadow-sm">
              <div className="flex items-center justify-between px-2 py-1.5 mb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#4A3B32] dark:text-[#FAF8F5]">
                    Dated 90s Rental Kitchen
                  </span>
                  <span className="text-[#8C7D73]">·</span>
                  <span className="text-[#6E7864] dark:text-[#C69C6D] font-semibold">Organic Modern</span>
                </div>
                <span className="text-[11px] font-medium bg-[#F0ECE1] dark:bg-[#1B1613] text-[#6E7864] dark:text-[#C69C6D] px-2.5 py-0.5 rounded-full border border-[#E8E2D8] dark:border-[#3A3029]">
                  100% Lease-Safe
                </span>
              </div>

              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80"
                afterImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85"
                beforeLabel="Original Rental Kitchen"
                afterLabel="Eden Canvas Concept"
                beforeAlt="Dated honey-oak rental kitchen before makeover"
                afterAlt="Damage-free organic modern kitchen makeover"
              />

              <div className="mt-3 px-2 flex items-center justify-between text-xs text-[#7C7267] dark:text-[#B8B2A6]">
                <span className="italic text-[11px]">
                  Removable matte cabinet film, peel-and-stick marble tiles, zero demolition.
                </span>
                <button
                  type="button"
                  onClick={onLaunchStudio}
                  className="font-semibold text-[#4A3B32] dark:text-[#FAF8F5] hover:text-[#C69C6D] transition-colors shrink-0 cursor-pointer ml-2"
                >
                  Try this look →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
