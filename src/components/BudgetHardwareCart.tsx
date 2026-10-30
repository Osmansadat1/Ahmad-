import React, { useMemo, useState } from 'react';
import { ShoppingBag, ExternalLink, ShieldCheck } from 'lucide-react';
import { BudgetTier, BUDGET_TIERS } from '../data/config';
import { LEASE_SAFE_PRODUCTS, LeaseSafeProduct, getProductPriceNumber } from '../data/products';

interface BudgetHardwareCartProps {
  roomType: string;
  style: string;
  presets: string[];
}

export const BudgetHardwareCart: React.FC<BudgetHardwareCartProps> = ({
  roomType,
  style,
  presets,
}) => {
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>(150);

  // Filter and curate items according to budget tier
  const curatedItems = useMemo(() => {
    // Score products by relevance to roomType and presets
    const scored = LEASE_SAFE_PRODUCTS.map((prod) => {
      let score = 0;
      if (prod.applicableRooms.some((r) => r.toLowerCase().includes(roomType.toLowerCase()))) {
        score += 3;
      }
      if (presets.includes('90s Honey-Oak Cabinet Wrap') && prod.category === 'kitchen') {
        score += 4;
      }
      if (presets.includes('Hide Carpet with Area Rug') && prod.category === 'flooring') {
        score += 4;
      }
      if (presets.includes('Zero-Drill Lighting') && prod.category === 'lighting') {
        score += 4;
      }
      if (presets.includes('Removable Wallpaper') && prod.category === 'decor') {
        score += 3;
      }
      return { prod, score };
    });

    // Sort by relevance score desc, then price asc
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return getProductPriceNumber(a.prod) - getProductPriceNumber(b.prod);
    });

    // Budget-packed basket
    const selected: LeaseSafeProduct[] = [];
    let currentSum = 0;

    for (const item of scored) {
      const price = getProductPriceNumber(item.prod);
      if (currentSum + price <= selectedBudget) {
        selected.push(item.prod);
        currentSum += price;
      }
    }

    if (selected.length === 0 && scored.length > 0) {
      selected.push(scored[0].prod);
    }

    return selected;
  }, [roomType, presets, selectedBudget]);

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#201A16] rounded-3xl border border-[#E8E2D8] dark:border-[#3A3029] p-5 sm:p-6 transition-all shadow-2xs">
      {/* Header with Budget Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8] dark:border-[#3A3029]">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#C69C6D]" />
            <h4 className="font-serif text-lg font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
              Budget-Locked Hardware Cart
            </h4>
          </div>
          <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6] mt-0.5">
            Curated lease-safe essentials matched to your {roomType} makeover
          </p>
        </div>

        {/* Budget Selector Pills ($50, $150, $300) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F0ECE1] dark:bg-[#1B1613] rounded-full self-start sm:self-auto border border-[#E8E2D8] dark:border-[#3A3029]">
          <span className="text-[10px] uppercase font-bold text-[#7C7267] dark:text-[#B8B2A6] px-2">
            Budget:
          </span>
          {BUDGET_TIERS.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedBudget(tier)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedBudget === tier
                  ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-white dark:text-[#1B1613] shadow-xs'
                  : 'text-[#7C7267] dark:text-[#B8B2A6] hover:text-[#4A3B32] dark:hover:text-white'
              }`}
            >
              ${tier}
            </button>
          ))}
        </div>
      </div>

      {/* Compulsory FTC Disclosure Banner directly above the product list */}
      <div className="my-4 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1B1613] border border-[#E8E2D8] dark:border-[#3A3029] text-[11px] text-[#7C7267] dark:text-[#B8B2A6] leading-relaxed">
        <strong className="text-[#4A3B32] dark:text-[#FAF8F5]">FTC Disclosure:</strong>{' '}
        Eden Canvas earns from qualifying purchases. As an Amazon Associate, Wold Eden earns from qualifying purchases.
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        {curatedItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 bg-white dark:bg-[#1B1613] rounded-2xl border border-[#E8E2D8] dark:border-[#3A3029] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#C69C6D]/80 transition-all shadow-2xs"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  {item.title}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6E7864]/15 text-[#6E7864] dark:text-[#8B9680]">
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#7C7267] dark:text-[#B8B2A6] line-clamp-1">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-xs font-mono font-semibold text-[#6E7864] dark:text-[#C69C6D]">
                {item.priceEstimate || 'Typically under $50'}
              </span>

              <a
                href={item.amazonUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F0ECE1] dark:bg-[#251E19] text-[#4A3B32] dark:text-[#FAF8F5] border border-[#E8E2D8] dark:border-[#3A3029] hover:border-[#C69C6D] transition-colors"
              >
                <span>View on Amazon</span>
                <ExternalLink className="w-3 h-3 text-[#C69C6D]" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Estimated Total Line (Never exact live prices) */}
      <div className="mt-4 pt-3 border-t border-[#E8E2D8] dark:border-[#3A3029] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#6E7864] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>All selections 100% lease-safe & removable</span>
        </div>
        <div className="font-medium text-[#4A3B32] dark:text-[#FAF8F5]">
          Estimated total:{' '}
          <span className="font-bold font-mono text-sm text-[#C69C6D]">
            typically under ${selectedBudget}
          </span>
        </div>
      </div>
    </div>
  );
};
