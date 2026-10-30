import React, { useState } from 'react';
import { Menu, ShoppingBag, Sparkles, X } from 'lucide-react';

interface HeaderProps {
  onTryFreeClick: () => void;
  onOpenShopDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTryFreeClick,
  onOpenShopDrawer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 dark:bg-[#1B1613]/90 border-b border-[#E8E2D8] dark:border-[#3A3029] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69C6D] rounded-lg"
        >
          <span className="font-serif text-2xl sm:text-2xl font-bold tracking-tight text-[#4A3B32] dark:text-[#FAF8F5]">
            Eden Canvas
          </span>
          <span className="hidden sm:inline-block font-serif text-xs italic text-[#7C7267] dark:text-[#B8B2A6] border-l border-[#E8E2D8] dark:border-[#3A3029] pl-2 py-0.5">
            by Wold Eden
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#7C7267] dark:text-[#B8B2A6]">
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-[#4A3B32] dark:hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('styles')}
            className="hover:text-[#4A3B32] dark:hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            Styles
          </button>
          <button
            type="button"
            onClick={() => scrollTo('pricing')}
            className="hover:text-[#4A3B32] dark:hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={onOpenShopDrawer}
            className="hover:text-[#4A3B32] dark:hover:text-[#FAF8F5] transition-colors flex items-center gap-1.5 cursor-pointer text-[#C69C6D] font-semibold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop</span>
          </button>
        </nav>

        {/* Action Button: Try it free */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTryFreeClick}
            className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] text-xs sm:text-sm font-semibold hover:bg-[#382C24] dark:hover:bg-[#B88E5F] active:scale-98 transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69C6D]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try it free</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#4A3B32] dark:text-[#FAF8F5] hover:bg-[#F0ECE1] dark:hover:bg-[#251E19] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E2D8] dark:border-[#3A3029] bg-[#FAF8F5] dark:bg-[#1B1613] px-4 pt-3 pb-6 space-y-3">
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="block w-full text-left py-2 text-sm font-medium text-[#4A3B32] dark:text-[#FAF8F5]"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('styles')}
            className="block w-full text-left py-2 text-sm font-medium text-[#4A3B32] dark:text-[#FAF8F5]"
          >
            Styles
          </button>
          <button
            type="button"
            onClick={() => scrollTo('pricing')}
            className="block w-full text-left py-2 text-sm font-medium text-[#4A3B32] dark:text-[#FAF8F5]"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenShopDrawer();
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#C69C6D] flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Damage-free picks (Shop)</span>
          </button>
        </div>
      )}
    </header>
  );
};
