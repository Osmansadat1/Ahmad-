import React from 'react';
import { Clock, Shield, ShieldCheck, Sparkles } from 'lucide-react';

export interface DepositProtectionWidgetProps {
  roomType?: string;
  depositAtRisk?: string;
  estimatedCost?: string;
  className?: string;
}

export const DepositProtectionWidget: React.FC<DepositProtectionWidgetProps> = ({
  depositAtRisk = '$2,200',
  estimatedCost = '~$145',
  className = '',
}) => {
  return (
    <div
      aria-label="Interactive Reversibility Score and ROI Summary Box"
      className={`w-full rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] p-5 sm:p-6 shadow-2xs transition-all ${className}`}
    >
      {/* Top Bar: Reversibility Score Gauge */}
      <div className="mb-5 pb-4 border-b border-[#E8E2D8]/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6E7864] animate-pulse" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32]">
              Reversibility Score Gauge
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#4A3B32]">
              Safety Score: <strong className="text-[#6E7864] text-sm">98%</strong> (Safe)
            </span>
          </div>
        </div>

        {/* Animated Progress Meter */}
        <div className="w-full h-2.5 rounded-full bg-[#F0ECE1] overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-[#C69C6D] via-[#6E7864] to-[#4A3B32] rounded-full transition-all duration-1000 ease-out"
            style={{ width: '98%' }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#7C7267]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#C69C6D]" />
            Estimated restore time: <strong>45 mins</strong>. Zero wall spackle required.
          </span>
          <span className="text-[#6E7864] font-medium hidden sm:inline">
            100% Landlord Inspection Approved
          </span>
        </div>
      </div>

      {/* Deposit ROI Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-center">
        {/* Left Metric: Avg. Security Deposit at Risk */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#7C7267]">Avg. Security Deposit at Risk</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B32]">
              {depositAtRisk}
            </span>
            <span className="text-xs font-medium text-[#8C7D73]">USD</span>
          </div>
          <p className="text-[11px] text-[#7C7267] leading-snug">
            Based on US landlord repair claims
          </p>
        </div>

        {/* Center Metric: Estimated Hardware Cost */}
        <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:pl-6 border-[#E8E2D8]/60 pt-3 sm:pt-0">
          <p className="text-xs font-medium text-[#7C7267]">Estimated Hardware Cost</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B32]">
              {estimatedCost}
            </span>
            <span className="text-xs font-medium text-[#6E7864] font-semibold">reusable</span>
          </div>
          <p className="text-[11px] text-[#7C7267] leading-snug">
            100% reusable damage-free hardware
          </p>
        </div>

        {/* Right Metric: Lease Safety Status */}
        <div className="space-y-2 border-t md:border-t-0 md:border-l md:pl-6 border-[#E8E2D8]/60 pt-3 md:pt-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#7C7267]">Lease Safety Status</p>
            <span className="text-xs font-bold text-[#6E7864]">100% Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EBE1] text-[#4E5D48] border border-[#D5DCD0] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E7864]" />
              <span>No Structural Drilling</span>
            </span>
          </div>
          <p className="text-[11px] text-[#7C7267] leading-snug">
            Verified deposit protection guarantee
          </p>
        </div>
      </div>
    </div>
  );
};
