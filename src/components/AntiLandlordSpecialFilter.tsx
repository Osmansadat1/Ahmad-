import React from 'react';
import { Shield, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { LANDLORD_SPECIAL_OPTIONS, LandlordSpecialId } from '../data/config';

interface AntiLandlordSpecialFilterProps {
  selectedFilters: Set<LandlordSpecialId>;
  onToggleFilter: (id: LandlordSpecialId) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const AntiLandlordSpecialFilter: React.FC<AntiLandlordSpecialFilterProps> = ({
  selectedFilters,
  onToggleFilter,
  isOpen,
  onToggleOpen,
}) => {
  return (
    <div className="bg-white dark:bg-[#201A16] rounded-2xl border border-[#E8E2D8] dark:border-[#3A3029] overflow-hidden transition-all shadow-2xs">
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[#FAF8F5] dark:hover:bg-[#251E19] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#C69C6D]/15 text-[#C69C6D] flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                Anti-"Landlord Special" Filter
              </span>
              {selectedFilters.size > 0 && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#6E7864] text-white">
                  {selectedFilters.size} active
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
              Mask rental eyesores with zero-demolition tension & adhesive solutions
            </p>
          </div>
        </div>

        <div className="text-[#7C7267] dark:text-[#B8B2A6] p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 pt-1 border-t border-[#E8E2D8] dark:border-[#3A3029] space-y-2 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LANDLORD_SPECIAL_OPTIONS.map((opt) => {
              const isSelected = selectedFilters.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onToggleFilter(opt.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-start gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF8F5] dark:bg-[#2B231D] border-[#C69C6D] text-[#4A3B32] dark:text-[#FAF8F5] shadow-xs'
                      : 'bg-white dark:bg-[#1B1613] border-[#E8E2D8] dark:border-[#3A3029] text-[#7C7267] dark:text-[#B8B2A6] hover:border-[#C69C6D]/60'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-white dark:text-[#1B1613]'
                        : 'border border-[#D9D1C1] dark:border-[#4A3B32]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold block truncate text-[11px] text-[#4A3B32] dark:text-[#FAF8F5]">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-[#7C7267] dark:text-[#B8B2A6] block leading-tight mt-0.5">
                      → {opt.solution}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-[#8C7D73] dark:text-[#B8B2A6] flex items-center gap-1.5 pt-1">
            <Sparkles className="w-3 h-3 text-[#C69C6D] shrink-0" />
            <span>Automatically injects damage-free masking directives into the design engine.</span>
          </div>
        </div>
      )}
    </div>
  );
};
