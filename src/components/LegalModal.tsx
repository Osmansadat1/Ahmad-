import React, { useState } from 'react';
import { Shield, Lock, FileCheck, X, AlertTriangle } from 'lucide-react';

export type LegalModalTab = 'terms' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalModalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalModalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] dark:bg-[#1E1814] rounded-3xl border border-[#E8E2D8] dark:border-[#3A3029] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#E8E2D8] dark:border-[#3A3029] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6E7864]/15 text-[#6E7864] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                {activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6]">
                Eden Canvas by Wold Eden · Transparent Renter Protections
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F0ECE1] dark:hover:bg-[#251E19] text-[#7C7267] dark:text-[#B8B2A6] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8E2D8] dark:border-[#3A3029] px-6 bg-[#F0ECE1]/40 dark:bg-[#1B1613]">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#C69C6D] text-[#4A3B32] dark:text-[#FAF8F5]'
                : 'border-transparent text-[#7C7267] dark:text-[#B8B2A6] hover:text-[#4A3B32]'
            }`}
          >
            Terms of Service & Conceptual Disclaimer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#C69C6D] text-[#4A3B32] dark:text-[#FAF8F5]'
                : 'border-transparent text-[#7C7267] dark:text-[#B8B2A6] hover:text-[#4A3B32]'
            }`}
          >
            Privacy Policy & Data Non-Retention
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs leading-relaxed text-[#4A3B32] dark:text-[#FAF8F5]">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Conceptual Visualization Only:</strong>
                  Eden Canvas provides artistic and conceptual interior visualizations. The tool is NOT legal advice, architectural certification, or a binding agreement with your landlord or property management company.
                </div>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-serif text-base font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  1. Tenant Responsibility & Lease Verification
                </h4>
                <p className="text-[#7C7267] dark:text-[#B8B2A6]">
                  Every residential lease agreement contains specific rules governing alterations, wall fasteners, paint colors, and fixtures. While Eden Canvas models 100% damage-free, peel-and-stick, and tension-based concepts, you must independently review your lease agreement and obtain landlord approval where required prior to physical installation.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-serif text-base font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  2. Reversibility & Damage Disclaimer
                </h4>
                <p className="text-[#7C7267] dark:text-[#B8B2A6]">
                  Adhesive products (such as removable contact paper or Command picture strips) depend on preexisting wall conditions, paint quality, and proper move-out removal techniques. Eden Canvas is not liable for incidental damage, paint peeling, or security deposit deductions resulting from physical decor implementation.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-serif text-base font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  3. Amazon Associate & Affiliate Disclosure
                </h4>
                <p className="text-[#7C7267] dark:text-[#B8B2A6]">
                  Eden Canvas earns from qualifying purchases. As an Amazon Associate, Wold Eden earns from qualifying purchases made via links tagged with <code>Sayedosmanema-20</code>. Product prices, availability, and merchant specifications are subject to change on Amazon.com.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#6E7864]/10 border border-[#6E7864]/30 text-[#4A3B32] dark:text-[#FAF8F5] flex items-start gap-2.5">
                <Lock className="w-4 h-4 shrink-0 text-[#6E7864] mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Strict Data Non-Retention Guarantee:</strong>
                  Your room photos and uploaded lease documents are processed ephemerally in memory and NOT stored, persisted, or used to train third-party machine learning models.
                </div>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-serif text-base font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  1. Ephemeral Room Photo Processing
                </h4>
                <p className="text-[#7C7267] dark:text-[#B8B2A6]">
                  When you upload a room photo, it is compressed client-side and streamed in-memory to generate your lease-safe makeover. Eden Canvas does not store, archive, sell, or index your original or generated room photos on persistent storage.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-serif text-base font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  2. Client-Side Lease PII Redaction
                </h4>
                <p className="text-[#7C7267] dark:text-[#B8B2A6]">
                  Our experimental Lease Parser automatically scrubs tenant names, SSNs, bank account numbers, phone numbers, email addresses, and signature blocks in your browser before any text is processed. Leases are never stored in databases or filesystem disks.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-serif text-base font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                  3. Local Browser Storage
                </h4>
                <p className="text-[#7C7267] dark:text-[#B8B2A6]">
                  Your credit balance and temporary design preview cache are stored strictly in your browser's local storage (<code>localStorage</code>) on your own device. You can clear this anytime by wiping browser storage.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2D8] dark:border-[#3A3029] bg-[#F0ECE1]/50 dark:bg-[#1B1613] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-semibold bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] hover:bg-[#382C24] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
