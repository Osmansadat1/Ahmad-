import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles, X } from 'lucide-react';

interface DeferredEmailModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUnlock: (email: string) => void;
  currentRoomType?: string;
  currentStyle?: string;
}

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'throwawaymail.com',
  'guerrillamail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'burnermail.io',
  'fakeinbox.com',
  'maildrop.cc',
  'mohmal.com',
]);

export const DeferredEmailModal: React.FC<DeferredEmailModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
  currentRoomType = 'Living Room',
  currentStyle = 'Japandi',
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (val: string): string | null => {
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      return 'Please enter your email to reveal your render.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please provide a valid email address (e.g., name@gmail.com).';
    }
    const domain = trimmed.split('@')[1];
    if (domain && DISPOSABLE_DOMAINS.has(domain)) {
      return 'Disposable emails are blocked. Please use your standard personal or work email.';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('eden_canvas_email', email.trim().toLowerCase());
        localStorage.setItem('eden_canvas_unlocked', 'true');
      }
    } catch {
      // Storage quota or privacy sandbox exception
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onUnlock(email.trim().toLowerCase());
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with intense blur */}
      <div
        className="fixed inset-0 bg-[#4A3B32]/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E6E0D4] rounded-3xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden text-[#4A3B32]">
        {/* Decorative corner accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#F0ECE1] rounded-full pointer-events-none opacity-60" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#E8E2D2] rounded-full pointer-events-none opacity-40" />

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#7A6B62] hover:text-[#4A3B32] hover:bg-[#F0ECE1] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0ECE1] text-[#6E7864] border border-[#D5DCD0] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C69C6D]" />
            <span>High-Resolution AI Render Synthesized</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B32] tracking-tight leading-snug">
            Your Lease-Safe Transformation is Ready
          </h2>

          {/* Subtext */}
          <p className="mt-2 text-sm text-[#7A6B62] leading-relaxed">
            Enter your email to unlock your high-resolution render, download your damage-free shopping list, and claim{' '}
            <span className="font-semibold text-[#6E7864]">2 bonus credits</span> (5 total).
          </p>

          {/* Benefits bullets */}
          <div className="my-5 p-4 bg-[#F0ECE1]/70 rounded-2xl border border-[#E6E0D4] space-y-2">
            <div className="flex items-start gap-2.5 text-xs text-[#5C4C41]">
              <CheckCircle2 className="w-4 h-4 text-[#6E7864] shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Damage Guarantee:</strong> Every element complies with lease constraints (peel-and-stick, tension mounts, plug-ins).
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#5C4C41]">
              <CheckCircle2 className="w-4 h-4 text-[#6E7864] shrink-0 mt-0.5" />
              <span>
                <strong>5 Free Credits Total:</strong> Instant unlock + 4 additional render variations saved to your session.
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#5C4C41]">
              <CheckCircle2 className="w-4 h-4 text-[#6E7864] shrink-0 mt-0.5" />
              <span>
                <strong>Interactive Before/After Slider:</strong> Smooth touch/mouse draggable inspection with hardware shopping guide.
              </span>
            </div>
          </div>

          {/* Email Capture Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email-gate-input" className="block text-xs font-semibold text-[#4A3B32] mb-1.5">
                Where should we send your design & unlock your credits?
              </label>
              <input
                id="email-gate-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="you@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-[#D9D1C1] bg-white text-sm text-[#4A3B32] placeholder-[#A3968B] focus:outline-hidden focus:ring-2 focus:ring-[#C69C6D] focus:border-[#C69C6D] transition-all shadow-inner"
                disabled={isSubmitting}
                autoFocus
              />
              {error && (
                <p className="mt-1.5 text-xs text-rose-700 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-[#FAF8F5] bg-[#4A3B32] hover:bg-[#382C24] active:bg-[#2A201A] transition-all shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <span>Unlocking Your Design...</span>
              ) : (
                <>
                  <span>Unlock Design & Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#C69C6D] group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Renter Security note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#8C7D73]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6E7864]" />
            <span>We respect your inbox. No spam. One-click unsubscribe at any time.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
