import React from 'react';
import { ArrowRight, Coins } from 'lucide-react';

export type AppView = 'landing' | 'studio';

interface NavbarProps {
  currentView: AppView;
  credits?: number;
  onLogoClick: () => void;
  onTryFreeClick: () => void;
  onCreditClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  credits = 1,
  onLogoClick,
  onTryFreeClick,
  onCreditClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#1B1613]/95 backdrop-blur-md border-b border-[#E8E2D8] dark:border-[#3A3029] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Brand wordmark "Eden Canvas" with an editorial subtitle "by Wold Eden" */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none text-left cursor-pointer shrink-0"
          aria-label="Eden Canvas by Wold Eden Home"
        >
          <span className="font-serif text-2xl sm:text-2xl font-bold tracking-tight text-[#4A3B32] dark:text-[#FAF8F5]">
            Eden Canvas
          </span>
          <span className="hidden sm:inline-block font-serif text-xs italic text-[#7C7267] dark:text-[#B8B2A6] border-l border-[#E8E2D8] dark:border-[#3A3029] pl-3 py-0.5">
            by Wold Eden
          </span>
        </button>

        {/* Right Navigation */}
        <div className="flex items-center gap-3">
          {currentView === 'studio' ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onLogoClick}
                className="text-xs sm:text-sm font-medium text-[#7C7267] dark:text-[#B8B2A6] hover:text-[#4A3B32] dark:hover:text-[#FAF8F5] px-2 py-1.5 transition-colors cursor-pointer"
              >
                ← Back to Overview
              </button>

              <button
                type="button"
                onClick={onCreditClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] text-xs font-semibold text-[#4A3B32] dark:text-[#FAF8F5] hover:border-[#C69C6D] transition-all shadow-2xs cursor-pointer group"
                title="View & recharge credits"
              >
                <Coins className="w-3.5 h-3.5 text-[#C69C6D] group-hover:scale-110 transition-transform" />
                <span>
                  {credits} Free Makeover{credits === 1 ? '' : 's'} Remaining
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onTryFreeClick}
              className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] text-xs sm:text-sm font-semibold hover:bg-[#382C24] dark:hover:bg-[#B88E5F] active:scale-98 transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
            >
              <span>Try Free (1 Room Makeover)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C69C6D] dark:text-[#1B1613]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
