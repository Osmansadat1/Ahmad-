import React, { useState } from 'react';
import { Check, Copy, Heart, MessageSquare, Share2, Sparkles, ThumbsUp, Users, X } from 'lucide-react';

export interface RoommateCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  roomName: string;
  styleName: string;
  onBonusUnlocked?: () => void;
}

export const RoommateCollaborationModal: React.FC<RoommateCollaborationModalProps> = ({
  isOpen,
  onClose,
  roomId = 'room-living-modern',
  roomName,
  styleName,
  onBonusUnlocked,
}) => {
  const [copied, setCopied] = useState(false);
  const [voteCasted, setVoteCasted] = useState<'love' | 'pass' | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://woldeden.com';
  const shareableUrl = `${currentOrigin}/?room_id=${encodeURIComponent(roomId)}&ref=roommate&style=${encodeURIComponent(styleName)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVote = (type: 'love' | 'pass') => {
    setVoteCasted(type);
    onBonusUnlocked?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roommate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#4A3B32]/75 dark:bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#1E1814] border border-[#E8E2D8] dark:border-[#3A3029] rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-[#4A3B32] dark:text-[#FAF8F5]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F0ECE1] dark:hover:bg-[#251E19] text-[#7C7267] dark:text-[#B8B2A6] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#C69C6D]/15 text-[#C69C6D] flex items-center justify-center mb-4">
          <Users className="w-6 h-6" />
        </div>

        <h3 id="roommate-modal-title" className="font-serif text-2xl font-bold tracking-tight mb-2">
          Co-Design with Your Roommate
        </h3>
        <p className="text-xs sm:text-sm text-[#7C7267] dark:text-[#B8B2A6] leading-relaxed mb-6">
          Share your {roomName} ({styleName}) makeover. Your roommate can view the 100% lease-safe transformation instantly with zero login required.
        </p>

        {/* Shareable Link Box */}
        <div className="space-y-2 mb-6">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C7267] dark:text-[#B8B2A6]">
            Unique Guest Collaboration Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] dark:border-[#3A3029] bg-white dark:bg-[#15110E] text-xs font-mono text-[#4A3B32] dark:text-[#FAF8F5] select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4A3B32] dark:bg-[#C69C6D] text-white dark:text-[#1B1613] text-xs font-semibold hover:bg-[#382C24] transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Roommate Voting Simulation */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C69C6D]" />
              Roommate Voting Loop
            </span>
            <span className="text-[10px] text-[#6E7864] font-semibold bg-[#6E7864]/10 px-2 py-0.5 rounded-full">
              +1 Free Credit For Both
            </span>
          </div>
          <p className="text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
            When your roommate votes on this makeover (Swipe Right to approve or Left to propose tweaks), both of your accounts unlock bonus design credits!
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleVote('love')}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                voteCasted === 'love'
                  ? 'bg-[#6E7864] text-white border-[#6E7864]'
                  : 'bg-[#FAF8F5] dark:bg-[#1B1613] border-[#E8E2D8] dark:border-[#3A3029] text-[#4A3B32] dark:text-[#FAF8F5] hover:border-[#6E7864]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#C69C6D]" />
              <span>Vote: Love It (Swipe Right)</span>
            </button>

            <button
              type="button"
              onClick={() => handleVote('pass')}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                voteCasted === 'pass'
                  ? 'bg-[#4A3B32] text-white border-[#4A3B32]'
                  : 'bg-[#FAF8F5] dark:bg-[#1B1613] border-[#E8E2D8] dark:border-[#3A3029] text-[#4A3B32] dark:text-[#FAF8F5] hover:border-[#4A3B32]'
              }`}
            >
              <span>Vote: Tweak Look (Swipe Left)</span>
            </button>
          </div>

          {voteCasted && (
            <p className="text-xs text-[#6E7864] font-semibold flex items-center gap-1.5 pt-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Vote recorded! Bonus credit credited to this room session.</span>
            </p>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-[#8C7D73] dark:text-[#B8B2A6] text-center">
          Zero login required for your roommate to view the Before/After comparison.
        </p>
      </div>
    </div>
  );
};
