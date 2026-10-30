import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';
import {
  AMAZON_AFFILIATE_TAG,
  LEASE_SAFE_PRODUCTS,
  LeaseSafeProduct,
  packProductsForBudget,
} from '../data/products';

export interface ShoppableDrawerProps {
  activeRoom?: string;
  className?: string;
}

const BUDGET_CHIPS = [50, 100, 150, 200];

export const ShoppableDrawer: React.FC<ShoppableDrawerProps> = ({
  activeRoom = 'Living Room',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [budgetInput, setBudgetInput] = useState<number>(150);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Filter products for the active room
  const roomProducts = useMemo(() => {
    return LEASE_SAFE_PRODUCTS.filter((product) =>
      product.applicableRooms.some(
        (room) => room.toLowerCase() === activeRoom.toLowerCase()
      )
    );
  }, [activeRoom]);

  // Algorithmic basket packing based on budgetInput
  const { packedProducts, totalSpent, remainingBudget } = useMemo(() => {
    return packProductsForBudget(
      roomProducts.length > 0 ? roomProducts : LEASE_SAFE_PRODUCTS,
      budgetInput
    );
  }, [roomProducts, budgetInput]);

  const getBadgeStyle = (badge: LeaseSafeProduct['badge']) => {
    switch (badge) {
      case 'Zero-Drill':
        return 'bg-[#4A3B32] text-[#FAF8F5] border-[#4A3B32]';
      case 'Peel & Stick':
        return 'bg-[#C69C6D] text-white border-[#B28758]';
      case 'Damage-Free':
        return 'bg-[#E5EBE1] text-[#4E5D48] border-[#D5DCD0]';
      case 'Removable':
        return 'bg-[#F0ECE1] text-[#6E7864] border-[#E8E2D8]';
      default:
        return 'bg-[#F0ECE1] text-[#4A3B32] border-[#E8E2D8]';
    }
  };

  const handleBudgetChange = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 10 && num <= 2000) {
      setBudgetInput(num);
    } else if (val === '') {
      setBudgetInput(0);
    }
  };

  const percentAllocated = Math.min(
    100,
    budgetInput > 0 ? Math.round((totalSpent / budgetInput) * 100) : 100
  );

  return (
    <div
      className={`w-full mt-6 rounded-2xl border border-[#E8E2D8] bg-[#FAF8F5] overflow-hidden shadow-xs transition-all duration-300 ${className}`}
    >
      {/* Header bar / Drawer Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 bg-[#F0ECE1] hover:bg-[#EAE4D7] text-left transition-colors cursor-pointer group select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#4A3B32] text-[#FAF8F5] flex items-center justify-center shrink-0 shadow-xs">
            <ShoppingBag className="w-4 h-4 text-[#C69C6D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-serif font-semibold text-[#4A3B32] tracking-tight">
                Shop The Lease-Safe Transformation
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium text-[#6E7864] bg-[#FAF8F5] rounded-full border border-[#D5DCD0]">
                <ShieldCheck className="w-3 h-3 text-[#6E7864]" />
                100% Damage-Free
              </span>
            </div>
            <p className="text-xs text-[#7A6B62] mt-0.5">
              Algorithmically packed for <strong>{activeRoom}</strong> to maximize impact within your budget.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-[#4A3B32] hidden md:inline">
            {isOpen ? 'Collapse drawer' : `View ${packedProducts.length} items`}
          </span>
          <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#4A3B32] group-hover:bg-white transition-colors border border-[#E8E2D8]">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expandable Drawer Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 transition-all duration-300 space-y-5">
          {/* ========================================================
              Interactive Custom Budget Engine Bar
             ======================================================== */}
          <div className="p-4 bg-white rounded-xl border border-[#E8E2D8] shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Numeric Input */}
              <div className="flex items-center gap-2.5">
                <label
                  htmlFor="custom-budget-input"
                  className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32]"
                >
                  Set Your Maximum Budget:
                </label>
                <div className="relative inline-flex items-center">
                  <span className="absolute left-2.5 text-xs font-bold text-[#7A6B62]">$</span>
                  <input
                    id="custom-budget-input"
                    type="number"
                    min={15}
                    max={1500}
                    step={5}
                    value={budgetInput === 0 ? '' : budgetInput}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    className="w-24 pl-6 pr-2.5 py-1.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-semibold text-[#4A3B32] focus:outline-none focus:ring-1 focus:ring-[#4A3B32]"
                  />
                </div>
              </div>

              {/* Quick-tap suggestion chips */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-[#7C7267] mr-1">Quick:</span>
                {BUDGET_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setBudgetInput(chip)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      budgetInput === chip
                        ? 'bg-[#4A3B32] text-white shadow-2xs font-semibold'
                        : 'bg-[#F0ECE1] text-[#5C4C41] hover:bg-[#E8E2D8]'
                    }`}
                  >
                    ${chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Spending Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#4A3B32]">
                  Cart Total: <strong>${totalSpent.toFixed(2)}</strong> / ${budgetInput} Budget Allocated
                </span>
                <span className="text-[11px] font-semibold text-[#6E7864]">
                  Remaining: ${remainingBudget.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F0ECE1] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6E7864] to-[#4A3B32] rounded-full transition-all duration-300"
                  style={{ width: `${percentAllocated}%` }}
                />
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packedProducts.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between bg-white rounded-xl border border-[#E8E2D8] p-4 hover:border-[#C69C6D] hover:shadow-md transition-all group"
              >
                <div>
                  {/* Category & Price */}
                  <div className="flex items-center justify-between text-[11px] text-[#7A6B62] mb-2 font-medium">
                    <span className="capitalize">{item.category}</span>
                    {item.priceEstimate && (
                      <span className="text-[#4A3B32] font-semibold">{item.priceEstimate}</span>
                    )}
                  </div>

                  {/* Thumbnail Preview with Badge */}
                  <div className="w-full h-32 rounded-lg bg-[#FAF8F5] overflow-hidden mb-3 border border-[#F0ECE1] relative">
                    <img
                      src={item.imagePlaceholder}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span
                      className={`absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-xs rounded-sm border ${getBadgeStyle(
                        item.badge
                      )}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-semibold text-[#4A3B32] leading-snug group-hover:text-[#C69C6D] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#7A6B62] mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {item.highlightBenefit && (
                    <div className="mt-2 text-[11px] text-[#6E7864] font-medium flex items-start gap-1">
                      <span className="text-[#C69C6D] shrink-0 font-bold">✓</span>
                      <span>{item.highlightBenefit}</span>
                    </div>
                  )}
                </div>

                {/* Amazon Affiliate Button */}
                <div className="mt-4 pt-3 border-t border-[#F0ECE1]">
                  <a
                    href={item.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#4A3B32] hover:bg-[#392C24] active:bg-[#2A201A] rounded-lg transition-colors shadow-xs group-hover:bg-[#392C24]"
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C69C6D]" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* FTC Disclosure & Affiliate Transparency */}
          <div className="mt-6 pt-4 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#8C7D73] leading-relaxed">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C69C6D] shrink-0" />
              <span>
                <strong>FTC Associate Disclosure:</strong> As an Amazon Associate, Eden Canvas earns from qualifying purchases.
                All recommended items are verified 100% removable with no wall damage.
              </span>
            </div>
            <span className="shrink-0 text-[#6E7864] font-medium bg-[#F0ECE1] px-2.5 py-1 rounded-md">
              Affiliate Tag: {AMAZON_AFFILIATE_TAG}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
