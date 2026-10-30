import React, { useCallback, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Download,
  Eye,
  FileText,
  ImageIcon,
  Layers,
  Plus,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { CustomSelect, SelectOption } from './CustomSelect';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ShoppableDrawer } from './ShoppableDrawer';
import { DeferredEmailModal } from './DeferredEmailModal';
import { PricingModal } from './PricingModal';
import { DepositProtectionWidget } from './DepositProtectionWidget';
import { MoveOutCertificateModal } from './MoveOutCertificateModal';
import { exportComparisonImage } from '../utils/imageExporter';

export interface StudioWorkspaceProps {
  onExploreStylesClick?: () => void;
  onPricingClick?: () => void;
}

// 3. Integrated Clean Dropdown Controls (RoomGPT Architecture)
const ROOM_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Living Room', label: 'Living Room' },
  { value: 'Studio Apartment', label: 'Studio Apartment' },
  { value: 'Bedroom', label: 'Bedroom' },
  { value: 'Rental Bathroom', label: 'Rental Bathroom' },
  { value: 'Outdated Kitchen', label: 'Outdated Kitchen' },
];

const THEME_OPTIONS: SelectOption[] = [
  {
    value: 'Organic Modern',
    label: 'Organic Modern',
    description: 'Warm woods, textured linen, neutral tones',
  },
  {
    value: 'Japandi',
    label: 'Japandi',
    description: 'Minimalist lines, light oak, muted earth shades',
  },
  {
    value: 'Quiet Luxury',
    label: 'Quiet Luxury',
    description: 'Rich walnut, brass accents, layered gallery styling',
  },
  {
    value: 'Cozy Modern',
    label: 'Cozy Modern',
    description: 'Plush textiles, ambient plug-in warmth, soft bouclé',
  },
];

const TRANSFORMATION_MODE_OPTIONS: SelectOption[] = [
  {
    value: 'Full Lease-Safe Overhaul',
    label: 'Full Lease-Safe Overhaul',
    description: '100% reversible, zero drill, preserves all finishes',
    badge: 'Default',
    badgeColor: 'sage',
  },
  {
    value: 'Cabinet & Tile Wrap',
    label: 'Cabinet & Tile Wrap',
    description: 'Specialized in peel-and-stick vinyl wraps & surface concealment',
  },
  {
    value: 'Floor Masking with Rugs',
    label: 'Floor Masking with Rugs',
    description: 'Focus on washable layered rugs, runners & vinyl plank floats',
  },
  {
    value: 'Tension Space Divider',
    label: 'Tension Space Divider',
    description: 'Focus on floor-to-ceiling tension drapes & zone partitioning',
  },
];

const QUALITY_OPTIONS: SelectOption[] = [
  {
    value: 'pro',
    label: 'Pro',
    badge: 'Default',
    badgeColor: 'neutral',
    description: 'Balanced detail and speed',
    badgeRight: '1 credit',
  },
  {
    value: 'ultra',
    label: 'Ultra',
    badge: 'NEW',
    badgeColor: 'sage',
    description: '8K high-depth realistic textures',
    badgeRight: '2 credits',
  },
];

interface PresetSample {
  id: string;
  room: string;
  theme: string;
  label: string;
  sublabel?: string;
  beforeUrl: string;
  afterUrl: string;
  depositAtRisk?: string;
  estimatedCost?: string;
}

const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'living-preset',
    room: 'Living Room',
    theme: 'Organic Modern',
    label: 'Stained-Carpet Living Room',
    sublabel: 'Layered washable rugs',
    beforeUrl: '/assets/aistudio/Gemini_Generated_Image_lyzgl9lyzgl9lyzg_282df9dd.jfif',
    afterUrl: '/assets/aistudio/Gemini_Generated_Image_22bny22bny22bny2_9d6fe41c.jfif',
    depositAtRisk: '$2,200',
    estimatedCost: '~$185',
  },
  {
    id: 'studio-preset',
    room: 'Studio Apartment',
    theme: 'Japandi',
    label: 'Cramped Studio',
    sublabel: 'Tension curtain partition',
    beforeUrl: '/assets/aistudio/Gemini_Generated_Image_2vyiba2vyiba2vyi_3e84f124.jfif',
    afterUrl: '/assets/aistudio/Gemini_Generated_Image_1afo7x1afo7x1afo_d1cec24a.jfif',
    depositAtRisk: '$2,400',
    estimatedCost: '~$195',
  },
  {
    id: 'kitchen-preset',
    room: 'Outdated Kitchen',
    theme: 'Quiet Luxury',
    label: 'Outdated 90s Kitchen',
    sublabel: 'Cabinet vinyl wrap',
    beforeUrl: '/assets/aistudio/Generated_Image_October_26__2026_-_6_35PM_31be12cf.jpg',
    afterUrl: '/assets/aistudio/Generated_Image_October_26__2026_-_6_34PM_f9f1e254.jpg',
    depositAtRisk: '$1,950',
    estimatedCost: '~$140',
  },
  {
    id: 'bath-preset',
    room: 'Rental Bathroom',
    theme: 'Japandi',
    label: 'Sterile Rental Bathroom',
    sublabel: 'Magnetic frame & tension rack',
    beforeUrl: '/assets/aistudio/Gemini_Generated_Image_8k32xh8k32xh8k32_4f1a842b.jfif',
    afterUrl: '/assets/aistudio/Gemini_Generated_Image_wmfnu8wmfnu8wmfn_d5ce3ec1.jfif',
    depositAtRisk: '$1,500',
    estimatedCost: '~$125',
  },
];

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({
  onExploreStylesClick,
  onPricingClick,
}) => {
  // 1. Credit Engine State (Stored in localStorage, default 3)
  const [credits, setCredits] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    const stored = localStorage.getItem('eden_canvas_credits');
    if (stored !== null && !isNaN(Number(stored))) {
      return Number(stored);
    }
    localStorage.setItem('eden_canvas_credits', '3');
    return 3;
  });

  const [isEmailUnlocked, setIsEmailUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('eden_canvas_unlocked') === 'true';
  });

  const [, setUserEmail] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('eden_canvas_email') || '';
  });

  // Modal States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Dropdown States (Sidebar Architecture)
  const [selectedRoom, setSelectedRoom] = useState<string>('Living Room');
  const [selectedTheme, setSelectedTheme] = useState<string>('Organic Modern');
  const [selectedMode, setSelectedMode] = useState<string>('Full Lease-Safe Overhaul');
  const [selectedQuality, setSelectedQuality] = useState<string>('pro');

  // Photo & Canvas State
  const [uploadedImage, setUploadedImage] = useState<string>(PRESET_SAMPLES[0].beforeUrl);
  const [uploadedImageName, setUploadedImageName] = useState<string>('Stained-Carpet Living Room (Sample)');
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('living-preset');
  const [isDragging, setIsDragging] = useState(false);

  // Generation & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatusText, setProgressStatusText] = useState('');
  const [isCanvasBlurred, setIsCanvasBlurred] = useState(false);
  const [hasCompletedMakeover, setHasCompletedMakeover] = useState(false);
  const [activeBeforeUrl, setActiveBeforeUrl] = useState<string>(PRESET_SAMPLES[0].beforeUrl);
  const [activeAfterUrl, setActiveAfterUrl] = useState<string>(PRESET_SAMPLES[0].afterUrl);
  const [isExportingComparison, setIsExportingComparison] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const studioCanvasRef = useRef<HTMLDivElement | null>(null);

  // Required credit cost based on quality
  const requiredCreditCost = selectedQuality === 'ultra' ? 2 : 1;

  // Handle preset room change
  const applyPreset = useCallback((preset: PresetSample) => {
    setSelectedPresetId(preset.id);
    setSelectedRoom(preset.room);
    setSelectedTheme(preset.theme);
    setUploadedImage(preset.beforeUrl);
    setUploadedImageName(`${preset.label} (Sample)`);
    setIsCustomUpload(false);
    setActiveBeforeUrl(preset.beforeUrl);
    setActiveAfterUrl(preset.afterUrl);
    setHasCompletedMakeover(false);
  }, []);

  // Handle User File Upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = typeof reader.result === 'string' ? reader.result : '';
      if (resultStr) {
        setUploadedImage(resultStr);
        setUploadedImageName(file.name);
        setIsCustomUpload(true);
        setSelectedPresetId('');
        setActiveBeforeUrl(resultStr);
        setHasCompletedMakeover(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Resolve after makeover image based on room & style
  const resolveAfterImage = useCallback(() => {
    const match = PRESET_SAMPLES.find(
      (p) => p.room === selectedRoom && p.theme === selectedTheme
    );
    if (match) return match.afterUrl;

    const roomMatch = PRESET_SAMPLES.find((p) => p.room === selectedRoom);
    if (roomMatch) return roomMatch.afterUrl;

    return PRESET_SAMPLES[0].afterUrl;
  }, [selectedRoom, selectedTheme]);

  // Current preset for ROI metrics
  const activePresetMetrics = PRESET_SAMPLES.find((p) => p.room === selectedRoom) || PRESET_SAMPLES[0];

  // 1. Zero-Friction Mock Fallback Engine (No API Dependency)
  const handleGenerateMakeover = async () => {
    // If user lacks credits, open pricing modal
    if (credits < requiredCreditCost) {
      setIsPricingModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setProgressPercent(10);
    setProgressStatusText('Analyzing architectural boundary & lighting...');
    setIsCanvasBlurred(false);

    // Realistic 4-step progress sequence:
    // Step 1: "Analyzing architectural boundary & lighting..."
    // Step 2: "Detecting lease constraints & zero-drill parameters..."
    // Step 3: `Synthesizing removable ${selectedTheme} elements...`
    // Step 4: "Finalizing lease-safety verification..."
    const steps = [
      { pct: 25, text: 'Analyzing architectural boundary & lighting...' },
      { pct: 55, text: 'Detecting lease constraints & zero-drill parameters...' },
      { pct: 85, text: `Synthesizing removable ${selectedTheme} elements...` },
      { pct: 99, text: 'Finalizing lease-safety verification...' },
    ];

    let currentStepIdx = 0;
    const stepInterval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setProgressPercent(steps[currentStepIdx].pct);
        setProgressStatusText(steps[currentStepIdx].text);
      } else {
        clearInterval(stepInterval);
        setProgressPercent(99);

        // Deferred Email Blur Gate check on first generation
        if (!isEmailUnlocked) {
          setIsCanvasBlurred(true);
          setProgressStatusText('99% — Almost ready! Verify email to unlock high-res render.');
          setIsEmailModalOpen(true);
        } else {
          // Already unlocked visitor: decrement credits and complete render
          setTimeout(() => {
            const nextCredits = Math.max(0, credits - requiredCreditCost);
            setCredits(nextCredits);
            try {
              localStorage.setItem('eden_canvas_credits', String(nextCredits));
            } catch {
              // ignore
            }
            setProgressPercent(100);
            setIsGenerating(false);
            setHasCompletedMakeover(true);
            setActiveBeforeUrl(uploadedImage);
            setActiveAfterUrl(resolveAfterImage());
          }, 350);
        }
      }
    }, 450);
  };

  // Deferred Email Gate Unlock
  const handleEmailUnlock = (submittedEmail: string) => {
    setUserEmail(submittedEmail);
    setIsEmailUnlocked(true);
    setIsEmailModalOpen(false);

    // Initial reward 5 credits minus cost
    const initialAward = 5;
    const finalBalance = initialAward - requiredCreditCost;
    setCredits(finalBalance);
    try {
      localStorage.setItem('eden_canvas_email', submittedEmail);
      localStorage.setItem('eden_canvas_unlocked', 'true');
      localStorage.setItem('eden_canvas_credits', String(finalBalance));
    } catch {
      // ignore
    }

    setProgressPercent(100);
    setIsCanvasBlurred(false);
    setIsGenerating(false);
    setHasCompletedMakeover(true);
    setActiveBeforeUrl(uploadedImage);
    setActiveAfterUrl(resolveAfterImage());

    setTimeout(() => {
      studioCanvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };

  // Pricing Top-Up Plan Select
  const handleSelectPlan = (planId: string, addedCredits: number) => {
    const newBal = credits + addedCredits;
    setCredits(newBal);
    try {
      localStorage.setItem('eden_canvas_credits', String(newBal));
    } catch {
      // ignore
    }
    setIsPricingModalOpen(false);
  };

  // Download raw after image
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = activeAfterUrl;
    link.download = `eden-canvas-${selectedRoom.toLowerCase().replace(/\s+/g, '-')}-${selectedTheme.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Side-by-Side Viral Image Exporter (Client-Side HTML5 Canvas)
  const handleSaveComparisonImage = async () => {
    try {
      setIsExportingComparison(true);
      await exportComparisonImage({
        beforeUrl: activeBeforeUrl,
        afterUrl: activeAfterUrl,
        roomName: selectedRoom,
        styleName: selectedTheme,
        filename: `eden-canvas-${selectedRoom.toLowerCase().replace(/\s+/g, '-')}-makeover.jpg`,
      });
    } catch (err) {
      console.error('Failed to export comparison image:', err);
    } finally {
      setIsExportingComparison(false);
    }
  };

  return (
    <section className="relative w-full bg-[#FAF8F5] pt-6 pb-16 lg:pt-10 lg:pb-24 border-b border-[#E8E2D8] text-[#4A3B32]">
      {/* Soft background aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,#F0ECE1_0%,transparent_70%)] pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header & Sub-Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8E2D8]/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0ECE1] text-[#6E7864] border border-[#D5DCD0] mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C69C6D]" aria-hidden="true" />
              <span>ROOMGPT-INSPIRED STUDIO · 100% LEASE SAFE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B32] tracking-tight">
              Design Canvas
            </h1>
          </div>

          {/* Credit Top-Right Pill */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPricingModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D8] text-xs font-semibold text-[#4A3B32] hover:bg-[#F0ECE1] hover:border-[#C69C6D] transition-all shadow-2xs cursor-pointer group"
              title="Click to recharge credits"
            >
              <Coins className="w-3.5 h-3.5 text-[#C69C6D] group-hover:scale-110 transition-transform" />
              <span>{credits} Credits</span>
              <span className="w-4 h-4 rounded-full bg-[#F0ECE1] text-[#6E7864] flex items-center justify-center text-[10px] ml-0.5">
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </span>
            </button>

            {onExploreStylesClick && (
              <button
                type="button"
                onClick={onExploreStylesClick}
                className="text-xs font-medium text-[#7C7267] hover:text-[#4A3B32] transition-colors"
              >
                Back to overview
              </button>
            )}
          </div>
        </div>

        {/* Studio Workspace Layout: Sidebar Controls + Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================
              LEFT COLUMN: Studio Sidebar Architecture (Clean Dropdowns)
             ======================================================== */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E2D8] p-5 sm:p-6 shadow-sm space-y-5">
            {/* 1. UPLOAD DROPZONE */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4A3B32]">
                  1. Room Photo
                </label>
                <span className="text-[11px] text-[#7C7267]">JPG, PNG or WebP</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
                className="hidden"
                aria-label="Upload room image"
              />

              {/* Dashed Dropzone Card */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFileUpload(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#C69C6D] bg-[#F0ECE1]'
                    : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-[#C69C6D] hover:bg-[#F5F1E8]'
                }`}
              >
                {uploadedImage ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={uploadedImage}
                      alt={uploadedImageName}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E8E2D8] shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6E7864] shrink-0" />
                        <span className="text-xs font-semibold text-[#4A3B32] truncate">
                          {uploadedImageName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7C7267] mt-0.5">
                        ...or drag and drop another image to replace
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-[#4A3B32] bg-white rounded-lg border border-[#E8E2D8] hover:bg-[#F0ECE1] shrink-0 shadow-2xs cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="w-10 h-10 rounded-full bg-[#F0ECE1] text-[#4A3B32] flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5 text-[#C69C6D]" />
                    </div>
                    <p className="text-xs font-semibold text-[#4A3B32]">Upload your room</p>
                    <p className="text-[11px] text-[#7C7267] mt-0.5">
                      ...or drag and drop an image
                    </p>
                  </div>
                )}
              </div>

              {/* 4 Pre-Loaded Demo Room Presets */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-[#7C7267] mb-1.5">
                  <span className="font-semibold text-[#4A3B32]">Pre-Loaded Demo Presets:</span>
                  <span>100% lease-safe</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_SAMPLES.map((sample) => {
                    const isSelected = selectedPresetId === sample.id && !isCustomUpload;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => applyPreset(sample)}
                        className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#4A3B32] text-white border-[#4A3B32] shadow-xs'
                            : 'bg-[#FAF8F5] text-[#4A3B32] border-[#E8E2D8] hover:bg-[#F0ECE1] hover:border-[#C69C6D]'
                        }`}
                      >
                        <div className="text-xs font-semibold truncate leading-tight">
                          {sample.label}
                        </div>
                        {sample.sublabel && (
                          <div
                            className={`text-[10px] truncate mt-0.5 ${
                              isSelected ? 'text-[#FAF8F5]/80' : 'text-[#7C7267]'
                            }`}
                          >
                            {sample.sublabel}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. DROPDOWN: "SELECT ROOM TYPE" */}
            <CustomSelect
              label="Select Room Type"
              value={selectedRoom}
              onChange={setSelectedRoom}
              options={ROOM_TYPE_OPTIONS}
            />

            {/* 3. DROPDOWN: "SELECT DESIGN THEME" */}
            <CustomSelect
              label="Select Design Theme"
              value={selectedTheme}
              onChange={setSelectedTheme}
              options={THEME_OPTIONS}
            />

            {/* 4. DROPDOWN: "SELECT RENTER MODE" */}
            <CustomSelect
              label="Select Renter Mode"
              sublabel="100% Lease-Safe"
              value={selectedMode}
              onChange={setSelectedMode}
              options={TRANSFORMATION_MODE_OPTIONS}
            />

            {/* 5. DROPDOWN: "SELECT QUALITY" (MULTI-TIER) */}
            <CustomSelect
              label="Select Quality"
              value={selectedQuality}
              onChange={setSelectedQuality}
              options={QUALITY_OPTIONS}
            />

            {/* 6. PRIMARY ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateMakeover}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-[#FAF8F5] bg-[#4A3B32] hover:bg-[#382C24] active:bg-[#2A201A] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C69C6D]" />
                    <span>Generating Makeover ({progressPercent}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C69C6D] group-hover:scale-110 transition-transform" />
                    <span>Generate Makeover</span>
                    <span className="text-xs font-medium text-[#FAF8F5]/90 bg-black/25 px-2.5 py-0.5 rounded-full ml-1">
                      {requiredCreditCost} {requiredCreditCost === 1 ? 'Credit' : 'Credits'}
                    </span>
                  </>
                )}
              </button>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7C7267] px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6E7864]" />
                  Zero damage guaranteed
                </span>
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="text-[#6E7864] font-semibold hover:underline cursor-pointer"
                >
                  Need more credits?
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Interactive Canvas & Makeover Output
             ======================================================== */}
          <div ref={studioCanvasRef} className="lg:col-span-7 space-y-5">
            <div className="relative bg-white rounded-3xl border border-[#E8E2D8] p-3 sm:p-4 shadow-sm overflow-hidden">
              {/* If Generating: Progress Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 z-20 bg-[#FAF8F5]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-lg">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#4A3B32] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C69C6D] animate-spin" />
                        Generating {selectedTheme} {selectedRoom}
                      </span>
                      <span className="font-mono text-[#6E7864] font-bold">{progressPercent}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#F0ECE1] overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-[#C69C6D] to-[#4A3B32] transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <p className="text-xs text-[#7C7267] min-h-[32px] flex items-center justify-center font-medium">
                      {progressStatusText}
                    </p>
                  </div>
                </div>
              )}

              {/* Header meta over the canvas */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#4A3B32]">
                    {selectedRoom}
                  </span>
                  <span className="text-[#8C7D73]">·</span>
                  <span className="text-[#6E7864] font-semibold">{selectedTheme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium bg-[#F0ECE1] text-[#6E7864] px-2.5 py-0.5 rounded-full">
                    {selectedMode}
                  </span>
                  {hasCompletedMakeover && (
                    <div className="flex flex-wrap items-center gap-1.5 ml-1">
                      {/* B. Landlord-Ready Move-Out Inspection Report (PDF) */}
                      <button
                        type="button"
                        onClick={() => setIsCertificateModalOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A3B32] bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded-lg hover:bg-[#F0ECE1] hover:border-[#6E7864] transition-colors cursor-pointer shadow-2xs"
                        title="Open Landlord-Ready Move-Out Inspection Report (PDF)"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#6E7864]" />
                        <span>Export Move-Out Certificate (PDF)</span>
                      </button>

                      {/* C. Side-by-Side Viral Comparison Exporter Button */}
                      <button
                        type="button"
                        onClick={handleSaveComparisonImage}
                        disabled={isExportingComparison}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A3B32] bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded-lg hover:bg-[#F0ECE1] hover:border-[#C69C6D] transition-colors cursor-pointer shadow-2xs"
                        title="Stitch before & after side-by-side with 16:9 ratio and watermark"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#C69C6D]" />
                        <span>{isExportingComparison ? 'Exporting...' : 'Download Comparison Graphic'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A3B32] bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded-lg hover:bg-[#F0ECE1] hover:border-[#C69C6D] transition-colors cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Image</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Canvas Split Screen Slider */}
              <div
                className={`relative transition-all duration-500 rounded-2xl overflow-hidden ${
                  isCanvasBlurred ? 'filter backdrop-blur-md opacity-40 scale-[0.99]' : ''
                }`}
              >
                <BeforeAfterSlider
                  beforeImage={activeBeforeUrl}
                  afterImage={activeAfterUrl}
                  beforeLabel={isCustomUpload ? 'Your Original Room' : 'Original Room'}
                  afterLabel={`Eden Concept (${selectedTheme})`}
                  isDemoConcept={false}
                  styleName={selectedTheme}
                  roomTypeName={selectedRoom}
                />
              </div>

              {/* Renter Safeguards Note */}
              <div className="mt-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#7C7267]">
                <span className="italic text-[11px]">
                  Mode: <strong>{selectedMode}</strong> · Quality: <strong>{selectedQuality.toUpperCase()}</strong>
                </span>
                <span className="text-[11px] text-[#6E7864] font-medium">
                  ✓ Reversible · No Drilling Required
                </span>
              </div>
            </div>

            {/* ========================================================
                2. LEASE-SAFE DEPOSIT PROTECTION & BUDGET ESTIMATOR WIDGET
               ======================================================== */}
            <DepositProtectionWidget
              roomType={selectedRoom}
              depositAtRisk={activePresetMetrics.depositAtRisk}
              estimatedCost={activePresetMetrics.estimatedCost}
            />

            {/* ========================================================
                5. RESPONSIVE SHOPPABLE HARDWARE DRAWER (Affiliate Tag)
               ======================================================== */}
            <ShoppableDrawer activeRoom={selectedRoom} />
          </div>
        </div>
      </div>

      {/* Deferred Email Modal */}
      <DeferredEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onUnlock={handleEmailUnlock}
        currentRoomType={selectedRoom}
        currentStyle={selectedTheme}
      />

      {/* Pricing Top-Up Modal (RoomGPT 3-Tier Pricing) */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSelectPlan={handleSelectPlan}
        currentCredits={credits}
      />

      {/* Landlord Move-Out Inspection Certificate Modal */}
      <MoveOutCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        roomName={selectedRoom}
        styleName={selectedTheme}
        beforeUrl={activeBeforeUrl}
        afterUrl={activeAfterUrl}
      />
    </section>
  );
};
