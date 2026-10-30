import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Download,
  FileText,
  Info,
  Lock,
  RefreshCw,
  Share2,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import {
  EMAIL_BONUS,
  LANDLORD_SPECIAL_OPTIONS,
  LandlordSpecialId,
  PRESET_OPTIONS,
  PresetId,
  ROOM_OPTIONS,
  RoomTypeId,
  START_CREDITS,
  STYLE_OPTIONS,
  StyleId,
  trackEvent,
  validateEmailAddress,
} from '../data/config';
import { downscaleRoomPhoto } from '../utils/imageCompressor';
import { calculateReversibilityScore } from '../utils/reversibilityScore';
import { exportShareableStory } from '../utils/generateShareableStory';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ReversibilityScoreCard } from './ReversibilityScoreCard';
import { AntiLandlordSpecialFilter } from './AntiLandlordSpecialFilter';
import { BudgetHardwareCart } from './BudgetHardwareCart';
import { LeaseParserModal } from './LeaseParserModal';

export interface DesignStudioProps {
  isOpen: boolean;
  onOpenShopDrawer: () => void;
  onScrollToPricing: () => void;
  onUserPhotoChange: (photoUrl: string, hasCustom: boolean) => void;
  initialRoomType?: RoomTypeId;
  initialStyle?: StyleId;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({
  isOpen,
  onOpenShopDrawer,
  onScrollToPricing,
  onUserPhotoChange,
  initialRoomType = 'Living Room',
  initialStyle = 'Organic Modern',
}) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Studio selections
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeId>(initialRoomType);
  const [selectedStyle, setSelectedStyle] = useState<StyleId>(initialStyle);
  const [selectedPresets, setSelectedPresets] = useState<Set<PresetId>>(
    new Set(['90s Honey-Oak Cabinet Wrap'])
  );

  // Anti-Landlord-Special filters
  const [selectedLandlordFilters, setSelectedLandlordFilters] = useState<Set<LandlordSpecialId>>(
    new Set(['boob-light', 'dated-cabinets'])
  );
  const [isLandlordFilterOpen, setIsLandlordFilterOpen] = useState<boolean>(true);

  // Lease Clause Parser (Feature flag off by default)
  const [isLeaseParserEnabled, setIsLeaseParserEnabled] = useState<boolean>(false);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState<boolean>(false);
  const [confirmedLeaseConstraints, setConfirmedLeaseConstraints] = useState<string[]>([]);

  // Photos
  const [currentBeforePhoto, setCurrentBeforePhoto] = useState<string>(
    ROOM_OPTIONS[0].beforePhoto
  );
  const [currentAfterPhoto, setCurrentAfterPhoto] = useState<string>(
    ROOM_OPTIONS[0].sampleAfterPhoto
  );
  const [hasCustomPhoto, setHasCustomPhoto] = useState<boolean>(false);
  const [customPhotoFileName, setCustomPhotoFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Reversibility evaluation calculation
  const reversibilityEval = useMemo(() => {
    return calculateReversibilityScore(
      Array.from(selectedPresets),
      Array.from(selectedLandlordFilters),
      confirmedLeaseConstraints.length
    );
  }, [selectedPresets, selectedLandlordFilters, confirmedLeaseConstraints]);

  // Credit system stored in localStorage
  const [credits, setCredits] = useState<number>(() => {
    if (typeof window === 'undefined') return START_CREDITS;
    const stored = localStorage.getItem('eden_canvas_credits');
    if (stored !== null && !isNaN(Number(stored))) {
      return Number(stored);
    }
    localStorage.setItem('eden_canvas_credits', String(START_CREDITS));
    return START_CREDITS;
  });

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [hasGeneratedResult, setHasGeneratedResult] = useState<boolean>(false);

  // Email Gate state
  const [isEmailUnlocked, setIsEmailUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('eden_canvas_email_unlocked') === 'true';
  });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCanvasBlurred, setIsCanvasBlurred] = useState<boolean>(false);

  // Focus heading when studio opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        headingRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Restore cached preview on mount if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedAfter = localStorage.getItem('eden_canvas_cached_after');
      const cachedBefore = localStorage.getItem('eden_canvas_cached_before');
      if (cachedAfter && cachedBefore) {
        setCurrentBeforePhoto(cachedBefore);
        setCurrentAfterPhoto(cachedAfter);
        setHasGeneratedResult(true);
      }
    }
  }, []);

  // Sync sample photos when room type changes (only if no custom upload)
  const handleSelectRoom = (room: RoomTypeId) => {
    setSelectedRoom(room);
    if (!hasCustomPhoto) {
      const found = ROOM_OPTIONS.find((r) => r.id === room);
      if (found) {
        setCurrentBeforePhoto(found.beforePhoto);
        setCurrentAfterPhoto(found.sampleAfterPhoto);
        onUserPhotoChange(found.beforePhoto, false);
      }
    }
  };

  const handleSelectStyle = (style: StyleId) => {
    setSelectedStyle(style);
  };

  const handleTogglePreset = (preset: PresetId) => {
    setSelectedPresets((prev) => {
      const next = new Set(prev);
      if (next.has(preset)) {
        next.delete(preset);
      } else {
        next.add(preset);
      }
      return next;
    });
  };

  // Process and downscale user upload
  const processUploadedFile = async (file: File) => {
    setUploadError(null);
    setGenerationError(null);
    try {
      const downscaled = await downscaleRoomPhoto(file);
      setCurrentBeforePhoto(downscaled.dataUrl);
      setHasCustomPhoto(true);
      setCustomPhotoFileName(file.name);
      onUserPhotoChange(downscaled.dataUrl, true);
      trackEvent('upload', {
        fileName: file.name,
        sizeBytes: downscaled.sizeBytes,
        roomType: selectedRoom,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process image.';
      setUploadError(msg);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Generate Makeover
  const handleGenerateMakeover = async () => {
    if (credits <= 0) {
      onScrollToPricing();
      return;
    }

    // Deduct 1 credit immediately
    const nextCredits = credits - 1;
    setCredits(nextCredits);
    try {
      localStorage.setItem('eden_canvas_credits', String(nextCredits));
    } catch {
      // storage unavailable
    }

    setIsGenerating(true);
    setProgressPercent(15);
    setGenerationError(null);
    setIsCanvasBlurred(false);

    trackEvent('generate', {
      roomType: selectedRoom,
      style: selectedStyle,
      presets: Array.from(selectedPresets),
      creditsRemaining: nextCredits,
    });

    // Realistic progress animation up to 99%
    const progressTimer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 98) {
          clearInterval(progressTimer);
          return 99;
        }
        return prev + 14;
      });
    }, 400);

    try {
      // Make backend request to /api/generate-design
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: currentBeforePhoto,
          roomType: selectedRoom,
          style: selectedStyle,
          presets: Array.from(selectedPresets),
          landlordFilters: Array.from(selectedLandlordFilters),
          leaseConstraints: confirmedLeaseConstraints,
        }),
      });

      const payload = await response.json().catch(() => null);

      clearInterval(progressTimer);

      if (response.ok && payload?.success && payload?.image) {
        // Success with AI Generated image
        finalizeGenerationResult(payload.image);
      } else {
        // Graceful fallback to curated sample makeover
        const fallbackRoom = ROOM_OPTIONS.find((r) => r.id === selectedRoom) || ROOM_OPTIONS[0];
        finalizeGenerationResult(fallbackRoom.sampleAfterPhoto);
      }
    } catch (err: unknown) {
      clearInterval(progressTimer);
      // Fallback gracefully to demo concept
      const fallbackRoom = ROOM_OPTIONS.find((r) => r.id === selectedRoom) || ROOM_OPTIONS[0];
      finalizeGenerationResult(fallbackRoom.sampleAfterPhoto);
    }
  };

  const finalizeGenerationResult = (afterUrl: string) => {
    setProgressPercent(99);

    // Save locally
    try {
      localStorage.setItem('eden_canvas_cached_before', currentBeforePhoto);
      localStorage.setItem('eden_canvas_cached_after', afterUrl);
    } catch {
      // ignore
    }

    if (!isEmailUnlocked) {
      // Blur canvas at 99% and show modal
      setIsCanvasBlurred(true);
      setIsEmailModalOpen(true);
      setCurrentAfterPhoto(afterUrl);
    } else {
      // Already unlocked: complete to 100%
      setProgressPercent(100);
      setIsGenerating(false);
      setIsCanvasBlurred(false);
      setCurrentAfterPhoto(afterUrl);
      setHasGeneratedResult(true);
    }
  };

  // Email submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEmailAddress(emailInput);
    if (!validation.valid) {
      setEmailError(validation.error || 'Invalid email.');
      return;
    }

    setEmailError(null);
    setIsEmailUnlocked(true);
    setIsEmailModalOpen(false);
    setIsCanvasBlurred(false);
    setIsGenerating(false);
    setProgressPercent(100);
    setHasGeneratedResult(true);

    // Award EMAIL_BONUS credits
    const updatedCredits = credits + EMAIL_BONUS;
    setCredits(updatedCredits);

    try {
      localStorage.setItem('eden_canvas_email', emailInput.trim().toLowerCase());
      localStorage.setItem('eden_canvas_email_unlocked', 'true');
      localStorage.setItem('eden_canvas_credits', String(updatedCredits));
    } catch {
      // ignore
    }

    trackEvent('unlock', { email: emailInput.trim().toLowerCase() });
  };

  const handleNotNow = () => {
    setIsEmailModalOpen(false);
    setIsGenerating(false);
    // Keep canvas blurred with an unlock overlay button
    setIsCanvasBlurred(true);
    setHasGeneratedResult(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentAfterPhoto;
    link.download = `eden-canvas-${selectedRoom.toLowerCase()}-${selectedStyle.toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <section
      id="studio"
      className="relative w-full py-12 sm:py-20 bg-[#FAF8F5] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] border-b border-[#E8E2D8] dark:border-[#3A3029] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Studio Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E8E2D8] dark:border-[#3A3029]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0ECE1] dark:bg-[#251E19] text-[#6E7864] dark:text-[#C69C6D] mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C69C6D]" />
              <span>DESIGN STUDIO · 100% LEASE SAFE</span>
            </div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#4A3B32] dark:text-[#FAF8F5] focus:outline-none"
            >
              Transform Your Rental
            </h2>
          </div>

          {/* Credits pill */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onScrollToPricing}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] text-xs font-semibold text-[#4A3B32] dark:text-[#FAF8F5] hover:border-[#C69C6D] transition-colors shadow-2xs cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-[#C69C6D]" />
              <span>{credits} {credits === 1 ? 'Credit' : 'Credits'}</span>
              <span className="text-[10px] text-[#C69C6D] font-bold underline ml-1">
                + Add more
              </span>
            </button>
          </div>
        </div>

        {/* 5-Step Controls Grid + Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* =======================================================
              LEFT PANEL: 5 STEPS IN ONE CLEAN PANEL
             ======================================================= */}
          <div className="lg:col-span-6 bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            {/* STEP 1: PHOTO UPLOAD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A3B32] dark:text-[#FAF8F5]">
                  Step 1 · Room Photo
                </label>
                <span className="text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
                  Max 12 MB (JPG, PNG, WebP)
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Upload room image"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#C69C6D] bg-[#F0ECE1] dark:bg-[#1E1814]'
                    : 'border-[#E8E2D8] dark:border-[#3A3029] bg-[#FAF8F5] dark:bg-[#1B1613] hover:border-[#C69C6D]'
                }`}
              >
                {hasCustomPhoto ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={currentBeforePhoto}
                      alt="Your uploaded room"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E8E2D8] dark:border-[#3A3029] shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#6E7864] shrink-0" />
                        <span className="text-xs font-semibold truncate text-[#4A3B32] dark:text-[#FAF8F5]">
                          {customPhotoFileName || 'Your Room Photo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7C7267] dark:text-[#B8B2A6] mt-0.5">
                        Downscaled to 1280px · Click or drag to replace
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] shadow-2xs hover:bg-[#F0ECE1] cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="py-3">
                    <div className="w-10 h-10 rounded-full bg-[#F0ECE1] dark:bg-[#251E19] text-[#C69C6D] flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#4A3B32] dark:text-[#FAF8F5]">
                      Upload your room photo
                    </p>
                    <p className="text-[11px] text-[#7C7267] dark:text-[#B8B2A6] mt-0.5">
                      Drag and drop, or tap to browse
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="mt-2 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{uploadError}</span>
                </p>
              )}
            </div>

            {/* STEP 2: ROOM TYPE PILLS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3B32] dark:text-[#FAF8F5] mb-2">
                Step 2 · Room Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROOM_OPTIONS.map((room) => {
                  const isSelected = selectedRoom === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => handleSelectRoom(room.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] border-[#4A3B32] dark:border-[#C69C6D] shadow-xs'
                          : 'bg-[#FAF8F5] dark:bg-[#1B1613] text-[#7C7267] dark:text-[#B8B2A6] border-[#E8E2D8] dark:border-[#3A3029] hover:bg-[#F0ECE1]'
                      }`}
                    >
                      {room.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: STYLE PILLS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3B32] dark:text-[#FAF8F5] mb-2">
                Step 3 · Design Aesthetic
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectStyle(style.id)}
                      className={`py-2 px-3.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] border-[#4A3B32] dark:border-[#C69C6D] shadow-xs'
                          : 'bg-[#FAF8F5] dark:bg-[#1B1613] text-[#7C7267] dark:text-[#B8B2A6] border-[#E8E2D8] dark:border-[#3A3029] hover:bg-[#F0ECE1]'
                      }`}
                      title={style.description}
                    >
                      {style.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
                {STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.description}
              </p>
            </div>

            {/* STEP 4: DAMAGE-FREE PRESET TOGGLES (MULTI) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3B32] dark:text-[#FAF8F5] mb-2">
                Step 4 · Damage-Free Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_OPTIONS.map((preset) => {
                  const isChecked = selectedPresets.has(preset.id);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleTogglePreset(preset.id)}
                      className={`p-2.5 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-[#FAF8F5] dark:bg-[#1B1613] border-[#C69C6D] text-[#4A3B32] dark:text-[#FAF8F5]'
                          : 'bg-[#FAF8F5] dark:bg-[#1B1613] border-[#E8E2D8] dark:border-[#3A3029] text-[#7C7267] dark:text-[#B8B2A6]'
                      }`}
                    >
                      <span className="text-xs font-medium leading-tight">{preset.label}</span>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ml-2 ${
                          isChecked
                            ? 'bg-[#4A3B32] dark:bg-[#C69C6D] border-[#4A3B32] dark:border-[#C69C6D] text-white'
                            : 'border-[#E8E2D8] dark:border-[#3A3029]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ANTI-LANDLORD-SPECIAL FILTER */}
            <div>
              <AntiLandlordSpecialFilter
                selectedFilters={selectedLandlordFilters}
                onToggleFilter={(id) => {
                  setSelectedLandlordFilters((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                }}
                isOpen={isLandlordFilterOpen}
                onToggleOpen={() => setIsLandlordFilterOpen(!isLandlordFilterOpen)}
              />
            </div>

            {/* LEASE PARSER (Feature Flag, Off by Default) */}
            <div className="p-3.5 bg-white dark:bg-[#201A16] rounded-2xl border border-[#E8E2D8] dark:border-[#3A3029] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6E7864]" />
                  <span className="text-xs font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                    Lease Clause Parser
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#C69C6D]/15 text-[#C69C6D] font-bold">
                    Experimental
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLeaseParserEnabled}
                    onChange={(e) => setIsLeaseParserEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#E8E2D8] peer-focus:outline-none rounded-full peer dark:bg-[#3A3029] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A3B32] dark:peer-checked:bg-[#C69C6D]"></div>
                </label>
              </div>

              {isLeaseParserEnabled ? (
                <div className="space-y-2 pt-1 border-t border-[#E8E2D8] dark:border-[#3A3029]">
                  <p className="text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
                    Upload your lease PDF or photo. PII is redacted locally before extracting wall &amp; alteration rules.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLeaseModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#FAF8F5] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] border border-[#D9D1C1] dark:border-[#4A3B32] hover:border-[#C69C6D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#C69C6D]" />
                    <span>
                      {confirmedLeaseConstraints.length > 0
                        ? `Lease Configured (${confirmedLeaseConstraints.length} active constraints)`
                        : 'Upload Lease Document'}
                    </span>
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-[#8C7D73] dark:text-[#B8B2A6]">
                  Optional: Enable to scan your lease for custom painting &amp; wall anchor restrictions.
                </p>
              )}
            </div>

            {/* STEP 5: ACTION TRIGGER BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateMakeover}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm sm:text-base text-[#FAF8F5] dark:text-[#1B1613] bg-[#4A3B32] dark:bg-[#C69C6D] hover:bg-[#382C24] dark:hover:bg-[#B88E5F] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C69C6D] dark:text-[#1B1613]" />
                    <span>Synthesizing Makeover ({progressPercent}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C69C6D] dark:text-[#1B1613]" />
                    <span>Generate Makeover (1 Credit)</span>
                  </>
                )}
              </button>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7C7267] dark:text-[#B8B2A6] px-1">
                <span>Zero demolition · 100% deposit safe</span>
                <button
                  type="button"
                  onClick={onScrollToPricing}
                  className="text-[#C69C6D] font-semibold hover:underline cursor-pointer"
                >
                  {credits} {credits === 1 ? 'credit' : 'credits'} remaining
                </button>
              </div>

              {generationError && (
                <p className="mt-2 text-xs text-rose-700 dark:text-rose-400">
                  {generationError}
                </p>
              )}
            </div>
          </div>

          {/* =======================================================
              RIGHT PANEL: INTERACTIVE BEFORE/AFTER CANVAS
             ======================================================= */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] rounded-3xl p-3 sm:p-4 shadow-xs overflow-hidden">
              {/* Generation Progress Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 z-30 bg-[#FAF8F5]/90 dark:bg-[#1B1613]/90 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-full max-w-sm bg-white dark:bg-[#251E19] p-6 rounded-2xl border border-[#E8E2D8] dark:border-[#3A3029] shadow-lg">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#4A3B32] dark:text-[#FAF8F5] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C69C6D] animate-spin" />
                        Generating {selectedStyle} {selectedRoom}
                      </span>
                      <span className="font-mono text-[#6E7864] font-bold">{progressPercent}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#F0ECE1] dark:bg-[#1B1613] overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-[#C69C6D] to-[#4A3B32] transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6]">
                      Applying lease-safe presets and warm natural lighting...
                    </p>
                  </div>
                </div>
              )}

              {/* Canvas Header Meta */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#4A3B32] dark:text-[#FAF8F5]">
                    {selectedRoom}
                  </span>
                  <span className="text-[#8C7D73]">·</span>
                  <span className="text-[#6E7864] dark:text-[#C69C6D] font-semibold">
                    {selectedStyle}
                  </span>
                </div>

                {hasGeneratedResult && !isCanvasBlurred && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        exportShareableStory({
                          beforeImageUrl: currentBeforePhoto,
                          afterImageUrl: currentAfterPhoto,
                          roomType: selectedRoom,
                          styleName: selectedStyle,
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A3B32] dark:text-[#FAF8F5] bg-[#FAF8F5] dark:bg-[#1B1613] border border-[#E8E2D8] dark:border-[#3A3029] px-2.5 py-1 rounded-lg hover:border-[#C69C6D] transition-colors cursor-pointer"
                      title="Export 9:16 vertical Before/After story image"
                    >
                      <Smartphone className="w-3 h-3 text-[#C69C6D]" />
                      <span>9:16 Story</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A3B32] dark:text-[#FAF8F5] bg-[#FAF8F5] dark:bg-[#1B1613] border border-[#E8E2D8] dark:border-[#3A3029] px-2.5 py-1 rounded-lg hover:border-[#C69C6D] transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Slider with optional blur filter for deferred email gate */}
              <div
                className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                  isCanvasBlurred ? 'filter blur-[20px] pointer-events-none select-none' : ''
                }`}
              >
                <BeforeAfterSlider
                  beforeImage={currentBeforePhoto}
                  afterImage={currentAfterPhoto}
                  beforeLabel={hasCustomPhoto ? 'Your Room' : 'Before'}
                  afterLabel={
                    hasGeneratedResult
                      ? `Eden Makeover (${selectedStyle})`
                      : hasCustomPhoto
                      ? 'Sample makeover'
                      : 'Demo concept'
                  }
                  beforeAlt="Original room photo"
                  afterAlt="Damage-free redesign output"
                />
              </div>

              {/* Overlay Unlock Button if user clicked "Not now" and canvas remains blurred */}
              {isCanvasBlurred && !isEmailModalOpen && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-[#FAF8F5]/95 dark:bg-[#1B1613]/95 border border-[#E8E2D8] dark:border-[#3A3029] p-6 rounded-3xl shadow-xl max-w-xs space-y-3">
                    <div className="w-10 h-10 rounded-full bg-[#F0ECE1] dark:bg-[#251E19] text-[#C69C6D] flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3B32] dark:text-[#FAF8F5]">
                      Makeover Ready
                    </h3>
                    <p className="text-xs text-[#7C7267] dark:text-[#B8B2A6]">
                      Unlock your render and claim 4 bonus credits.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsEmailModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-full bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] text-xs font-semibold hover:bg-[#382C24] transition-colors cursor-pointer"
                    >
                      Unlock Design
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 1. REVERSIBILITY SCORE (0-100 "Lease Safety Index") & MOVE-OUT REPORT */}
            <ReversibilityScoreCard
              evaluation={reversibilityEval}
              roomType={selectedRoom}
              style={selectedStyle}
              presets={Array.from(selectedPresets)}
              landlordFilters={Array.from(selectedLandlordFilters)}
              confirmedClauses={confirmedLeaseConstraints}
            />

            {/* 2. BUDGET-LOCKED HARDWARE CART */}
            <BudgetHardwareCart
              roomType={selectedRoom}
              style={selectedStyle}
              presets={Array.from(selectedPresets)}
            />

            {/* Button directly under the studio canvas to open Shoppable Drawer */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#251E19] rounded-2xl border border-[#E8E2D8] dark:border-[#3A3029]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C69C6D]" />
                <span className="text-xs font-semibold text-[#4A3B32] dark:text-[#FAF8F5]">
                  Need damage-free items for this room?
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenShopDrawer}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F0ECE1] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#C69C6D] border border-[#E8E2D8] dark:border-[#3A3029] hover:border-[#C69C6D] transition-colors cursor-pointer"
              >
                Browse Damage-Free Picks →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          DEFERRED EMAIL GATE MODAL (Accessible)
         ======================================================= */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#4A3B32]/75 dark:bg-black/80 transition-opacity"
            onClick={handleNotNow}
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-gate-title"
            className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#1B1613] border border-[#E8E2D8] dark:border-[#3A3029] rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-[#4A3B32] dark:text-[#FAF8F5]"
          >
            <button
              type="button"
              onClick={handleNotNow}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7C7267] dark:text-[#B8B2A6] hover:bg-[#F0ECE1] dark:hover:bg-[#251E19] transition-colors cursor-pointer"
              aria-label="Close modal for now"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0ECE1] dark:bg-[#251E19] text-[#6E7864] dark:text-[#C69C6D] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C69C6D]" />
              <span>Your Makeover is Ready</span>
            </div>

            <h3 id="email-gate-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Enter your email to unlock your design and get 4 bonus credits.
            </h3>

            <p className="text-xs sm:text-sm text-[#7C7267] dark:text-[#B8B2A6] leading-relaxed mb-6">
              Claim 4 bonus credits (7 credits total) and download your full-resolution Before/After comparison. We’ll also email you the curated damage-free shopping list.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="gate-email" className="block text-xs font-semibold mb-1.5">
                  Your email address
                </label>
                <input
                  id="gate-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#D9D1C1] dark:border-[#3A3029] bg-white dark:bg-[#251E19] text-sm text-[#4A3B32] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
                  autoFocus
                />
                {emailError && (
                  <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-400 font-medium">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-full font-semibold text-xs sm:text-sm bg-[#4A3B32] dark:bg-[#C69C6D] text-[#FAF8F5] dark:text-[#1B1613] hover:bg-[#382C24] transition-colors cursor-pointer"
                >
                  Unlock Design &amp; Claim 4 Credits
                </button>
                <button
                  type="button"
                  onClick={handleNotNow}
                  className="py-3 px-5 rounded-full font-medium text-xs sm:text-sm text-[#7C7267] dark:text-[#B8B2A6] hover:bg-[#F0ECE1] dark:hover:bg-[#251E19] transition-colors cursor-pointer"
                >
                  Not now
                </button>
              </div>
            </form>

            <div className="mt-5 flex items-center gap-2 text-[11px] text-[#7C7267] dark:text-[#B8B2A6]">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#6E7864]" />
              <span>We respect your inbox. No spam. One-click unsubscribe anytime.</span>
            </div>
          </div>
        </div>
      )}

      {/* LEASE PARSER MODAL */}
      <LeaseParserModal
        isOpen={isLeaseModalOpen}
        onClose={() => setIsLeaseModalOpen(false)}
        onConfirmClauses={(clauses) => setConfirmedLeaseConstraints(clauses)}
        initialConfirmedClauses={confirmedLeaseConstraints}
      />
    </section>
  );
};
