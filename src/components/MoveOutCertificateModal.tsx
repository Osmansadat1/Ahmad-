import React from 'react';
import { Check, Download, FileText, Printer, ShieldCheck, X } from 'lucide-react';

export interface MoveOutCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  styleName: string;
  beforeUrl: string;
  afterUrl: string;
}

export const MoveOutCertificateModal: React.FC<MoveOutCertificateModalProps> = ({
  isOpen,
  onClose,
  roomName,
  styleName,
  beforeUrl,
  afterUrl,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `EC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hardwareAudit = [
    {
      item: 'Heavy-Duty Room Divider & Curtain Tension Bar',
      attachment: 'Dual Spring Compression / Silicone Wall Guards',
      penetrationRisk: '0% (Zero Screws / Nails)',
      removalProtocol: 'Unscrew tension dial, wipe trim with damp cloth',
    },
    {
      item: 'Matte Architectural Countertop & Tile Film',
      attachment: 'Peel-and-Stick Removable Acrylic Adhesive',
      penetrationRisk: '0% (Zero Residue / Glue)',
      removalProtocol: 'Warm corner with hair dryer, peel at 45° angle',
    },
    {
      item: 'Rechargeable Wireless Ambient Sconce Duo',
      attachment: 'Damage-Free Interlocking Command Pull-Tabs',
      penetrationRisk: '0% (Zero Hardwiring)',
      removalProtocol: 'Pull downward release tab parallel to wall',
    },
    {
      item: 'Washable Low-Pile Acoustic Floor Area Rug',
      attachment: 'Non-Slip Reusable Rubberized Grid Underlay',
      penetrationRisk: '0% (Zero Staples / Tacks)',
      removalProtocol: 'Roll rug and pad; vacuum base flooring',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#4A3B32]/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Certificate Container */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E8E2D8] rounded-3xl shadow-2xl p-6 sm:p-10 z-10 overflow-hidden text-[#4A3B32] print:p-0 print:border-none print:shadow-none print:bg-white">
        {/* Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E2D8] print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E5EBE1] text-[#6E7864] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#4A3B32]">
                Landlord Move-Out Inspection Report
              </h3>
              <p className="text-[11px] text-[#7C7267]">
                Official lease-compliance &amp; zero-damage verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#4A3B32] text-[#FAF8F5] text-xs font-semibold hover:bg-[#382C24] transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#C69C6D]" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#7C7267] hover:text-[#4A3B32] hover:bg-[#F0ECE1] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Document */}
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 space-y-6 text-[#4A3B32]">
          {/* Header Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-xl font-bold tracking-tight text-[#4A3B32]">
                  Eden Canvas
                </span>
                <span className="font-serif text-sm italic text-[#7C7267]">by Wold Eden</span>
              </div>
              <p className="text-xs text-[#7C7267]">
                Certified Non-Destructive Renter Makeover Audit
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5">
              <div className="font-mono text-[11px] text-[#7C7267]">
                Certificate ID: <strong className="text-[#4A3B32]">{certificateId}</strong>
              </div>
              <div className="text-[11px] text-[#7C7267]">Issued: {currentDate}</div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-[#E5EBE1] text-[#4E5D48] text-[10px] font-semibold">
                100% Lease-Compliance Certified
              </div>
            </div>
          </div>

          {/* Scope & Space Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8] text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#7C7267]">Room Type</span>
              <p className="font-semibold text-[#4A3B32]">{roomName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#7C7267]">Aesthetic Style</span>
              <p className="font-semibold text-[#4A3B32]">{styleName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#7C7267]">Wall Fasteners</span>
              <p className="font-semibold text-[#6E7864]">0 Screws / 0 Nails</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#7C7267]">Move-Out Time</span>
              <p className="font-semibold text-[#4A3B32]">&lt; 45 Minutes</p>
            </div>
          </div>

          {/* Photographic Record (Before & After Side-by-Side) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32] mb-2.5">
              Photographic Move-In vs. Reversible Concept Record
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#FAF8F5]">
                <div className="px-3 py-1 bg-[#FAF8F5] text-[10px] font-semibold text-[#7C7267] border-b border-[#E8E2D8]">
                  BASE CONDITION (As Inspected)
                </div>
                <img
                  src={beforeUrl}
                  alt="Original base room"
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#FAF8F5]">
                <div className="px-3 py-1 bg-[#F0ECE1] text-[10px] font-semibold text-[#6E7864] border-b border-[#E8E2D8]">
                  REVERSIBLE MAKEOVER (Zero Wall Contact)
                </div>
                <img
                  src={afterUrl}
                  alt="Lease-safe makeover"
                  className="w-full h-44 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Itemized Hardware Audit Table */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32] mb-2.5">
              Itemized Fixture &amp; Attachment Audit
            </h4>
            <div className="border border-[#E8E2D8] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D8] text-[10px] uppercase tracking-wider text-[#7C7267]">
                    <th className="py-2.5 px-3 font-semibold">Fixture / Upgrade</th>
                    <th className="py-2.5 px-3 font-semibold">Attachment Mechanism</th>
                    <th className="py-2.5 px-3 font-semibold">Structural Risk</th>
                    <th className="py-2.5 px-3 font-semibold">Move-Out Clean Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8] text-[11px]">
                  {hardwareAudit.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F5]/50">
                      <td className="py-2 px-3 font-medium text-[#4A3B32]">{row.item}</td>
                      <td className="py-2 px-3 text-[#7C7267]">{row.attachment}</td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#6E7864]">
                          <Check className="w-3 h-3" />
                          {row.penetrationRisk}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#7C7267]">{row.removalProtocol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3-Step Clean Removal Protocol */}
          <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32] mb-2">
              Mandatory 3-Step Move-Out Restoration Protocol
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#7C7267]">
              <div>
                <strong className="text-[#4A3B32] block mb-0.5">1. Gently Peel &amp; Release</strong>
                Warm adhesive corners with low hairdryer heat if necessary; unthread tension fixtures with zero drywall friction.
              </div>
              <div>
                <strong className="text-[#4A3B32] block mb-0.5">2. Surface Wipe-Down</strong>
                Wipe surfaces using mild dish soap and warm microfiber towel. Zero spackle, sanding, or repainting required.
              </div>
              <div>
                <strong className="text-[#4A3B32] block mb-0.5">3. Pack &amp; Reclaim</strong>
                All fixtures are 100% reusable. Pack cleanly for move-out inspection and transfer to next home.
              </div>
            </div>
          </div>

          {/* Formal Landlord Compliance Sign-Off */}
          <div className="pt-4 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#7C7267]">
            <p className="max-w-md leading-relaxed text-[11px]">
              <strong>Lease Compliance Guarantee:</strong> The items listed above have been audited under standard
              U.S. residential lease covenants. They introduce zero drywall penetrations, zero structural modifications,
              and guarantee full security deposit reversibility upon move-out.
            </p>

            <div className="border border-dashed border-[#C69C6D] rounded-xl p-3 text-center min-w-[200px]">
              <div className="text-[10px] uppercase font-semibold text-[#7C7267] mb-4">
                Property Manager Sign-Off
              </div>
              <div className="border-b border-[#4A3B32] w-32 mx-auto mb-1" />
              <div className="text-[10px] text-[#A2978A]">Signature / Move-Out Inspection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
