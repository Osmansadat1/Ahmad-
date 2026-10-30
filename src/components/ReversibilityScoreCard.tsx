import React from 'react';
import { ShieldCheck, FileText, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ReversibilityEvaluation } from '../utils/reversibilityScore';
import { generateMoveOutInspectionReport } from '../utils/generateInspectionReport';

interface ReversibilityScoreCardProps {
  evaluation: ReversibilityEvaluation;
  roomType: string;
  style: string;
  presets: string[];
  landlordFilters: string[];
  confirmedClauses?: string[];
}

export const ReversibilityScoreCard: React.FC<ReversibilityScoreCardProps> = ({
  evaluation,
  roomType,
  style,
  presets,
  landlordFilters,
  confirmedClauses,
}) => {
  const { score, tierLabel, explanation, howToReach100Tip } = evaluation;

  // Arc meter calculation (semi-circle 0 - 180 degrees)
  const radius = 42;
  const stroke = 8;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleDownloadPDF = () => {
    generateMoveOutInspectionReport({
      roomType,
      style,
      evaluation,
      presets,
      landlordFilters,
      confirmedClauses,
    });
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#201A16] rounded-3xl border border-[#E8E2D8] dark:border-[#3A3029] p-5 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8] dark:border-[#3A3029]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#6E7864]/15 text-[#6E7864] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-[#4A3B32] dark:text-[#FAF8F5] leading-tight">
              Lease Safety Index (0–100)
            </h4>
            <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6]">
              Real-time deposit protection & reversibility evaluation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] border border-[#E8E2D8] dark:border-[#3A3029] hover:border-[#C69C6D] transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5 text-[#C69C6D]" />
          <span>Move-Out Inspection Report (PDF)</span>
          <ArrowUpRight className="w-3 h-3 text-[#7C7267]" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
        {/* Semi-circular gauge meter */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-20 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 100 55" className="w-full h-full">
              {/* Background track arc */}
              <path
                d="M 8 50 A 42 42 0 0 1 92 50"
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                className="text-[#E8E2D8] dark:text-[#3A3029]"
                strokeLinecap="round"
              />
              {/* Colored score arc */}
              <path
                d="M 8 50 A 42 42 0 0 1 92 50"
                fill="none"
                stroke={score >= 95 ? '#6E7864' : score >= 80 ? '#C69C6D' : '#D97706'}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center">
              <span className="font-serif text-3xl font-bold text-[#4A3B32] dark:text-[#FAF8F5] leading-none">
                {score}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#7C7267] dark:text-[#B8B2A6] mt-0.5">
                / 100
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold text-[#6E7864] dark:text-[#C69C6D] text-center">
            {tierLabel}
          </span>
        </div>

        {/* Explanations & Tip */}
        <div className="md:col-span-8 space-y-3">
          <div className="bg-white dark:bg-[#1B1613] p-3.5 rounded-2xl border border-[#E8E2D8] dark:border-[#3A3029] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#4A3B32] dark:text-[#FAF8F5]">
              <AlertCircle className="w-3.5 h-3.5 text-[#C69C6D] shrink-0" />
              <span>Why this score:</span>
            </div>
            <p className="text-[#7C7267] dark:text-[#B8B2A6] leading-relaxed">
              {explanation}
            </p>
          </div>

          <div className="bg-[#F0ECE1]/60 dark:bg-[#251E19] p-3 rounded-2xl border border-[#E8E2D8]/60 dark:border-[#3A3029] flex items-start gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6E7864] dark:text-[#C69C6D] shrink-0 mt-0.5" />
            <span className="text-[#4A3B32] dark:text-[#FAF8F5]">
              {howToReach100Tip}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Legal Notice */}
      <div className="mt-4 pt-3 border-t border-[#E8E2D8]/80 dark:border-[#3A3029]/80 flex items-center justify-between text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
        <span>
          <strong>Notice:</strong> Reference document only. It is not legal advice or a binding agreement. Check your lease and talk to your landlord.
        </span>
      </div>
    </div>
  );
};
