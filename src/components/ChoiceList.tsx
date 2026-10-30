import React from 'react';
import { Check } from 'lucide-react';

export interface ChoiceItem {
  id: string;
  label: string;
  description?: string;
  image?: string;
  swatches?: string[];
}

interface ChoiceListProps {
  /** 'single' = radio list (exactly one choice). 'multi' = checkbox list (any number of choices). */
  mode: 'single' | 'multi';
  items: ChoiceItem[];
  /** Selected ids. For 'single' pass an array with one id (or empty). */
  selected: string[];
  onToggle: (id: string) => void;
  ariaLabel: string;
  /** Show items in two columns on wider screens. */
  twoColumns?: boolean;
  /** Use smaller rows. */
  dense?: boolean;
}

export const ChoiceList: React.FC<ChoiceListProps> = ({
  mode,
  items,
  selected,
  onToggle,
  ariaLabel,
  twoColumns = false,
  dense = false,
}) => {
  const isSingle = mode === 'single';

  return (
    <ul
      role={isSingle ? 'radiogroup' : 'group'}
      aria-label={ariaLabel}
      className={`rounded-xl border border-[#E8E1D6] bg-[#FFFFFF] overflow-hidden ${
        twoColumns ? 'sm:grid sm:grid-cols-2' : ''
      }`}
    >
      {items.map((item, i) => {
        const isOn = selected.includes(item.id);
        return (
          <li
            key={item.id}
            className={`border-[#E8E1D6] ${i > 0 ? 'border-t' : ''} ${
              twoColumns ? (i === 1 ? 'sm:border-t-0' : '') + (i % 2 === 1 ? ' sm:border-l' : '') : ''
            }`}
          >
            <button
              type="button"
              role={isSingle ? 'radio' : 'checkbox'}
              aria-checked={isOn}
              onClick={() => onToggle(item.id)}
              className={`w-full flex items-center gap-3 text-left cursor-pointer transition-colors focus:outline-none focus-visible:bg-[#D9E7DC]/50 ${
                dense ? 'px-3 py-2.5' : 'px-4 py-3'
              } ${isOn ? 'bg-[#D9E7DC]/55' : 'bg-[#FFFFFF] hover:bg-[#FAF7F2]'}`}
            >
              {/* Indicator: circle for single choice, square for multiple choice */}
              <span
                aria-hidden="true"
                className={`shrink-0 w-5 h-5 flex items-center justify-center border-2 transition-colors ${
                  isSingle ? 'rounded-full' : 'rounded-md'
                } ${isOn ? 'border-[#1F4D3D] bg-[#1F4D3D] text-[#FFFFFF]' : 'border-[#C9C0B2] bg-[#FFFFFF]'}`}
              >
                {isOn &&
                  (isSingle ? (
                    <span className="w-2 h-2 rounded-full bg-[#FFFFFF]" />
                  ) : (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ))}
              </span>

              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-lg object-cover bg-[#EFE5D6]"
                />
              )}

              <span className="flex-1 min-w-0">
                <span className={`block font-semibold text-[#1C2420] ${dense ? 'text-xs' : 'text-sm'}`}>
                  {item.label}
                </span>
                {item.description && (
                  <span className="block text-[11px] sm:text-xs text-[#667067] mt-0.5 leading-snug">
                    {item.description}
                  </span>
                )}
              </span>

              {item.swatches && (
                <span className="hidden sm:flex items-center gap-1 shrink-0">
                  {item.swatches.map((hex, k) => (
                    <span key={k} className="w-3 h-3 rounded-full border border-black/15" style={{ backgroundColor: hex }} />
                  ))}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
