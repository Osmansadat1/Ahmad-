import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Info,
  Ruler,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  BudgetCalculationSummary,
  BudgetTier,
  ProductRecommendation,
} from '../types/eden';
import { ProductArtwork } from './ProductArtwork';

interface ShoppableSectionProps {
  recommendations: ProductRecommendation[];
  budget: BudgetTier;
  budgetSummary?: BudgetCalculationSummary;
  budgetGuidance: string;
  userVerifiedPrices?: Record<string, number>;
  onUpdateVerifiedPrice?: (productId: string, price: number | null) => void;
  onReviseToFitBudget?: () => void;
  onProductClick: (product: ProductRecommendation) => void;
  standalone?: boolean;
  sectionTitle?: string;
}

export const ShoppableSection: React.FC<ShoppableSectionProps> = ({
  recommendations,
  budget,
  budgetSummary,
  budgetGuidance,
  userVerifiedPrices = {},
  onUpdateVerifiedPrice,
  onReviseToFitBudget,
  onProductClick,
  standalone = false,
  sectionTitle,
}) => {
  const lowCostItems = recommendations.filter((item) => item.costTier === 'low_cost');
  const optionalUpgradeItems = recommendations.filter(
    (item) => item.costTier === 'optional_upgrade'
  );

  return (
    <section
      id={standalone ? 'shoppable-recommendations' : 'result-shopping-list'}
      aria-labelledby={standalone ? 'make-look-work-heading' : 'shopping-list-heading'}
      className={standalone ? '' : 'mt-10 pt-8 border-t border-[#E8E1D6]'}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F4D3D] mb-1">
            {standalone ? 'Practical Decor Discovery · Sample Categories' : 'C. The Shopping List'}
          </p>
          <h2
            id={standalone ? 'make-look-work-heading' : 'shopping-list-heading'}
            className="text-2xl sm:text-3xl font-semibold text-[#1C2420] tracking-tight"
          >
            {sectionTitle || 'Make the Look Work in Real Life'}
          </h2>
          <p className="text-sm text-[#667067] mt-1.5 max-w-2xl leading-relaxed">
            {budgetGuidance}
          </p>
        </div>

        <div className="bg-[#FAF7F2] rounded-xl px-4 py-3 border border-[#E8E1D6] shrink-0">
          <div className="text-xs text-[#667067]">
            Budget Plan: <span className="font-semibold text-[#1C2420]">{budget}</span>
            {budgetSummary && budgetSummary.maxBudgetDollars !== null && (
              <span className="font-semibold text-[#1F4D3D]">
                {' '}
                (${budgetSummary.maxBudgetDollars} Max)
              </span>
            )}
          </div>
          <div className="text-xs font-semibold text-[#1F4D3D] mt-0.5">
            {recommendations.length} Recommended Item{recommendations.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* 5. BEFORE YOU BUY — "Preview Before You Purchase" Reality-Check Notice */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D6]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#D9E7DC] text-[#1F4D3D] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm text-[#667067] leading-relaxed">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-[#1C2420]">
                Preview Before You Purchase
              </h3>
              <span className="text-[11px] font-semibold text-[#1F4D3D] bg-[#FFFFFF] px-2.5 py-0.5 rounded-md border border-[#E8E1D6]">
                Concept Visualization Notice
              </span>
            </div>
            <p>
              The generated room image is a <strong>design concept</strong> created for visual
              inspiration. Actual retail product dimensions, fabric colors, wood grain, and
              proportions may differ from the concept image. Eden Canvas does not claim an exact 1:1
              match between generated visuals and retail items unless explicitly verified. Always
              measure your physical room and doorway clearances before purchasing.
            </p>
          </div>
        </div>
      </div>

      {/* 2. REALISTIC TOTAL BUDGET SUMMARY & EXCESS CHECKER */}
      {budgetSummary && (
        <div
          className={`mb-6 p-5 rounded-2xl border ${
            budgetSummary.isOverBudget
              ? 'bg-[#EFE5D6]/45 border-[#C2623F]'
              : 'bg-[#FFFFFF] border-[#E8E1D6]'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-[#E8E1D6]">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#667067] font-semibold">
                Verified Product Subtotal
              </span>
              <div className="text-2xl font-semibold text-[#1C2420] mt-0.5">
                {budgetSummary.verifiedItemCount > 0
                  ? `$${budgetSummary.verifiedSubtotalDollars}`
                  : '$0 verified'}
              </div>
              <span className="text-[11px] text-[#667067]">
                {budgetSummary.verifiedItemCount} of {budgetSummary.recommendedCount} item
                {budgetSummary.recommendedCount === 1 ? '' : 's'} with verified price
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#667067] font-semibold">
                Estimated Category Range
              </span>
              <div className="text-2xl font-semibold text-[#1C2420] mt-0.5">
                {budgetSummary.recommendedCount > 0
                  ? `$${budgetSummary.estimatedRangeMinDollars}–$${budgetSummary.estimatedRangeMaxDollars}`
                  : '$0 (Free Only)'}
              </div>
              <span className="text-[11px] text-[#667067]">
                {budgetSummary.unverifiedItemCount > 0
                  ? `Includes ${budgetSummary.unverifiedItemCount} unverified sample range(s)`
                  : 'All active items have verified prices'}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#667067] font-semibold">
                Recommended Items
              </span>
              <div className="text-2xl font-semibold text-[#1C2420] mt-0.5">
                {budgetSummary.recommendedCount}
              </div>
              <span className="text-[11px] text-[#667067]">
                {lowCostItems.length} low-cost · {optionalUpgradeItems.length} optional higher-cost
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#667067] font-semibold">
                Remaining Budget
              </span>
              <div
                className={`text-2xl font-semibold mt-0.5 ${
                  budgetSummary.isOverBudget ? 'text-[#B45309]' : 'text-[#1F4D3D]'
                }`}
              >
                {budgetSummary.maxBudgetDollars === null
                  ? 'No Fixed Cap'
                  : budgetSummary.isOverBudget
                  ? `Over by $${budgetSummary.exceedsBudgetByDollars}`
                  : `$${budgetSummary.remainingBudgetDollars} left`}
              </div>
              <span className="text-[11px] text-[#667067]">
                {budgetSummary.maxBudgetDollars !== null
                  ? `Against $${budgetSummary.maxBudgetDollars} max budget`
                  : 'Inspiration-only mode'}
              </span>
            </div>
          </div>

          {/* Over-budget warning & one-click revision action */}
          {budgetSummary.isOverBudget && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#C2623F]/60">
              <div className="flex items-start gap-2.5 text-xs text-[#1C2420]">
                <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <span>
                  <strong>Budget Excess Detected:</strong> {budgetSummary.statusMessage}
                </span>
              </div>
              {onReviseToFitBudget && (
                <button
                  type="button"
                  onClick={onReviseToFitBudget}
                  className="px-4 py-2 rounded-xl bg-[#1F4D3D] text-[#FFFFFF] text-xs font-semibold hover:bg-[#153A2E] transition-colors shrink-0 cursor-pointer"
                >
                  Revise to Fit My Budget
                </button>
              )}
            </div>
          )}

          {/* Mandatory exclusion note */}
          <p className="mt-3 text-[11px] text-[#667067] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1F4D3D] shrink-0" />
            <span>{budgetSummary.exclusionNote}</span>
          </p>
        </div>
      )}

      {/* Empty state when user chooses "Use existing items only" ($0 budget) */}
      {recommendations.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E8E1D6] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#D9E7DC] text-[#1F4D3D] flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-[#1C2420]">
            $0 Purchase Plan — Using Only What You Already Own
          </h3>
          <p className="text-xs sm:text-sm text-[#667067] max-w-xl mx-auto">
            Because you selected <strong>Use existing items only</strong> (or a $0 budget ceiling),
            we have excluded new retail purchases so you can focus entirely on the free layout,
            lighting, and decluttering steps in <strong>The Plan</strong> above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => {
            const userVerified = userVerifiedPrices[product.id];
            const effectivePrice =
              typeof userVerified === 'number' && !Number.isNaN(userVerified)
                ? userVerified
                : product.verifiedPriceDollars;

            return (
              <article
                key={product.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E8E1D6] overflow-hidden flex flex-col justify-between transition-all duration-150 hover:border-[#1F4D3D]/40 hover:shadow-xs"
              >
                <div>
                  <ProductArtwork
                    visualType={product.visualType}
                    swatches={product.paletteSwatches}
                  />

                  <div className="p-5">
                    {/* Cost Tier & Category Metadata */}
                    <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                      <span className="font-semibold text-[#1F4D3D]">{product.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md font-medium ${
                          product.costTier === 'low_cost'
                            ? 'bg-[#D9E7DC] text-[#1F4D3D]'
                            : 'bg-[#FAF7F2] text-[#667067] border border-[#E8E1D6]'
                        }`}
                      >
                        {product.costTier === 'low_cost'
                          ? 'Low-Cost Change'
                          : 'Optional Upgrade'}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#1C2420] leading-snug">
                      {product.name}
                    </h3>

                    {/* Verified Price vs Unverified Typical Range */}
                    <div className="mt-2 text-xs text-[#667067]">
                      <span className="font-semibold text-[#1C2420]">
                        {typeof effectivePrice === 'number'
                          ? `$${effectivePrice} (Verified Price)`
                          : product.verifiedPrice
                          ? product.verifiedPrice
                          : 'Price unverified (Sample)'}
                      </span>
                      <span aria-hidden="true" className="mx-1.5">
                        ·
                      </span>
                      <span>{product.typicalRangeLabel}</span>
                    </div>

                    {/* Optional User Price Verification Input */}
                    {onUpdateVerifiedPrice && (
                      <div className="mt-2.5 flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-lg border border-[#E8E1D6]">
                        <DollarSign className="w-3.5 h-3.5 text-[#1F4D3D] shrink-0" />
                        <label
                          htmlFor={`price-${product.id}`}
                          className="text-[11px] text-[#667067] whitespace-nowrap"
                        >
                          Enter retailer price:
                        </label>
                        <input
                          id={`price-${product.id}`}
                          type="number"
                          min={0}
                          max={5000}
                          placeholder="e.g. 45"
                          value={typeof effectivePrice === 'number' ? effectivePrice : ''}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            onUpdateVerifiedPrice(
                              product.id,
                              val === '' ? null : Math.max(0, Number(val))
                            );
                          }}
                          className="w-full bg-white border border-[#E8E1D6] rounded px-1.5 py-0.5 text-xs text-[#1C2420]"
                        />
                      </div>
                    )}

                    {/* Dimensions */}
                    <div className="mt-3 flex items-start gap-1.5 text-[11px] text-[#667067]">
                      <Ruler className="w-3.5 h-3.5 text-[#1F4D3D] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#1C2420]">Dimensions:</strong>{' '}
                        {product.dimensionsLabel}
                      </span>
                    </div>

                    {/* Why it matches the design */}
                    <p className="mt-2.5 text-xs text-[#667067] leading-relaxed">
                      <strong className="text-[#1C2420]">Why it fits:</strong> {product.fitReason}
                    </p>

                    {/* Small-space benefit if applicable */}
                    {product.smallSpaceBenefit && (
                      <p className="mt-2 text-[11px] text-[#667067] leading-relaxed">
                        <strong className="text-[#1F4D3D]">Small-Space Note:</strong>{' '}
                        {product.smallSpaceBenefit}
                      </p>
                    )}

                    {/* Why it suits rental restrictions */}
                    <div className="mt-3 pt-3 border-t border-[#E8E1D6] flex items-start gap-2 text-xs text-[#667067]">
                      <ShieldCheck className="w-4 h-4 text-[#1F4D3D] shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-medium text-[#1C2420]">Renter Fit:</strong>{' '}
                        {product.renterExplanation}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <a
                    href={product.retailerSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onProductClick(product)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#1C2420] bg-[#FAF7F2] hover:bg-[#D9E7DC]/60 border border-[#E8E1D6] rounded-xl transition-colors whitespace-nowrap"
                  >
                    <span>Search on Google Shopping</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
