import { DesignStyle, RedesignPreferences, RoomType } from '../types/eden';

export interface SampleRoomPreset {
  id: string;
  title: string;
  subtitle: string;
  roomType: RoomType;
  recommendedStyle: DesignStyle;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
}

export const STYLE_PHOTO_URLS: Record<DesignStyle, string> = {
  'Organic Modern': '/images/style-organic-modern.jpg',
  Japandi: '/images/style-japandi.jpg',
  'Cozy Modern': '/images/style-dark-cozy.jpg',
  'Quiet Luxury': '/images/style-modern-classic.jpg',
  'Warm Minimalist': '/images/style-warm-minimalist.jpg',
  'Mid-Century Modern': '/images/style-mid-century.jpg',
  'Modern Classic': '/images/style-modern-classic.jpg',
  'Dark Cozy': '/images/style-dark-cozy.jpg',
  'Contemporary Eclectic': '/images/living-after-organic.jpg',
};

export const SAMPLE_ROOM_PRESETS: SampleRoomPreset[] = [
  {
    id: 'brooklyn-living',
    title: 'Sunlit Rental Living Room',
    subtitle:
      'Worn carpet and plain seating transformed with a textured wool rug, sheer linen drapes, and organic modern greenery',
    roomType: 'Living Room',
    recommendedStyle: 'Organic Modern',
    beforePhotoUrl: '/assets/aistudio/Gemini_Generated_Image_lyzgl9lyzgl9lyzg_282df9dd.jfif',
    afterPhotoUrl: '/assets/aistudio/Gemini_Generated_Image_22bny22bny22bny2_9d6fe41c.jfif',
  },
  {
    id: 'manhattan-kitchen',
    title: 'Rental Galley Kitchen',
    subtitle:
      'Worn honey-oak cabinets and stained laminate updated with removable sage wrap, faux-marble counters, and brass pulls',
    roomType: 'Kitchen',
    recommendedStyle: 'Modern Classic',
    beforePhotoUrl: '/assets/aistudio/Generated_Image_October_26__2026_-_6_35PM_31be12cf.jpg',
    afterPhotoUrl: '/assets/aistudio/Generated_Image_October_26__2026_-_6_34PM_f9f1e254.jpg',
  },
  {
    id: 'seattle-studio',
    title: 'Studio Living & Bed Zone',
    subtitle:
      'Compact studio divided into private sleeping and living zones with tension-track drapery and fluted console',
    roomType: 'Studio Apartment',
    recommendedStyle: 'Warm Minimalist',
    beforePhotoUrl: '/assets/aistudio/Gemini_Generated_Image_2vyiba2vyiba2vyi_3e84f124.jfif',
    afterPhotoUrl: '/assets/aistudio/Gemini_Generated_Image_1afo7x1afo7x1afo_d1cec24a.jfif',
  },
  {
    id: 'oakland-bedroom',
    title: 'Organized Bedroom & Wardrobe',
    subtitle:
      'Cluttered clothing racks and open closet transformed into a serene Japandi bedroom with woven storage',
    roomType: 'Bedroom',
    recommendedStyle: 'Japandi',
    beforePhotoUrl: '/assets/aistudio/Gemini_Generated_Image_ngm9svngm9svngm9_6a2dddaa.jfif',
    afterPhotoUrl: '/assets/aistudio/Gemini_Generated_Image_upl3taupl3taupl3_336677c1.jfif',
  },
  {
    id: 'chicago-bedroom',
    title: 'Calm Earth-Tone Bedroom',
    subtitle:
      'Sterile white rental bedroom elevated with an upholstered linen bed, layered drapes, and sage organic bedding',
    roomType: 'Bedroom',
    recommendedStyle: 'Japandi',
    beforePhotoUrl: '/assets/aistudio/Gemini_Generated_Image_8k32xh8k32xh8k32_4f1a842b.jfif',
    afterPhotoUrl: '/assets/aistudio/Gemini_Generated_Image_wmfnu8wmfnu8wmfn_d5ce3ec1.jfif',
  },
  {
    id: 'boston-bedroom',
    title: 'Vintage Radiator Bedroom',
    subtitle:
      'Bare rental bedroom with cast-iron radiator restyled with fluted walnut dresser, brass sconces, and olive tree',
    roomType: 'Bedroom',
    recommendedStyle: 'Dark Cozy',
    beforePhotoUrl: '/assets/aistudio/Generated_Image_October_26__2026_-_6_20PM_2292fe44.jpg',
    afterPhotoUrl: '/assets/aistudio/Generated_Image_October_26__2026_-_6_22PM_683e9506.jpg',
  },
  {
    id: 'austin-studio',
    title: 'Small Home Office Corner',
    subtitle:
      'Apartment corner desk transformed into a warm, focused workspace with cord-managed plug-in task lighting',
    roomType: 'Home Office',
    recommendedStyle: 'Warm Minimalist',
    beforePhotoUrl: '/images/workspace-before.jpg',
    afterPhotoUrl: '/images/workspace-after-minimalist.jpg',
  },
];

const STYLE_COLOR_GRADING: Record<
  DesignStyle,
  {
    filter: string;
    warmthOverlay: string;
    shadowTint: string;
    lightGlow: string;
  }
> = {
  'Organic Modern': {
    filter: 'saturate(1.12) contrast(1.05) brightness(1.02) sepia(0.08)',
    warmthOverlay: 'rgba(233, 225, 213, 0.14)',
    shadowTint: 'rgba(41, 72, 59, 0.06)',
    lightGlow: 'rgba(255, 224, 178, 0.26)',
  },
  Japandi: {
    filter: 'saturate(0.94) contrast(1.04) brightness(1.03) sepia(0.10)',
    warmthOverlay: 'rgba(244, 239, 230, 0.16)',
    shadowTint: 'rgba(92, 73, 56, 0.08)',
    lightGlow: 'rgba(255, 232, 196, 0.24)',
  },
  'Warm Minimalist': {
    filter: 'saturate(0.98) contrast(1.03) brightness(1.04) sepia(0.06)',
    warmthOverlay: 'rgba(248, 246, 240, 0.15)',
    shadowTint: 'rgba(156, 139, 122, 0.06)',
    lightGlow: 'rgba(255, 238, 210, 0.25)',
  },
  'Mid-Century Modern': {
    filter: 'saturate(1.22) contrast(1.07) brightness(1.01) sepia(0.14)',
    warmthOverlay: 'rgba(196, 125, 98, 0.12)',
    shadowTint: 'rgba(107, 66, 38, 0.08)',
    lightGlow: 'rgba(255, 212, 154, 0.28)',
  },
  'Modern Classic': {
    filter: 'saturate(1.05) contrast(1.08) brightness(1.01) sepia(0.05)',
    warmthOverlay: 'rgba(222, 212, 198, 0.12)',
    shadowTint: 'rgba(41, 43, 39, 0.08)',
    lightGlow: 'rgba(255, 230, 190, 0.22)',
  },
  'Dark Cozy': {
    filter: 'saturate(1.08) contrast(1.14) brightness(0.86) sepia(0.12)',
    warmthOverlay: 'rgba(41, 43, 39, 0.24)',
    shadowTint: 'rgba(25, 28, 24, 0.22)',
    lightGlow: 'rgba(255, 198, 130, 0.34)',
  },
  'Cozy Modern': {
    filter: 'saturate(1.08) contrast(1.14) brightness(0.86) sepia(0.12)',
    warmthOverlay: 'rgba(41, 43, 39, 0.24)',
    shadowTint: 'rgba(25, 28, 24, 0.22)',
    lightGlow: 'rgba(255, 198, 130, 0.34)',
  },
  'Quiet Luxury': {
    filter: 'saturate(1.05) contrast(1.08) brightness(1.01) sepia(0.05)',
    warmthOverlay: 'rgba(222, 212, 198, 0.12)',
    shadowTint: 'rgba(41, 43, 39, 0.08)',
    lightGlow: 'rgba(255, 230, 190, 0.22)',
  },
  'Contemporary Eclectic': {
    filter: 'saturate(1.18) contrast(1.06) brightness(1.02)',
    warmthOverlay: 'rgba(196, 125, 98, 0.10)',
    shadowTint: 'rgba(41, 72, 59, 0.08)',
    lightGlow: 'rgba(255, 220, 170, 0.24)',
  },
};

export function renderStyleCardVisual(style: DesignStyle): string {
  return STYLE_PHOTO_URLS[style] || STYLE_PHOTO_URLS['Organic Modern'];
}

export function renderRoomSceneToDataUrl(options: {
  presetId?: string;
  stage: 'before' | 'after';
  style?: DesignStyle;
  keepExistingFurniture?: boolean;
  noPainting?: boolean;
  noDrilling?: boolean;
  noHardwiring?: boolean;
  variationSeed?: number;
}): string {
  const preset =
    SAMPLE_ROOM_PRESETS.find((p) => p.id === options.presetId) || SAMPLE_ROOM_PRESETS[0];

  if (options.stage === 'before') {
    return preset.beforePhotoUrl;
  }

  // If user chose a specific style that matches a dedicated room photo, return high-res photo
  if (options.style && options.presetId === 'brooklyn-living') {
    if (options.style === 'Organic Modern') return preset.afterPhotoUrl;
    if (options.style === 'Mid-Century Modern') return '/images/style-mid-century.jpg';
    if (options.style === 'Dark Cozy') return '/images/style-dark-cozy.jpg';
    if (options.style === 'Modern Classic') return '/images/style-modern-classic.jpg';
  }

  return preset.afterPhotoUrl;
}

/**
 * Produces a high-resolution, photorealistic styled room image from an uploaded photo or sample room URL.
 * Applies editorial color grading, warm 2700K directional ambient lighting, and subtle tonal refinement
 * while preserving 100% of the real room's photographic architecture and furniture.
 */
export async function createDemoTransformationFromUpload(
  originalDataUrl: string,
  prefs: RedesignPreferences,
  variationSeed: number = 1
): Promise<string> {
  // Check if originalDataUrl corresponds to a known preset sample
  const matchingPreset = SAMPLE_ROOM_PRESETS.find(
    (p) =>
      p.beforePhotoUrl === originalDataUrl ||
      p.afterPhotoUrl === originalDataUrl
  );
  if (matchingPreset && matchingPreset.afterPhotoUrl) {
    return matchingPreset.afterPhotoUrl;
  }

  if (typeof document === 'undefined') {
    return originalDataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxDim = 1600;
      const scale = Math.min(1, maxDim / Math.max(img.width || 1280, img.height || 800));
      const width = Math.max(640, Math.round((img.width || 1280) * scale));
      const height = Math.max(420, Math.round((img.height || 800) * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(originalDataUrl);
        return;
      }

      const grading =
        STYLE_COLOR_GRADING[prefs.style] || STYLE_COLOR_GRADING['Organic Modern'];
      const seedOffset = ((variationSeed - 1) % 3) * 0.06;

      // 1. Draw the high-resolution real photograph with style-tuned editorial color grading
      ctx.save();
      ctx.filter = grading.filter;
      ctx.drawImage(img, 0, 0, width, height);
      ctx.restore();

      // 2. Apply subtle tonal material wash
      ctx.save();
      ctx.globalCompositeOperation =
        prefs.style === 'Dark Cozy' ? 'multiply' : 'soft-light';
      ctx.fillStyle = grading.warmthOverlay;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Add realistic warm 2700K directional window & plug-in lamp light bloom (no cartoon shapes)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const primaryGlow = ctx.createRadialGradient(
        width * (0.72 - seedOffset),
        height * 0.38,
        width * 0.04,
        width * (0.72 - seedOffset),
        height * 0.42,
        width * 0.58
      );
      primaryGlow.addColorStop(0, grading.lightGlow);
      primaryGlow.addColorStop(0.6, 'rgba(255, 228, 185, 0.08)');
      primaryGlow.addColorStop(1, 'rgba(255, 228, 185, 0)');
      ctx.fillStyle = primaryGlow;
      ctx.fillRect(0, 0, width, height);

      const secondaryGlow = ctx.createRadialGradient(
        width * (0.24 + seedOffset),
        height * 0.48,
        width * 0.02,
        width * (0.24 + seedOffset),
        height * 0.5,
        width * 0.42
      );
      secondaryGlow.addColorStop(0, grading.lightGlow);
      secondaryGlow.addColorStop(1, 'rgba(255, 220, 175, 0)');
      ctx.fillStyle = secondaryGlow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 4. Subtle editorial vignette to ground floor and corners
      ctx.save();
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.32,
        width * 0.5,
        height * 0.5,
        width * 0.75
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, grading.shadowTint);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => {
      resolve(originalDataUrl);
    };
    img.src = originalDataUrl;
  });
}
