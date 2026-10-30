import React, { useState } from 'react';
import { ArrowRight, Check, Coins, ShieldCheck, Sparkles, X } from 'lucide-react';

export interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string, credits: number, price: string) => void;
  currentCredits?: number;
}

export interface CreditPackageTier {
  id: string;
  name: string;
  credits: number;
  price: string;
  priceAmount: number;
  highlighted?: boolean;
  badge?: string;
  description: string;
  features: string[];
}

export const PRICING_PACKAGES: CreditPackageTier[] = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    credits: 25,
    price: '$9',
    priceAmount: 9,
    description: 'Perfect for quick room refreshes & styling checks.',
    features: [
      '25 room redesigns',
      'All lease-safe themes included',
      'Interactive Before/After slider',
      'Downloadable high-res previews',
    ],
  },
  {
    id: 'most-popular',
    name: 'Most Popular',
    credits: 75,
    price: '$19',
    priceAmount: 19,
    highlighted: true,
    badge: 'MOST POPULAR',
    description: '75 room redesigns, 8K Ultra mode & digital guide.',
    features: [
      '75 room redesigns',
      '8K Ultra mode realistic textures',
      'The Room Refresh Blueprint digital guide included',
      'Priority AI rendering queue',
    ],
  },
  {
    id: 'vip-studio-pass',
    name: 'VIP Studio Pass',
    credits: 150,
    price: '$29',
    priceAmount: 29,
    description: 'Comprehensive suite for apartments, staging & moves.',
    features: [
      '150 room redesigns',
      'Priority AI rendering',
      'The Vault (60-Page Diagnostic Kit & Planner)',
      'Unlimited variation generation',
    ],
  },
];

const INCLUDED_CHECKLIST = [
  'Landlord-approved zero-damage hacks',
  'Instant shoppable hardware links (with Amazon affiliate integration)',
  'Commercial usage for staging & Airbnb rentals',
  'High-resolution before/after slider exports',
];

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  currentCredits = 0,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('most-popular');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = (tier: CreditPackageTier) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSelectPlan(tier.id, tier.credits, tier.price);
    }, 450);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#4A3B32]/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E8E2D8] rounded-3xl shadow-2xl p-6 sm:p-10 z-10 overflow-hidden text-[#4A3B32]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#7A6B62] hover:text-[#4A3B32] hover:bg-[#F0ECE1] transition-colors cursor-pointer"
          aria-label="Close pricing dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0ECE1] text-[#6E7864] border border-[#D5DCD0] mb-3">
            <Coins className="w-3.5 h-3.5 text-[#C69C6D]" />
            <span>
              {currentCredits === 0 ? '0 credits remaining' : `${currentCredits} credits remaining`}
            </span>
          </div>

          <h2
            id="pricing-modal-title"
            className="text-3xl sm:text-4xl font-serif font-bold text-[#4A3B32] tracking-tight"
          >
            Buy Eden Canvas Credits
          </h2>
          <p className="mt-2 text-sm text-[#7A6B62] leading-relaxed">
            You have {currentCredits} {currentCredits === 1 ? 'credit' : 'credits'}. Join thousands of
            happy renters transforming spaces without damage.
          </p>
        </div>

        {/* 3-Tier Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 items-stretch">
          {PRICING_PACKAGES.map((tier) => {
            const isSelected = selectedPlanId === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedPlanId(tier.id)}
                className={`relative flex flex-col justify-between rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                  tier.highlighted
                    ? 'bg-[#F0ECE1] border-[#C69C6D] shadow-md md:-translate-y-1'
                    : isSelected
                    ? 'bg-white border-[#4A3B32] shadow-sm'
                    : 'bg-white/90 border-[#E8E2D8] hover:border-[#C69C6D]/70'
                }`}
              >
                {/* Most Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs whitespace-nowrap bg-[#4A3B32] text-[#FAF8F5]">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-serif font-bold text-[#4A3B32]">{tier.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-bold font-serif text-[#4A3B32]">
                      {tier.price}
                    </span>
                    <span className="text-xs text-[#7A6B62] font-medium">USD / one-time</span>
                  </div>

                  <div className="inline-block mt-2 px-2.5 py-1 text-xs font-semibold text-[#6E7864] bg-white rounded-lg border border-[#E8E2D8]">
                    <strong>{tier.credits} Credits</strong>
                  </div>

                  <p className="text-xs text-[#7A6B62] mt-3 leading-relaxed">
                    {tier.description}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-[#E8E2D8] pt-4 text-xs text-[#5C4C41]">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#6E7864] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePay(tier);
                    }}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      tier.highlighted
                        ? 'bg-[#4A3B32] text-[#FAF8F5] hover:bg-[#382C24]'
                        : isSelected
                        ? 'bg-[#4A3B32] text-[#FAF8F5] hover:bg-[#382C24]'
                        : 'bg-[#4A3B32] text-[#FAF8F5] hover:bg-[#382C24]'
                    }`}
                  >
                    {isProcessing && isSelected ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <span>Pay now</span>
                        <ArrowRight className="w-4 h-4 text-[#C69C6D]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* "What's Included" Checklist Section (Bottom Grid) */}
        <div className="mt-10 pt-6 border-t border-[#E8E2D8]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7C7267] text-center mb-4">
            Included with every Eden Canvas credit pack
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#4A3B32]">
            {INCLUDED_CHECKLIST.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E5EBE1] text-[#6E7864] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7D73] pt-4 border-t border-[#E8E2D8]/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E7864]" />
              <span>One-time purchase · No subscriptions or hidden renewals</span>
            </div>
            <span className="text-[11px]">Instant credit activation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
