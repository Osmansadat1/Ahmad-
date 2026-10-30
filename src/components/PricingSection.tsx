import React, { useState } from 'react';
import { Check, Coins, ShieldCheck, Sparkles } from 'lucide-react';
import { CHECKOUT_PAYMENT_LINKS, PRICING_PACKAGES, PricingPackage } from '../data/config';

interface PricingSectionProps {
  onStartFree?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onStartFree }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePackageClick = (pkg: PricingPackage) => {
    if (pkg.id === 'free') {
      onStartFree?.();
      return;
    }

    const checkoutUrl = CHECKOUT_PAYMENT_LINKS[pkg.id];
    if (checkoutUrl && checkoutUrl.trim() !== '') {
      window.location.href = checkoutUrl;
    } else {
      setToastMessage("Checkout isn't connected yet.");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <section
      id="pricing"
      className="relative w-full py-16 sm:py-24 bg-[#F0ECE1]/40 dark:bg-[#1E1814] text-[#4A3B32] dark:text-[#FAF8F5] border-b border-[#E8E2D8] dark:border-[#3A3029] transition-colors"
      style={{ contentVisibility: 'auto' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#4A3B32] text-[#FAF8F5] px-5 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 animate-fade-in">
            <Coins className="w-4 h-4 text-[#C69C6D]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C69C6D] font-semibold">
            One-Time Credit Packs · No Subscriptions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#4A3B32] dark:text-[#FAF8F5] mt-2">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#7C7267] dark:text-[#B8B2A6]">
            Every room makeover uses 1 credit. Keep your designs forever with zero recurring fees.
          </p>
        </div>

        {/* 4 Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PACKAGES.map((pkg) => {
            const isPopular = pkg.popular;
            return (
              <div
                key={pkg.id}
                className={`relative bg-[#FAF8F5] dark:bg-[#251E19] rounded-3xl p-6 sm:p-7 flex flex-col justify-between border transition-all duration-300 shadow-2xs ${
                  isPopular
                    ? 'border-[#C69C6D] ring-2 ring-[#C69C6D]/30 dark:ring-[#C69C6D]/20 shadow-md'
                    : 'border-[#E8E2D8] dark:border-[#3A3029] hover:border-[#C69C6D]/60'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C69C6D] text-[#1B1613] text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[#6E7864] dark:text-[#8B9680]">
                      <Coins className="w-3.5 h-3.5 text-[#C69C6D]" />
                      <span>{pkg.credits} credits</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 mb-2 flex items-baseline gap-1">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                      {pkg.priceFormatted}
                    </span>
                    <span className="text-xs text-[#7C7267] dark:text-[#B8B2A6]">one-time</span>
                  </div>

                  {/* Price per credit & Validity */}
                  <div className="space-y-1 pb-6 border-b border-[#E8E2D8] dark:border-[#3A3029] text-xs">
                    <p className="font-medium text-[#C69C6D]">{pkg.pricePerCredit}</p>
                    <p className="text-[#7C7267] dark:text-[#B8B2A6]">{pkg.validityLine}</p>
                  </div>

                  {/* Value Bullets */}
                  <ul className="py-6 space-y-2.5 text-xs text-[#7C7267] dark:text-[#B8B2A6]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6E7864] shrink-0" />
                      <span>Photorealistic lease-safe Before/After render</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6E7864] shrink-0" />
                      <span>100% damage-free hardware suggestions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6E7864] shrink-0" />
                      <span>Full resolution download & slider inspection</span>
                    </li>
                  </ul>
                </div>

                {/* Card CTA Button */}
                <button
                  type="button"
                  onClick={() => handlePackageClick(pkg)}
                  className={`w-full py-3 px-4 rounded-full font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                    isPopular
                      ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] hover:bg-[#382C24] dark:hover:bg-[#B88E5F] shadow-xs'
                      : 'bg-white dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] border border-[#E8E2D8] dark:border-[#3A3029] hover:bg-[#F0ECE1] dark:hover:bg-[#251E19]'
                  }`}
                >
                  {pkg.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Reassurance Footer */}
        <div className="mt-12 text-center text-xs text-[#7C7267] dark:text-[#B8B2A6] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6E7864]" />
          <span>1 design = 1 credit. Failed generations are refunded automatically.</span>
        </div>
      </div>
    </section>
  );
};
