import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  badgeColor?: 'sage' | 'walnut' | 'sand' | 'neutral';
  badgeRight?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  label?: string;
  sublabel?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  sublabel,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click or Esc key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const getBadgeClasses = (color?: SelectOption['badgeColor']) => {
    switch (color) {
      case 'sage':
        return 'bg-[#E5EBE1] text-[#4E5D48] border-[#D5DCD0]';
      case 'walnut':
        return 'bg-[#4A3B32] text-[#FAF8F5] border-[#4A3B32]';
      case 'sand':
        return 'bg-[#F0ECE1] text-[#7C7267] border-[#E8E2D8]';
      default:
        return 'bg-[#F0ECE1] text-[#6E7864] border-[#E8E2D8]';
    }
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={id} className="block text-xs font-semibold text-[#4A3B32]">
            {label}
          </label>
          {sublabel && <span className="text-[11px] text-[#7C7267]">{sublabel}</span>}
        </div>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border text-left text-sm transition-all cursor-pointer select-none ${
            isOpen
              ? 'border-[#4A3B32] ring-2 ring-[#4A3B32]/10 bg-white'
              : 'border-[#E8E2D8] hover:border-[#C69C6D] hover:bg-white'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {selectedOption?.icon && (
              <span className="shrink-0 text-[#7C7267]">{selectedOption.icon}</span>
            )}
            <div className="truncate flex items-center gap-2 min-w-0">
              <span className="font-medium text-[#4A3B32] truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              {selectedOption?.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getBadgeClasses(
                    selectedOption.badgeColor
                  )}`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedOption?.badgeRight && (
              <span className="text-xs font-semibold text-[#6E7864] bg-[#F0ECE1] px-2 py-0.5 rounded-md border border-[#E8E2D8]">
                {selectedOption.badgeRight}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-[#7C7267] transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#4A3B32]' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu Popover */}
        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className="absolute left-0 right-0 mt-1.5 z-40 max-h-72 overflow-y-auto rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] shadow-lg py-1 text-sm focus:outline-hidden backdrop-blur-xs"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`group px-3.5 py-2.5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#F0ECE1] text-[#4A3B32]'
                      : 'hover:bg-[#F0ECE1]/80 text-[#4A3B32]'
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    {option.icon && (
                      <span className="mt-0.5 shrink-0 text-[#7C7267] group-hover:text-[#4A3B32]">
                        {option.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm ${isSelected ? 'font-semibold text-[#4A3B32]' : 'font-medium'}`}>
                          {option.label}
                        </span>
                        {option.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border shrink-0 ${getBadgeClasses(
                              option.badgeColor
                            )}`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <p className="text-[11px] text-[#7C7267] mt-0.5 leading-snug line-clamp-2">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-center">
                    {option.badgeRight && (
                      <span className="text-[11px] font-medium text-[#6E7864] bg-white/80 px-2 py-0.5 rounded-md border border-[#E8E2D8]">
                        {option.badgeRight}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#4A3B32] shrink-0 stroke-[2.5]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
