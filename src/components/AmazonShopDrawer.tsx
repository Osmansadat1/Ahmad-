import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Info, ShoppingBag, X } from 'lucide-react';
import {
  SHOP_PRODUCTS,
  ShopPriceTier,
  ShopProduct,
  buildAmazonAffiliateUrl,
  trackEvent,
} from '../data/config';

interface AmazonShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmazonShopDrawer: React.FC<AmazonShopDrawerProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<ShopPriceTier>('all');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle native escape & click backdrop
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const filteredProducts = SHOP_PRODUCTS.filter((product) => {
    if (activeFilter === 'all') return true;
    return product.tier === activeFilter;
  });

  const handleProductClick = (product: ShopProduct) => {
    trackEvent('purchase_click', {
      productId: product.id,
      productName: product.name,
      tier: product.tier,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      onClose={onClose}
      className="backdrop:bg-[#4A3B32]/60 dark:backdrop:bg-black/75 fixed inset-y-0 right-0 z-50 m-0 ml-auto h-full max-h-none w-full max-w-md bg-[#FAF8F5] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] p-0 shadow-2xl border-l border-[#E8E2D8] dark:border-[#3A3029] focus:outline-none overflow-hidden"
      aria-labelledby="shop-drawer-title"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E8E2D8] dark:border-[#3A3029] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F0ECE1] dark:bg-[#251E19] text-[#C69C6D] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 id="shop-drawer-title" className="font-serif text-xl font-bold tracking-tight">
                Damage-free picks
              </h2>
              <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6]">
                Curated lease-safe essentials for your apartment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#7C7267] dark:text-[#B8B2A6] hover:bg-[#F0ECE1] dark:hover:bg-[#251E19] transition-colors cursor-pointer"
            aria-label="Close shop drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FTC Mandatory Affiliate Disclosure Banner */}
        <div className="px-6 py-3.5 bg-[#F0ECE1]/80 dark:bg-[#251E19]/80 border-b border-[#E8E2D8] dark:border-[#3A3029] flex items-start gap-2.5 text-xs text-[#7C7267] dark:text-[#B8B2A6]">
          <Info className="w-4 h-4 text-[#C69C6D] shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>FTC Disclosure:</strong> Eden Canvas earns from qualifying purchases. As an Amazon Associate, Wold Eden earns from qualifying purchases.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="px-6 py-3 border-b border-[#E8E2D8] dark:border-[#3A3029] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613]'
                : 'bg-[#F0ECE1] dark:bg-[#251E19] text-[#7C7267] dark:text-[#B8B2A6] hover:bg-[#E8E2D8]'
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('under-50')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'under-50'
                ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613]'
                : 'bg-[#F0ECE1] dark:bg-[#251E19] text-[#7C7267] dark:text-[#B8B2A6] hover:bg-[#E8E2D8]'
            }`}
          >
            Under $50
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('under-150')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'under-150'
                ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613]'
                : 'bg-[#F0ECE1] dark:bg-[#251E19] text-[#7C7267] dark:text-[#B8B2A6] hover:bg-[#E8E2D8]'
            }`}
          >
            Under $150
          </button>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredProducts.map((product) => {
            const affiliateUrl = buildAmazonAffiliateUrl(product);
            return (
              <a
                key={product.id}
                href={affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => handleProductClick(product)}
                className="group block bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] rounded-2xl p-4 shadow-2xs hover:border-[#C69C6D] dark:hover:border-[#C69C6D] transition-all cursor-pointer"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F0ECE1] dark:bg-[#1E1814] shrink-0 border border-[#E8E2D8] dark:border-[#3A3029]">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      width={400}
                      height={400}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#4A3B32] dark:text-[#FAF8F5] truncate group-hover:text-[#C69C6D] transition-colors">
                        {product.name}
                      </h3>
                      <ExternalLink className="w-3.5 h-3.5 text-[#7C7267] dark:text-[#B8B2A6] shrink-0" />
                    </div>
                    <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6] line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#C69C6D] px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#1B1613] border border-[#E8E2D8] dark:border-[#3A3029]">
                        {product.priceEstimate}
                      </span>
                      <span className="text-xs font-semibold text-[#4A3B32] dark:text-[#C69C6D] group-hover:underline">
                        View on Amazon →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-[#E8E2D8] dark:border-[#3A3029] bg-[#FAF8F5] dark:bg-[#1B1613] text-center text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
          Direct Amazon search results · 100% verified lease-safe products
        </div>
      </div>
    </dialog>
  );
};
