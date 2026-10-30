import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { CreditState } from '../types/eden';

interface ProjectPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditState: CreditState;
  onActivateDemoPass: () => void;
}

export const ProjectPassModal: React.FC<ProjectPassModalProps> = ({
  isOpen,
  onClose,
  creditState,
  onActivateDemoPass,
}) => {
  const [activatedMessage, setActivatedMessage] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    onActivateDemoPass();
    setActivatedMessage(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-pass-modal-title"
    >
      <div className="bg-[#F7F3EC] border border-[#1C2420]/15 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Project Pass dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-lg flex items-center justify-center text-[#1C2420]/70 hover:text-[#1C2420] hover:bg-[#E9DFD1]/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-xs font-medium uppercase tracking-wider text-[#76543D]">
          Wold Eden · Pricing Hypothesis Preview
        </p>
        <h2
          id="project-pass-modal-title"
          className="text-2xl font-semibold text-[#1C2420] mt-1"
        >
          Eden Canvas Project Pass
        </h2>
        <p className="text-sm text-[#1C2420]/75 mt-2 leading-relaxed">
          Moving into a new apartment doesn’t require another monthly subscription. We are testing a simple, one-time seasonal pass for renters.
        </p>

        <div className="mt-5 p-5 rounded-xl bg-white border border-[#1C2420]/10">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-base font-semibold text-[#1C2420]">One-Time Project Pass</span>
              <p className="text-xs text-[#1C2420]/65 mt-0.5">Proposed commercial offer · Valid for 6 months</p>
            </div>
            <div className="text-right font-mono tabular-nums">
              <span className="text-2xl font-semibold text-[#1C2420]">$12</span>
              <span className="text-xs text-[#1C2420]/60 block">for 50 credits</span>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-[#1C2420]/80">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#76543D] shrink-0" />
              <span>50 room redesign credits (valid for 6 months across all rooms in your apartment)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#76543D] shrink-0" />
              <span>Full renter-safe rule controls & architecture-preserving prompts</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#76543D] shrink-0" />
              <span>High-resolution before-and-after downloads & budget shopping lists</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 p-3.5 rounded-lg bg-[#E9DFD1]/60 text-xs text-[#1C2420]/80">
          <strong>Prototype Notice:</strong> No payment information is collected in this prototype. Your current session balance is{' '}
          <span className="font-mono font-semibold tabular-nums">
            {creditState.freeTrialRemaining + creditState.projectPassCredits} credits
          </span>
          . You can unlock a free 50-credit sandbox pass below to test credit accounting.
        </div>

        {activatedMessage && (
          <div className="mt-3 p-3 rounded-lg bg-[#A5AE91]/25 border border-[#A5AE91] text-xs text-[#1C2420] font-medium">
            50 Demo Project Pass credits added to your session (no payment required).
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#1C2420] hover:bg-[#E9DFD1]/60 rounded-lg transition-colors"
          >
            Continue Free Trial
          </button>
          <button
            type="button"
            onClick={handleActivate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#76543D] hover:bg-[#614430] rounded-lg transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Activate 50-Credit Demo Pass ($0 Sandbox)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
