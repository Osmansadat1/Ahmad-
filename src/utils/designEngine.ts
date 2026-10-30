import {
  ActionPlanStep,
  AnalyticsEventName,
  AnalyticsEventRecord,
  BudgetCalculationSummary,
  BudgetIntent,
  BudgetTier,
  CreditState,
  DesignStyle,
  ExistingFurnitureMode,
  PreservedArchitecture,
  ProductRecommendation,
  RedesignPreferences,
  RentalRules,
  RoomType,
} from '../types/eden';

export const ROOM_TYPES: { id: RoomType; label: string; description: string }[] = [
  { id: 'Living Room', label: 'Living Room', description: 'Sofa, coffee table, lighting, and gathering zone' },
  { id: 'Bedroom', label: 'Bedroom', description: 'Bed layering, nightstands, and calm ambient lamps' },
  { id: 'Studio Apartment', label: 'Studio Apartment', description: 'Multi-zone small-space layout without adding walls' },
  { id: 'Home Office', label: 'Home Office', description: 'Desk ergonomics, backdrop styling, and task light' },
  { id: 'Dining Area', label: 'Dining Area', description: 'Dining table anchor rug, chairs, and warm glow' },
];

export const DESIGN_STYLES: {
  id: DesignStyle;
  label: string;
  tagline: string;
  materials: string;
  swatches: [string, string, string, string];
}[] = [
  {
    id: 'Organic Modern',
    label: 'Organic Modern',
    tagline: 'Warm travertine, walnut wood, slub linen, and sculptural ceramics',
    materials: 'Bouclé, raw oak, oatmeal linen, olive greenery',
    swatches: ['#F8F6F0', '#E9E1D5', '#6E4E37', '#A8B5A0'],
  },
  {
    id: 'Japandi',
    label: 'Japandi',
    tagline: 'Scandinavian warmth fused with Japanese wabi-sabi restraint',
    materials: 'Light ash wood, paper lanterns, low-profile silhouettes',
    swatches: ['#F4EFE6', '#D9CFC1', '#5C4938', '#8D9B84'],
  },
  {
    id: 'Warm Minimalist',
    label: 'Warm Minimalist',
    tagline: 'Uncluttered calm with tonal creams, soft shadows, and tactile wool',
    materials: 'High-pile wool, travertine stone, unbleached cotton',
    swatches: ['#F8F6F0', '#E8E0D5', '#9C8B7A', '#1C2420'],
  },
  {
    id: 'Mid-Century Modern',
    label: 'Mid-Century Modern',
    tagline: 'Tapered walnut legs, warm amber glass, and tailored geometry',
    materials: 'Teak wood, cognac leather accents, woven wool',
    swatches: ['#F5EFE6', '#C2623F', '#6B4226', '#153A2E'],
  },
  {
    id: 'Modern Classic',
    label: 'Modern Classic',
    tagline: 'Timeless tailored upholstery, brass accents, and balanced symmetry',
    materials: 'Herringbone textiles, antique brass, dark walnut',
    swatches: ['#F6F3ED', '#DED4C6', '#4E3B2C', '#153A2E'],
  },
  {
    id: 'Dark Cozy',
    label: 'Dark Cozy',
    tagline: 'Moody ambient warmth achieved through textiles and warm pools of light',
    materials: 'Charcoal wool, walnut wood, warm 2200K linen lamps',
    swatches: ['#1C2420', '#4A3B31', '#C2623F', '#E9E1D5'],
  },
  {
    id: 'Contemporary Eclectic',
    label: 'Contemporary Eclectic',
    tagline: 'Collected art, warm textures, and personal character layered on a calm neutral base',
    materials: 'Woven kilim textiles, warm oak, ceramic lamps, framed prints',
    swatches: ['#FAF7F2', '#1F4D3D', '#C2623F', '#EFE5D6'],
  },
];

export const EXISTING_FURNITURE_MODES: {
  id: ExistingFurnitureMode;
  label: string;
  description: string;
}[] = [
  {
    id: 'keep_all',
    label: 'Keep all existing furniture where possible.',
    description: 'Prioritize rearranging and styling around every major piece you already own.',
  },
  {
    id: 'keep_selected',
    label: 'Keep selected furniture.',
    description: 'Anchor the room around specific pieces you select below and refresh the rest.',
  },
  {
    id: 'replace_necessary',
    label: 'Replace only items that are necessary.',
    description: 'Reuse functional furniture first and only suggest replacements where scale or comfort requires it.',
  },
  {
    id: 'mostly_empty',
    label: 'Start with a mostly empty room.',
    description: 'Explore a full freestanding furniture and decor layout from scratch.',
  },
];

export const IDENTIFIABLE_FURNITURE_CHIPS: string[] = [
  'Sofa / Sectional',
  'Bed Frame & Mattress',
  'Desk & Task Chair',
  'Coffee Table',
  'Dining Table & Chairs',
  'Bookcase / Shelving',
  'TV Stand / Media Console',
  'Area Rug',
  'Floor / Table Lamps',
];

export const BUDGET_INTENT_OPTIONS: {
  id: BudgetIntent;
  label: string;
  description: string;
}[] = [
  {
    id: 'existing_only',
    label: 'Use existing items only.',
    description: 'Focus 100% on free layout adjustments, decluttering, and styling what you already own ($0 spend).',
  },
  {
    id: 'few_affordable',
    label: 'Spend on a few affordable upgrades.',
    description: 'Reuse existing furniture and add 1–3 high-impact, low-cost accents like lighting or textiles.',
  },
  {
    id: 'refresh_most',
    label: 'Refresh most of the room.',
    description: 'Combine existing anchor pieces with a coordinated area rug, curtains, lamps, and accent decor.',
  },
  {
    id: 'inspiration_no_limit',
    label: 'Explore inspiration without a fixed budget.',
    description: 'View the complete design vision and optional upgrades without a strict spending ceiling.',
  },
];

export const MAX_BUDGET_PRESETS: { label: string; value: number | null; mappedTier: BudgetTier }[] = [
  { label: '$0 (Free Only)', value: 0, mappedTier: 'Under $100' },
  { label: '$50 Max', value: 50, mappedTier: 'Under $100' },
  { label: '$100 Max', value: 100, mappedTier: 'Under $100' },
  { label: '$250 Max', value: 250, mappedTier: '$100–$300' },
  { label: '$500 Max', value: 500, mappedTier: '$300–$500' },
  { label: '$1,000 Max', value: 1000, mappedTier: '$500–$1,000' },
  { label: 'No Fixed Limit', value: null, mappedTier: 'Inspiration Only' },
];

export const IMPROVEMENT_GOALS: string[] = [
  'Make the room feel cozier.',
  'Make the room look more expensive.',
  'Improve the lighting.',
  'Make a small room feel better organized.',
  'Make the room less cluttered.',
  'Add more warmth and color.',
  'Improve the layout and walking paths.',
  'Make the room look more like my Pinterest inspiration.',
];

export const BUDGET_OPTIONS: {
  id: BudgetTier;
  label: string;
  tierOrder: number;
  defaultMaxDollars: number | null;
  strategy: string;
}[] = [
  {
    id: 'Under $100',
    label: 'Under $100',
    tierOrder: 1,
    defaultMaxDollars: 100,
    strategy:
      'Prioritize rearranging existing furniture ($0) and 1–2 low-cost accents such as throw pillow covers, woven storage baskets, or a compact plug-in table lamp.',
  },
  {
    id: '$100–$300',
    label: '$100–$300',
    tierOrder: 2,
    defaultMaxDollars: 300,
    strategy:
      'Reuse your primary furniture and anchor the space with a plug-in floor lamp, tension-rod linen curtains, and layered textiles.',
  },
  {
    id: '$300–$500',
    label: '$300–$500',
    tierOrder: 3,
    defaultMaxDollars: 500,
    strategy:
      'Combine a room-defining flatweave area rug, ambient freestanding lighting, and cohesive soft furnishings.',
  },
  {
    id: '$500–$1,000',
    label: '$500–$1,000',
    tierOrder: 4,
    defaultMaxDollars: 1000,
    strategy:
      'Complete a full renter-safe room refresh with an area rug, freestanding accent table, layered lighting, and drapery.',
  },
  {
    id: 'Inspiration Only',
    label: 'Inspiration Only',
    tierOrder: 5,
    defaultMaxDollars: null,
    strategy:
      'Prioritize the complete visual design concept without restricting recommendations to a fixed spending cap.',
  },
];

export const RENTAL_RULE_DEFINITIONS: {
  key: keyof RentalRules;
  label: string;
  explanation: string;
  defaultEnabled: boolean;
  isPrimaryToggle: boolean;
}[] = [
  {
    key: 'noPainting',
    label: 'No Painting',
    explanation: 'Keep existing wall colors and finishes untouched.',
    defaultEnabled: true,
    isPrimaryToggle: true,
  },
  {
    key: 'noDrilling',
    label: 'No Drilling',
    explanation: 'Avoid wall-mounted items or brackets that require new screw or nail holes.',
    defaultEnabled: true,
    isPrimaryToggle: true,
  },
  {
    key: 'noHardwiring',
    label: 'No Hardwiring',
    explanation: 'Use plug-in or battery-powered lighting instead of hardwired ceiling/wall fixtures.',
    defaultEnabled: true,
    isPrimaryToggle: true,
  },
  {
    key: 'noPermanentAdhesives',
    label: 'No Permanent Adhesives',
    explanation: 'Avoid heavy-duty tapes or wall adhesives that could peel paint or drywall paper.',
    defaultEnabled: true,
    isPrimaryToggle: true,
  },
  {
    key: 'removableDecorOnly',
    label: 'Removable Decor Only',
    explanation: 'Favor freestanding furniture, leaning mirrors/art, and non-permanent solutions.',
    defaultEnabled: true,
    isPrimaryToggle: true,
  },
  {
    key: 'keepExistingFixtures',
    label: 'Keep Existing Fixtures',
    explanation: 'Do not remove or replace landlord-installed ceiling lights, blinds, or hardware.',
    defaultEnabled: true,
    isPrimaryToggle: true,
  },
  {
    key: 'preserveLayout',
    label: 'Preserve Room Layout',
    explanation: 'Avoid relocating windows, doors, walls, and major architectural elements.',
    defaultEnabled: true,
    isPrimaryToggle: true,
  },
  {
    key: 'keepExistingFurniture',
    label: 'Keep Existing Furniture Where Possible',
    explanation: 'Style around your main sofa, bed, or desk rather than replacing large pieces.',
    defaultEnabled: true,
    isPrimaryToggle: false,
  },
];

export const PRESERVED_ARCHITECTURE_DEFINITIONS: {
  key: keyof PreservedArchitecture;
  label: string;
  explanation: string;
}[] = [
  {
    key: 'wallColors',
    label: 'Wall colors',
    explanation: 'Keep existing paint color and wall surface tone unchanged.',
  },
  {
    key: 'existingFlooring',
    label: 'Existing flooring',
    explanation: 'Keep hardwood, tile, or carpet material intact (use removable area rugs only).',
  },
  {
    key: 'windows',
    label: 'Windows',
    explanation: 'Keep window positions, frames, muntins, and natural light direction locked.',
  },
  {
    key: 'doors',
    label: 'Doors',
    explanation: 'Keep entry, closet, and balcony door locations and trim unchanged.',
  },
  {
    key: 'builtInCabinets',
    label: 'Built-in cabinets',
    explanation: 'Preserve existing shelving, radiators, kitchenettes, or closet millwork.',
  },
  {
    key: 'fixedLighting',
    label: 'Fixed lighting',
    explanation: 'Keep existing ceiling fixtures and sconces in place.',
  },
  {
    key: 'architecturalFeatures',
    label: 'Existing architectural features',
    explanation: 'Keep baseboards, crown molding, ceiling height, and room proportions intact.',
  },
];

export const DEFAULT_RENTAL_RULES: RentalRules = {
  noPainting: true,
  noDrilling: true,
  noHardwiring: true,
  noPermanentAdhesives: true,
  removableDecorOnly: true,
  keepExistingFixtures: true,
  preserveLayout: true,
  keepExistingFurniture: true,
};

export const DEFAULT_PRESERVED_ARCHITECTURE: PreservedArchitecture = {
  wallColors: true,
  existingFlooring: true,
  windows: true,
  doors: true,
  builtInCabinets: true,
  fixedLighting: true,
  architecturalFeatures: true,
};

export const DEFAULT_PREFERENCES: RedesignPreferences = {
  roomType: 'Living Room',
  style: 'Organic Modern',
  budget: '$300–$500',
  maxBudgetDollars: 500,
  budgetIntent: 'few_affordable',
  existingFurnitureMode: 'keep_all',
  identifiedFurniture: ['Sofa / Sectional', 'Coffee Table'],
  identifiedFurnitureNotes: '',
  isSmallSpace: false,
  improvementGoal: 'Make the room feel cozier.',
  customInstruction: '',
  rentalRules: { ...DEFAULT_RENTAL_RULES },
  preservedArchitecture: { ...DEFAULT_PRESERVED_ARCHITECTURE },
};

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validatePhotoUpload(
  file: { name: string; type: string; size: number } | null | undefined
): { valid: boolean; error?: string } {
  if (!file) {
    return {
      valid: false,
      error:
        'Please upload a room photo (JPEG, PNG, or WebP) or select a sample apartment room before generating.',
    };
  }

  const lowerName = (file.name || '').toLowerCase();
  const hasValidExt = SUPPORTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const hasValidMime = SUPPORTED_MIME_TYPES.includes(file.type);

  if (!hasValidMime || !hasValidExt) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || file.name || 'unknown'}). Please upload a valid JPEG, PNG, or WebP photo.`,
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'The selected image file is empty (0 bytes). Please choose a valid room photo.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the 10 MB limit. Please upload a smaller photo.`,
    };
  }

  return { valid: true };
}

export function buildRedesignPrompt(prefs: RedesignPreferences): string {
  const styleMeta = DESIGN_STYLES.find((s) => s.id === prefs.style) || DESIGN_STYLES[0];
  const budgetMeta = BUDGET_OPTIONS.find((b) => b.id === prefs.budget) || BUDGET_OPTIONS[2];
  const furnitureModeMeta =
    EXISTING_FURNITURE_MODES.find((m) => m.id === prefs.existingFurnitureMode) ||
    EXISTING_FURNITURE_MODES[0];
  const budgetIntentMeta =
    BUDGET_INTENT_OPTIONS.find((i) => i.id === prefs.budgetIntent) || BUDGET_INTENT_OPTIONS[1];

  const ruleInstructions: string[] = [];
  const negativeConstraints: string[] = [
    'do not invent new windows',
    'do not remove or relocate doors',
    'do not alter ceiling height or room proportions',
    'do not change camera angle or perspective',
    'do not make the room appear larger by stretching walls or altering focal length',
  ];

  // 1. Rental Restrictions
  if (prefs.rentalRules.preserveLayout) {
    ruleInstructions.push(
      "[Preserve Room Layout: ENABLED] Preserve the original architecture, wall positions, windows, doors, ceiling height, camera angle, and room proportions as closely as possible."
    );
  } else {
    ruleInstructions.push(
      "[Preserve Room Layout: DISABLED] Allow flexible furniture layout re-orientation while still keeping overall room dimensions realistic."
    );
  }

  if (prefs.rentalRules.noPainting) {
    ruleInstructions.push(
      '[No Painting: ENABLED] Keep existing wall colors and drywall finishes untouched; introduce color through textiles, rugs, and lighting rather than paint.'
    );
    negativeConstraints.push('no painted accent walls', 'no permanent wallpaper');
  } else {
    ruleInstructions.push(
      '[No Painting: DISABLED] Subtle wall color refresh or removable peel-and-stick accent finish is permitted.'
    );
  }

  if (prefs.rentalRules.noDrilling) {
    ruleInstructions.push(
      '[No Drilling: ENABLED] Avoid wall-mounted shelves, drilled curtain brackets, or heavy screwed-in hardware; use freestanding floor lamps, leaning art frames, and tension rods.'
    );
    negativeConstraints.push('no drilled wall shelving', 'no screwed-in wall brackets');
  } else {
    ruleInstructions.push(
      '[No Drilling: DISABLED] Standard wall-mounted curtain rods and picture hooks are permitted.'
    );
  }

  if (prefs.rentalRules.noHardwiring) {
    ruleInstructions.push(
      '[No Hardwiring: ENABLED] Do not replace ceiling junction boxes or add hardwired sconces; use plug-in floor lamps, table lamps, and battery/plug-in accent lights.'
    );
    negativeConstraints.push('no hardwired chandeliers', 'no recessed ceiling construction');
  } else {
    ruleInstructions.push(
      '[No Hardwiring: DISABLED] Swapping overhead light fixtures is permitted.'
    );
  }

  if (prefs.rentalRules.noPermanentAdhesives) {
    ruleInstructions.push(
      '[No Permanent Adhesives: ENABLED] Avoid wall-mounted adhesive strips, foam tape, or stick-on tiles that risk peeling apartment paint; favor freestanding decor and leaning frames.'
    );
    negativeConstraints.push('no permanent wall adhesives', 'no stick-on wall tiles');
  } else {
    ruleInstructions.push(
      '[No Permanent Adhesives: DISABLED] Lightweight removable adhesive hooks or strips may be used with caution.'
    );
  }

  if (prefs.rentalRules.removableDecorOnly) {
    ruleInstructions.push(
      '[Removable Decor Only: ENABLED] Use 100% freestanding furniture, area rugs, throw pillows, and portable accessories.'
    );
  }

  if (prefs.rentalRules.keepExistingFixtures) {
    ruleInstructions.push(
      '[Keep Existing Fixtures: ENABLED] Leave existing landlord-installed ceiling lights, window blinds, radiators, and hardware in place.'
    );
    negativeConstraints.push('do not remove existing ceiling fixtures or window blinds');
  }

  // 2. Existing Furniture Strategy ("What I Already Own?")
  const identifiedList =
    prefs.identifiedFurniture.length > 0
      ? prefs.identifiedFurniture.join(', ')
      : 'primary anchor furniture visible in photo';
  const customFurnitureNote = prefs.identifiedFurnitureNotes.trim()
    ? ` User-identified details: "${prefs.identifiedFurnitureNotes.trim()}".`
    : '';

  if (prefs.existingFurnitureMode === 'keep_all') {
    ruleInstructions.push(
      `[What I Already Own: KEEP ALL EXISTING FURNITURE] Reuse and style around all existing furniture (${identifiedList}) before suggesting any new purchases.${customFurnitureNote}`
    );
  } else if (prefs.existingFurnitureMode === 'keep_selected') {
    ruleInstructions.push(
      `[What I Already Own: KEEP SELECTED FURNITURE] Preserve and design around these selected user items: ${identifiedList}.${customFurnitureNote}`
    );
  } else if (prefs.existingFurnitureMode === 'replace_necessary') {
    ruleInstructions.push(
      `[What I Already Own: REPLACE ONLY NECESSARY] Keep functional existing pieces (${identifiedList}) and only replace items that clash with room scale.${customFurnitureNote}`
    );
  } else {
    ruleInstructions.push(
      '[What I Already Own: MOSTLY EMPTY ROOM] Furnish the room using freestanding, apartment-scaled pieces suited to the layout.'
    );
  }

  // 3. Preserved Architectural Features ("Keep What Cannot Be Changed")
  const lockedFeatures: string[] = [];
  if (prefs.preservedArchitecture.wallColors) lockedFeatures.push('wall colors');
  if (prefs.preservedArchitecture.existingFlooring) lockedFeatures.push('existing flooring');
  if (prefs.preservedArchitecture.windows) lockedFeatures.push('windows');
  if (prefs.preservedArchitecture.doors) lockedFeatures.push('doors');
  if (prefs.preservedArchitecture.builtInCabinets) lockedFeatures.push('built-in cabinets');
  if (prefs.preservedArchitecture.fixedLighting) lockedFeatures.push('fixed lighting');
  if (prefs.preservedArchitecture.architecturalFeatures)
    lockedFeatures.push('existing architectural features (baseboards, molding, ceiling height)');

  if (lockedFeatures.length > 0) {
    ruleInstructions.push(
      `[Keep What Cannot Be Changed: LOCKED] Must remain unchanged in the room: ${lockedFeatures.join(', ')}.`
    );
  }

  // 4. Small-Space Solutions
  const isSmallSpaceActive = prefs.isSmallSpace || prefs.roomType === 'Studio Apartment';
  if (isSmallSpaceActive) {
    ruleInstructions.push(
      '[Small-Space Apartment Logic: ENABLED] Prioritize compact apartment-scale furniture, multi-purpose pieces (storage ottoman, nesting surface), freestanding vertical storage that requires zero drilling, clear walking paths, and visual decluttering. Do NOT alter room dimensions or camera perspective to fake a larger room.'
    );
  }

  const maxBudgetLabel =
    prefs.maxBudgetDollars !== null ? `$${prefs.maxBudgetDollars} maximum` : 'No fixed dollar cap';

  const customNote = prefs.customInstruction.trim()
    ? `\nUSER CUSTOM NOTE: "${prefs.customInstruction.trim()}"`
    : '';

  return [
    `ROLE: Eden Canvas Renter-Safe Interior Design Engine (by Wold Eden).`,
    `TASK: Redesign this ${prefs.roomType} in "${styleMeta.label}" style (${styleMeta.tagline}).`,
    `PRIMARY GOAL: ${prefs.improvementGoal}`,
    `WHAT I ALREADY OWN: ${furnitureModeMeta.label} (${identifiedList})`,
    `BUDGET PLAN: ${prefs.budget} (${maxBudgetLabel}) — ${budgetIntentMeta.label} ${budgetMeta.strategy}`,
    `PREFERRED MATERIALS: ${styleMeta.materials}.`,
    `RENTER & ARCHITECTURAL GUARDRAILS:\n- ${ruleInstructions.join('\n- ')}`,
    `NEGATIVE CONSTRAINTS: ${negativeConstraints.join('; ')}.`,
    `LIGHTING & REALISM: Maintain realistic daylight direction from existing windows, add warm 2700K plug-in lamp illumination, and ensure an achievable, photorealistic apartment interior.${customNote}`,
  ].join('\n\n');
}

export const CURATED_SAMPLE_CATALOG: ProductRecommendation[] = [
  {
    id: 'rec-throw-pillow-covers',
    name: 'Textured Bouclé & Oatmeal Linen Pillow Cover Set (Set of 2)',
    category: 'Throw Pillows & Textiles',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 34,
    dimensionsLabel: '20" × 20" (50 cm × 50 cm) — fits standard throw pillow inserts',
    costTier: 'low_cost',
    budgetCategory: 'Under $100',
    typicalRangeLabel: 'Typical range: $25–$45',
    styles: ['Organic Modern', 'Japandi', 'Warm Minimalist', 'Modern Classic', 'Dark Cozy'],
    roomTypes: ['Living Room', 'Bedroom', 'Studio Apartment', 'Home Office'],
    fitReason:
      'Instantly refreshes an existing sofa, bed, or accent chair with warm tactile contrast without replacing furniture.',
    renterExplanation:
      '100% non-permanent textile upgrade; zero installation, tools, or wall contact required.',
    smallSpaceBenefit: 'Adds style and lumbar comfort without consuming any floor footprint.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'boucle oatmeal linen throw pillow covers 20x20 set of 2',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=boucle+oatmeal+linen+throw+pillow+covers+20x20',
    visualType: 'throw-pillows',
    paletteSwatches: ['#F8F6F0', '#A8B5A0', '#C2623F'],
  },
  {
    id: 'rec-woven-storage-baskets',
    name: 'Freestanding Seagrass & Cotton Rope Vertical Storage Baskets',
    category: 'Storage Baskets',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 42,
    dimensionsLabel: '15" D × 18" H — freestanding floor or closet organizer',
    costTier: 'low_cost',
    budgetCategory: 'Under $100',
    typicalRangeLabel: 'Typical range: $30–$55',
    styles: ['Organic Modern', 'Japandi', 'Warm Minimalist', 'Mid-Century Modern'],
    roomTypes: ['Living Room', 'Bedroom', 'Studio Apartment', 'Home Office'],
    fitReason:
      'Conceals everyday apartment clutter, throw blankets, and cables while adding natural woven texture.',
    renterExplanation:
      'Freestanding organizer that sits directly on the floor—requires no wall drilling or adhesive hooks.',
    smallSpaceBenefit:
      'Maximizes vertical storage in tight corners while keeping walking paths clear.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'woven seagrass floor storage basket with handles',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=woven+seagrass+floor+storage+basket+with+handles',
    visualType: 'woven-baskets',
    paletteSwatches: ['#E9E1D5', '#C9B18B', '#153A2E'],
  },
  {
    id: 'rec-ceramic-table-lamp',
    name: 'Warm Ceramic Plug-In Table Lamp with Linen Drum Shade',
    category: 'Table Lamps',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 58,
    dimensionsLabel: '11" D × 19" H — standard 6 ft 2-prong wall outlet cord',
    costTier: 'low_cost',
    budgetCategory: 'Under $100',
    typicalRangeLabel: 'Typical range: $40–$75',
    styles: ['Organic Modern', 'Japandi', 'Warm Minimalist', 'Modern Classic', 'Dark Cozy'],
    roomTypes: ['Living Room', 'Bedroom', 'Studio Apartment', 'Home Office'],
    fitReason:
      'Softens harsh overhead apartment fixtures with warm 2700K eye-level ambient light.',
    renterExplanation:
      'Plugs into any existing wall outlet; keeps existing ceiling fixtures untouched and requires zero hardwiring.',
    smallSpaceBenefit: 'Compact 11-inch base fits narrow nightstands, desks, or window sills.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'ceramic plug-in table lamp warm linen shade',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=ceramic+plug+in+table+lamp+linen+shade',
    visualType: 'table-lamp',
    paletteSwatches: ['#F8F6F0', '#E9E1D5', '#6E4E37'],
  },
  {
    id: 'rec-plugin-arc-floor-lamp',
    name: 'Freestanding Brass & Walnut Plug-In Arc Floor Lamp',
    category: 'Plug-in Lamps',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 115,
    dimensionsLabel: '12" weighted base × 64" H — tucks neatly behind sofa or desk corner',
    costTier: 'low_cost',
    budgetCategory: '$100–$300',
    typicalRangeLabel: 'Typical range: $85–$145',
    styles: ['Organic Modern', 'Mid-Century Modern', 'Modern Classic', 'Dark Cozy', 'Japandi'],
    roomTypes: ['Living Room', 'Bedroom', 'Studio Apartment', 'Home Office', 'Dining Area'],
    fitReason:
      'Delivers overhead-style reading and dining illumination without touching ceiling wiring.',
    renterExplanation:
      'Weighted freestanding floor base slides under a sofa or desk edge—zero drilling, zero hardwiring, and zero wall adhesives.',
    smallSpaceBenefit:
      'Base slides underneath existing furniture so it takes up almost zero open floor area.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'freestanding plug in arc floor lamp linen shade',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=freestanding+plug+in+arc+floor+lamp+linen+shade',
    visualType: 'floor-lamp',
    paletteSwatches: ['#F8F6F0', '#6E4E37', '#153A2E'],
  },
  {
    id: 'rec-tension-linen-curtains',
    name: 'No-Drill Tension-Rod Oatmeal Slub Linen Curtain Panels (Pair)',
    category: 'Linen Curtains',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 88,
    dimensionsLabel: '50" W × 84" L per panel — fits inside-mount window tension rods',
    costTier: 'low_cost',
    budgetCategory: '$100–$300',
    typicalRangeLabel: 'Typical range: $65–$110',
    styles: ['Organic Modern', 'Japandi', 'Warm Minimalist', 'Modern Classic'],
    roomTypes: ['Living Room', 'Bedroom', 'Studio Apartment', 'Dining Area'],
    fitReason:
      'Diffuses daylight and softens bare rental window frames while preserving existing landlord blinds.',
    renterExplanation:
      'Mounts inside the window casing with a spring tension rod—no drilled brackets, screws, or adhesives required.',
    smallSpaceBenefit: 'Hangs flush with window frame to keep walkways unobstructed.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'oatmeal linen curtains tension rod window panels',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=oatmeal+linen+curtains+tension+rod+panels',
    visualType: 'linen-curtains',
    paletteSwatches: ['#F8F6F0', '#E9E1D5', '#A8B5A0'],
  },
  {
    id: 'rec-olive-planter',
    name: 'Faux Olive Tree in Freestanding Fluted Ceramic Planter',
    category: 'Freestanding Greenery',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 95,
    dimensionsLabel: '10" planter pot × 60" overall height',
    costTier: 'low_cost',
    budgetCategory: '$100–$300',
    typicalRangeLabel: 'Typical range: $70–$120',
    styles: ['Organic Modern', 'Japandi', 'Warm Minimalist', 'Mid-Century Modern'],
    roomTypes: ['Living Room', 'Studio Apartment', 'Home Office', 'Dining Area'],
    fitReason:
      'Draws the eye upward and softens plain builder-grade apartment corners with organic greenery.',
    renterExplanation:
      '100% freestanding floor planter; requires no ceiling hooks, wall brackets, or watering damage risk.',
    smallSpaceBenefit: 'Narrow vertical silhouette adds height to compact rooms.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'faux olive tree ceramic floor planter 5ft',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=faux+olive+tree+ceramic+planter+5ft',
    visualType: 'olive-planter',
    paletteSwatches: ['#A8B5A0', '#E9E1D5', '#153A2E'],
  },
  {
    id: 'rec-leaning-framed-art',
    name: 'Lightweight Wood-Framed Botanical Prints (Leaning or Strip-Mount)',
    category: 'Framed Wall Art',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 78,
    dimensionsLabel: '16" × 20" per frame (Set of 2) — suitable for mantel/console leaning',
    costTier: 'low_cost',
    budgetCategory: '$100–$300',
    typicalRangeLabel: 'Typical range: $55–$95',
    styles: ['Organic Modern', 'Japandi', 'Mid-Century Modern', 'Modern Classic', 'Dark Cozy'],
    roomTypes: ['Living Room', 'Bedroom', 'Studio Apartment', 'Home Office'],
    fitReason:
      'Introduces color and editorial focal points against plain apartment walls without painting.',
    renterExplanation:
      'Can be leaned directly on a console, desk, or dresser for zero wall contact; if using removable adhesive strips, test paint finish first.',
    smallSpaceBenefit: 'Adds vertical visual interest with zero floor footprint.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: true,
    replacesFixture: false,
    searchQuery: 'lightweight wood framed botanical wall art set of 2 16x20',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=wood+framed+botanical+wall+art+set+16x20',
    visualType: 'peel-art',
    paletteSwatches: ['#E9E1D5', '#153A2E', '#C2623F'],
  },
  {
    id: 'rec-flatweave-area-rug',
    name: 'Washable Flatweave Wool-Blend Area Rug in Warm Ivory & Sand',
    category: 'Area Rugs',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 210,
    dimensionsLabel: "5' × 8' (60\" × 96\") or 6' × 9' — verify floor clearance before ordering",
    costTier: 'optional_upgrade',
    budgetCategory: '$300–$500',
    typicalRangeLabel: 'Typical range: $150–$280',
    styles: ['Organic Modern', 'Japandi', 'Warm Minimalist', 'Mid-Century Modern', 'Modern Classic'],
    roomTypes: ['Living Room', 'Bedroom', 'Studio Apartment', 'Dining Area'],
    fitReason:
      'Defines the seating or sleeping zone, masks dated rental flooring, and absorbs apartment echo.',
    renterExplanation:
      'Lays flat over existing hardwood, vinyl, or carpet with a non-slip rug pad (no floor adhesives) to protect your deposit.',
    smallSpaceBenefit:
      'Visually separates living and sleeping zones in a studio apartment without dividers.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'washable flatweave wool blend area rug 5x8 warm ivory',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=washable+flatweave+area+rug+5x8+warm+ivory',
    visualType: 'area-rug',
    paletteSwatches: ['#F8F6F0', '#E9E1D5', '#6E4E37'],
  },
  {
    id: 'rec-compact-nesting-console',
    name: 'Compact Freestanding Walnut Multi-Use Storage Console / Nesting Table',
    category: 'Multi-Purpose Furniture',
    verifiedPrice: null,
    verifiedPriceDollars: null,
    estimatedMidpointDollars: 245,
    dimensionsLabel: '36" W × 14" D × 30" H — narrow apartment-depth profile',
    costTier: 'optional_upgrade',
    budgetCategory: '$500–$1,000',
    typicalRangeLabel: 'Typical range: $180–$320',
    styles: ['Organic Modern', 'Mid-Century Modern', 'Japandi', 'Dark Cozy'],
    roomTypes: ['Living Room', 'Studio Apartment', 'Home Office', 'Dining Area'],
    fitReason:
      'Provides concealed surface storage and a display ledge for leaning art or table lamps.',
    renterExplanation:
      'Freestanding narrow-depth cabinet that requires no wall anchoring bolts when used for lightweight storage.',
    smallSpaceBenefit:
      'Slim 14-inch depth preserves 36-inch walking paths in narrow apartment layouts.',
    requiresDrilling: false,
    requiresHardwiring: false,
    requiresPainting: false,
    usesAdhesive: false,
    replacesFixture: false,
    searchQuery: 'narrow walnut freestanding console storage table 14 inch deep',
    retailerSearchUrl:
      'https://www.google.com/search?tbm=shop&q=narrow+walnut+console+storage+table',
    visualType: 'wood-console',
    paletteSwatches: ['#6E4E37', '#E9E1D5', '#1C2420'],
  },
];

const BUDGET_TIER_RANK: Record<BudgetTier, number> = {
  'Under $100': 1,
  '$100–$300': 2,
  '$300–$500': 3,
  '$500–$1,000': 4,
  'Inspiration Only': 5,
};

export function parseTypicalRangeDollars(rangeLabel: string): { min: number; max: number } {
  const matches = rangeLabel.match(/\$(\d+)\D+\$(\d+)/);
  if (matches) {
    return { min: Number(matches[1]), max: Number(matches[2]) };
  }
  return { min: 30, max: 90 };
}

export function calculateBudgetSummary(
  items: ProductRecommendation[],
  maxBudgetDollars: number | null,
  budgetIntent: BudgetIntent,
  userVerifiedPrices: Record<string, number> = {}
): BudgetCalculationSummary {
  let verifiedItemCount = 0;
  let unverifiedItemCount = 0;
  let verifiedSubtotalDollars = 0;
  let estimatedRangeMinDollars = 0;
  let estimatedRangeMaxDollars = 0;

  for (const item of items) {
    const userPrice = userVerifiedPrices[item.id];
    const effectiveVerified =
      typeof userPrice === 'number' && !Number.isNaN(userPrice) && userPrice >= 0
        ? userPrice
        : item.verifiedPriceDollars;

    const range = parseTypicalRangeDollars(item.typicalRangeLabel);

    if (typeof effectiveVerified === 'number') {
      verifiedItemCount += 1;
      verifiedSubtotalDollars += effectiveVerified;
      estimatedRangeMinDollars += effectiveVerified;
      estimatedRangeMaxDollars += effectiveVerified;
    } else {
      unverifiedItemCount += 1;
      estimatedRangeMinDollars += range.min;
      estimatedRangeMaxDollars += range.max;
    }
  }

  // Determine budget status against maxBudgetDollars
  const comparisonTotal =
    verifiedItemCount === items.length && items.length > 0
      ? verifiedSubtotalDollars
      : estimatedRangeMinDollars;

  let remainingBudgetDollars: number | null = null;
  let exceedsBudgetByDollars: number | null = null;
  let isOverBudget = false;

  if (maxBudgetDollars !== null) {
    if (comparisonTotal > maxBudgetDollars && items.length > 0) {
      isOverBudget = true;
      exceedsBudgetByDollars = Math.round(comparisonTotal - maxBudgetDollars);
      remainingBudgetDollars = 0;
    } else {
      remainingBudgetDollars = Math.max(0, Math.round(maxBudgetDollars - comparisonTotal));
    }
  }

  const exclusionNote =
    'Shipping, applicable sales taxes, and items with unverified live retailer prices are excluded from the verified subtotal. Estimated ranges are shown for planning only and are not guaranteed retail quotes.';

  let statusMessage = '';
  if (budgetIntent === 'existing_only' || maxBudgetDollars === 0) {
    statusMessage =
      items.length === 0
        ? 'Your plan is set to $0 (Use Existing Items Only). Focus on the free layout and decluttering steps above—no purchases needed.'
        : 'You selected "Use existing items only." Any items shown below are strictly optional reference ideas.';
  } else if (isOverBudget && exceedsBudgetByDollars !== null) {
    statusMessage = `Note: The selected items have an estimated minimum cost of $${comparisonTotal}, which exceeds your $${maxBudgetDollars} maximum budget by at least $${exceedsBudgetByDollars}. Use "Revise to Fit My Budget" below to trim higher-cost items.`;
  } else if (maxBudgetDollars !== null) {
    statusMessage = `Fits within your $${maxBudgetDollars} target ceiling (estimated $${estimatedRangeMinDollars}–$${estimatedRangeMaxDollars} across ${items.length} item${items.length === 1 ? '' : 's'}).`;
  } else {
    statusMessage = `Inspiration mode active (no fixed budget ceiling). Showing ${items.length} matched decor categories.`;
  }

  return {
    maxBudgetDollars,
    budgetIntent,
    recommendedCount: items.length,
    verifiedItemCount,
    unverifiedItemCount,
    verifiedSubtotalDollars: Math.round(verifiedSubtotalDollars),
    estimatedRangeMinDollars: Math.round(estimatedRangeMinDollars),
    estimatedRangeMaxDollars: Math.round(estimatedRangeMaxDollars),
    remainingBudgetDollars,
    exceedsBudgetByDollars,
    isOverBudget,
    exclusionNote,
    statusMessage,
  };
}

export function reviseRecommendationsToFitBudget(
  items: ProductRecommendation[],
  maxBudgetDollars: number | null,
  userVerifiedPrices: Record<string, number> = {}
): ProductRecommendation[] {
  if (maxBudgetDollars === null) return items;
  if (maxBudgetDollars <= 0) return [];

  // Sort items by lowest cost first so we keep the most affordable renter-safe upgrades
  const sorted = [...items].sort((a, b) => {
    const priceA =
      userVerifiedPrices[a.id] ?? a.verifiedPriceDollars ?? parseTypicalRangeDollars(a.typicalRangeLabel).min;
    const priceB =
      userVerifiedPrices[b.id] ?? b.verifiedPriceDollars ?? parseTypicalRangeDollars(b.typicalRangeLabel).min;
    return priceA - priceB;
  });

  const kept: ProductRecommendation[] = [];
  let runningTotal = 0;

  for (const item of sorted) {
    const itemMin =
      userVerifiedPrices[item.id] ??
      item.verifiedPriceDollars ??
      parseTypicalRangeDollars(item.typicalRangeLabel).min;
    if (runningTotal + itemMin <= maxBudgetDollars) {
      kept.push(item);
      runningTotal += itemMin;
    }
  }

  return kept;
}

export function selectRecommendations(
  prefs: RedesignPreferences,
  options?: { autoFitBudget?: boolean; userVerifiedPrices?: Record<string, number> }
): {
  items: ProductRecommendation[];
  budgetSummary: BudgetCalculationSummary;
  budgetGuidance: string;
} {
  // If user explicitly wants existing items only ($0 spend) and autoFitBudget is not false, return 0 or minimal low-cost items
  if (prefs.budgetIntent === 'existing_only' && prefs.maxBudgetDollars === 0) {
    const emptySummary = calculateBudgetSummary([], 0, prefs.budgetIntent);
    return {
      items: [],
      budgetSummary: emptySummary,
      budgetGuidance:
        'Budget Plan: $0 (Use Existing Items Only). Your plan prioritizes rearranging and styling the furniture you already own without new purchases.',
    };
  }

  const targetRank = BUDGET_TIER_RANK[prefs.budget] || 3;

  // 1. Strict Renter Restriction Filtering
  const compliant = CURATED_SAMPLE_CATALOG.filter((item) => {
    if (prefs.rentalRules.noDrilling && item.requiresDrilling) return false;
    if (prefs.rentalRules.noHardwiring && item.requiresHardwiring) return false;
    if (prefs.rentalRules.noPainting && item.requiresPainting) return false;
    if (prefs.rentalRules.noPermanentAdhesives && item.usesAdhesive) return false;
    if (prefs.rentalRules.keepExistingFixtures && item.replacesFixture) return false;
    return true;
  });

  const isSmallSpace = prefs.isSmallSpace || prefs.roomType === 'Studio Apartment';

  // 2. Score items based on style, room type, small-space suitability, existing furniture, and budget
  const scored = compliant
    .map((item) => {
      let score = 0;
      const itemRank = BUDGET_TIER_RANK[item.budgetCategory] || 2;
      if (itemRank <= targetRank) {
        score += 5;
      } else {
        score -= 4;
      }
      if (item.styles.includes(prefs.style)) score += 3;
      if (item.roomTypes.includes(prefs.roomType)) score += 2;
      if (isSmallSpace && item.smallSpaceBenefit) score += 2;

      if (
        prefs.improvementGoal.toLowerCase().includes('light') &&
        (item.category === 'Plug-in Lamps' || item.category === 'Table Lamps')
      ) {
        score += 3;
      }
      if (
        (prefs.improvementGoal.toLowerCase().includes('clutter') ||
          prefs.improvementGoal.toLowerCase().includes('organized')) &&
        item.category === 'Storage Baskets'
      ) {
        score += 3;
      }

      // Deprioritize large furniture if keeping all existing furniture
      if (
        (prefs.existingFurnitureMode === 'keep_all' || prefs.rentalRules.keepExistingFurniture) &&
        item.category === 'Multi-Purpose Furniture'
      ) {
        score -= 3;
      }

      return { item, score, itemRank };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.itemRank - b.itemRank;
    });

  let desiredCount = 4;
  if (prefs.budgetIntent === 'few_affordable') desiredCount = 3;
  if (prefs.maxBudgetDollars !== null && prefs.maxBudgetDollars <= 60) desiredCount = 2;

  let selected = scored.slice(0, desiredCount).map((entry) => entry.item);

  // If autoFitBudget is requested (e.g. for a strict $50 budget), revise automatically if possible
  if (options?.autoFitBudget && prefs.maxBudgetDollars !== null) {
    const fitted = reviseRecommendationsToFitBudget(
      compliant,
      prefs.maxBudgetDollars,
      options.userVerifiedPrices
    );
    if (fitted.length > 0) {
      selected = fitted.slice(0, desiredCount);
    }
  }

  const budgetSummary = calculateBudgetSummary(
    selected,
    prefs.maxBudgetDollars,
    prefs.budgetIntent,
    options?.userVerifiedPrices
  );

  const budgetMeta = BUDGET_OPTIONS.find((b) => b.id === prefs.budget) || BUDGET_OPTIONS[2];
  const budgetGuidance = `${budgetSummary.statusMessage} ${budgetMeta.strategy}`;

  return {
    items: selected,
    budgetSummary,
    budgetGuidance,
  };
}

export function buildActionablePlan(
  prefs: RedesignPreferences,
  recommendations: ProductRecommendation[]
): ActionPlanStep[] {
  const steps: ActionPlanStep[] = [];
  const ownedSummary =
    prefs.identifiedFurniture.length > 0
      ? prefs.identifiedFurniture.join(', ')
      : 'your existing primary furniture';

  // Step 1: Always start with a $0 Free change reusing existing items & clearing layout
  if (prefs.existingFurnitureMode === 'mostly_empty') {
    steps.push({
      stepNumber: 1,
      title: 'Map Your Primary Zone & Walking Paths ($0)',
      description: `Before buying anything, mark a clear 30–36 inch walking path from the entry door to the window so your ${prefs.roomType.toLowerCase()} feels open and natural daylight remains unobstructed.`,
      costTier: 'free',
      costLabel: 'Free Change ($0)',
    });
  } else {
    steps.push({
      stepNumber: 1,
      title: `Re-Anchor & Declutter Around What You Own ($0)`,
      description: `Keep ${ownedSummary} as the foundation. Pull seating 2–3 inches off the walls to create breathing room, clear visual surface clutter, and orient seating toward your natural window light.`,
      costTier: 'free',
      costLabel: 'Free Change ($0)',
    });
  }

  // Step 2: Second $0 Free change (Small-space / Lighting / Cord organization)
  steps.push({
    stepNumber: 2,
    title: 'Optimize Natural Light & Conceal Cords ($0)',
    description:
      prefs.isSmallSpace || prefs.roomType === 'Studio Apartment'
        ? 'Group everyday items by zone, tuck lamp and device cords behind existing furniture legs, and leave floor corners visible to make your compact layout feel calmer without altering walls.'
        : 'Open window sightlines, group existing books or ceramics in odd-numbered clusters (rule of threes), and tuck visible cables neatly behind existing furniture.',
    costTier: 'free',
    costLabel: 'Free Change ($0)',
  });

  // Step 3: Low-cost changes from recommendations
  const lowCostItems = recommendations.filter((r) => r.costTier === 'low_cost');
  const optionalItems = recommendations.filter((r) => r.costTier === 'optional_upgrade');

  if (prefs.budgetIntent === 'existing_only' || prefs.maxBudgetDollars === 0) {
    steps.push({
      stepNumber: 3,
      title: 'Restyle Existing Textiles & Lamps from Other Rooms ($0)',
      description:
        'Since your plan is set to use existing items only, swap in warm-toned throw blankets, pillows, or a table lamp from another room to achieve the warmer palette without spending.',
      costTier: 'free',
      costLabel: 'Free Change ($0)',
    });
  } else {
    if (lowCostItems.length > 0) {
      const names = lowCostItems.map((i) => i.category.toLowerCase()).join(' and ');
      steps.push({
        stepNumber: 3,
        title: `Layer Renter-Safe Warmth (${lowCostItems.map((i) => i.category).join(' + ')})`,
        description: `Introduce ${names} (${lowCostItems.map((i) => i.typicalRangeLabel).join('; ')}) to add ${prefs.style} texture and warm 2700K illumination with zero drilling or painting.`,
        costTier: 'low_cost',
        costLabel: 'Low-Cost Change',
      });
    }

    if (optionalItems.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: `Optional Anchor Upgrade (${optionalItems.map((i) => i.category).join(' / ')})`,
        description: `If your budget allows, ground the room with ${optionalItems
          .map((i) => `${i.name} (${i.typicalRangeLabel})`)
          .join(' or ')}—verify exact floor measurements with a tape measure before ordering.`,
        costTier: 'optional_upgrade',
        costLabel: 'Optional Higher-Cost Purchase',
      });
    }
  }

  return steps;
}

export function buildArchitecturalNotes(prefs: RedesignPreferences): string[] {
  const notes: string[] = [];
  const p = prefs.preservedArchitecture;
  if (p.wallColors) notes.push('Wall colors preserved (no repainting required).');
  if (p.existingFlooring)
    notes.push('Existing flooring preserved (styled with removable flatweave rugs only).');
  if (p.windows) notes.push('Window frames, placement, and daylight direction locked.');
  if (p.doors) notes.push('Entry and interior doors kept in original positions.');
  if (p.builtInCabinets) notes.push('Built-in cabinets, closets, and millwork preserved.');
  if (p.fixedLighting) notes.push('Existing landlord ceiling/wall light fixtures kept intact.');
  if (p.architecturalFeatures)
    notes.push('Room proportions, baseboards, and ceiling height preserved.');

  if (notes.length === 0) {
    notes.push('Flexible architectural exploration enabled.');
  }
  return notes;
}

export function buildSmallSpaceNotes(prefs: RedesignPreferences): string[] {
  if (!prefs.isSmallSpace && prefs.roomType !== 'Studio Apartment') {
    return [];
  }
  return [
    'Small-Space Scale: Prioritizes slim-profile, apartment-scaled pieces and multi-purpose surfaces.',
    'Clear Walkways: Maintains open visual pathways without blocking doors, radiators, or windows.',
    'No-Drill Vertical Storage: Uses freestanding baskets and leaning elements rather than wall-drilled shelving.',
    'True Room Proportions: Does not stretch walls or alter camera focal length to fake a larger room. Always verify physical measurements before buying furniture.',
  ];
}

export function buildComplianceSummary(rules: RentalRules): string[] {
  const notes: string[] = [];
  if (rules.preserveLayout) {
    notes.push(
      'Preserve Room Layout (Active): Original wall geometry, window positions, doors, and camera perspective locked.'
    );
  }
  if (rules.noPainting) {
    notes.push(
      'No Painting (Active): Existing builder-grade wall color retained — warmth added via textiles and 2700K lighting.'
    );
  }
  if (rules.noDrilling) {
    notes.push(
      'No Drilling (Active): Zero wall holes — uses freestanding floor lamps, leaning frames, and tension drapery.'
    );
  }
  if (rules.noHardwiring) {
    notes.push(
      'No Hardwiring (Active): No electrical junction work — all lighting upgrades use standard wall outlets.'
    );
  }
  if (rules.noPermanentAdhesives) {
    notes.push(
      'No Permanent Adhesives (Active): Avoids heavy wall tapes or stick-on tiles that could damage paint or drywall.'
    );
  }
  if (rules.removableDecorOnly) {
    notes.push(
      'Removable Decor Only (Active): Prioritizes freestanding furniture and portable accessories.'
    );
  }
  if (rules.keepExistingFixtures) {
    notes.push(
      'Keep Existing Fixtures (Active): Leaves landlord-installed ceiling lights, blinds, and hardware untouched.'
    );
  }
  if (rules.keepExistingFurniture) {
    notes.push(
      'Keep Existing Furniture (Active): Styled around your primary anchor furniture before suggesting new purchases.'
    );
  }

  return notes;
}

export interface RenterValidationScenario {
  id: string;
  label: string;
  shortDescription: string;
  samplePresetId: string;
  preferences: RedesignPreferences;
  simulatedVerifiedPrices?: Record<string, number>;
}

export const RENTER_VALIDATION_SCENARIOS: RenterValidationScenario[] = [
  {
    id: 'budget-50',
    label: '$50 Tight Budget Renter',
    shortDescription: 'A renter with a strict $50 max budget looking for affordable cozy upgrades.',
    samplePresetId: 'brooklyn-living',
    preferences: {
      ...DEFAULT_PREFERENCES,
      roomType: 'Living Room',
      style: 'Organic Modern',
      budget: 'Under $100',
      maxBudgetDollars: 50,
      budgetIntent: 'few_affordable',
      existingFurnitureMode: 'keep_all',
      identifiedFurniture: ['Sofa / Sectional', 'Coffee Table'],
      improvementGoal: 'Make the room feel cozier.',
    },
    simulatedVerifiedPrices: {
      'rec-throw-pillow-covers': 32,
      'rec-woven-storage-baskets': 38,
    },
  },
  {
    id: 'no-paint-no-drill',
    label: 'Strict No-Paint & No-Drill Lease',
    shortDescription: 'Cannot paint, drill, hardwire, or use permanent wall adhesives.',
    samplePresetId: 'brooklyn-living',
    preferences: {
      ...DEFAULT_PREFERENCES,
      rentalRules: {
        noPainting: true,
        noDrilling: true,
        noHardwiring: true,
        noPermanentAdhesives: true,
        removableDecorOnly: true,
        keepExistingFixtures: true,
        preserveLayout: true,
        keepExistingFurniture: true,
      },
    },
  },
  {
    id: 'small-studio',
    label: 'Small Studio Apartment',
    shortDescription: 'Compact studio requiring multi-purpose scale, clear walkways, and vertical storage.',
    samplePresetId: 'austin-studio',
    preferences: {
      ...DEFAULT_PREFERENCES,
      roomType: 'Studio Apartment',
      style: 'Warm Minimalist',
      isSmallSpace: true,
      budget: '$100–$300',
      maxBudgetDollars: 250,
      budgetIntent: 'few_affordable',
      existingFurnitureMode: 'keep_selected',
      identifiedFurniture: ['Bed Frame & Mattress', 'Desk & Task Chair'],
      improvementGoal: 'Make a small room feel better organized.',
    },
  },
  {
    id: 'keep-existing-furniture',
    label: 'Keep Existing Furniture',
    shortDescription: 'Wants to keep gray sofa, coffee table, and TV stand and style around them.',
    samplePresetId: 'brooklyn-living',
    preferences: {
      ...DEFAULT_PREFERENCES,
      existingFurnitureMode: 'keep_all',
      identifiedFurniture: ['Sofa / Sectional', 'Coffee Table', 'TV Stand / Media Console'],
      identifiedFurnitureNotes: 'Existing neutral fabric sectional and round oak coffee table.',
      budget: '$100–$300',
      maxBudgetDollars: 200,
      budgetIntent: 'few_affordable',
    },
  },
  {
    id: 'inspiration-no-purchase',
    label: 'Inspiration Only ($0 Spend)',
    shortDescription: 'Wants visual inspiration and free layout ideas without buying anything.',
    samplePresetId: 'chicago-bedroom',
    preferences: {
      ...DEFAULT_PREFERENCES,
      roomType: 'Bedroom',
      style: 'Japandi',
      budget: 'Inspiration Only',
      maxBudgetDollars: 0,
      budgetIntent: 'existing_only',
      existingFurnitureMode: 'keep_all',
      identifiedFurniture: ['Bed Frame & Mattress', 'Floor / Table Lamps'],
    },
  },
  {
    id: 'exceeds-budget',
    label: 'Selected Products Exceed Budget',
    shortDescription: 'Has a $120 budget cap with $250+ of recommendations to test excess alert & revision.',
    samplePresetId: 'brooklyn-living',
    preferences: {
      ...DEFAULT_PREFERENCES,
      roomType: 'Living Room',
      style: 'Mid-Century Modern',
      budget: '$300–$500',
      maxBudgetDollars: 120,
      budgetIntent: 'refresh_most',
      existingFurnitureMode: 'replace_necessary',
    },
    simulatedVerifiedPrices: {
      'rec-throw-pillow-covers': 34,
      'rec-ceramic-table-lamp': 58,
      'rec-plugin-arc-floor-lamp': 115,
      'rec-flatweave-area-rug': 195,
    },
  },
  {
    id: 'locked-architecture',
    label: 'Locked Architectural Features',
    shortDescription: 'Photo has wall colors, flooring, windows, doors, built-in cabinets, and fixed lighting that must remain unchanged.',
    samplePresetId: 'chicago-bedroom',
    preferences: {
      ...DEFAULT_PREFERENCES,
      roomType: 'Bedroom',
      style: 'Modern Classic',
      preservedArchitecture: {
        wallColors: true,
        existingFlooring: true,
        windows: true,
        doors: true,
        builtInCabinets: true,
        fixedLighting: true,
        architecturalFeatures: true,
      },
    },
  },
];

export function formatApiErrorMessage(statusOrCode: number | string, fallbackMessage?: string): string {
  if (statusOrCode === 401 || statusOrCode === 403 || statusOrCode === 'INVALID_API_KEY') {
    return 'Invalid or unauthorized API key. Please verify GEMINI_API_KEY in the AI Studio Secrets panel or switch to Demo Mode.';
  }
  if (statusOrCode === 429 || statusOrCode === 'RATE_LIMIT') {
    return 'AI service rate limit or quota reached (HTTP 429). Please wait a moment and click Retry, or use Demo Mode.';
  }
  if (statusOrCode === 408 || statusOrCode === 504 || statusOrCode === 'TIMEOUT') {
    return 'The room generation request timed out before the AI provider responded. Please check your connection and click Retry.';
  }
  if (statusOrCode === 'NETWORK_ERROR') {
    return 'Network error: Unable to reach the Eden Canvas server. Please check your internet connection and try again.';
  }
  return fallbackMessage || 'Unable to complete room generation. Please review your selections and try again.';
}

export function createInitialCreditState(): CreditState {
  return {
    freeTrialRemaining: 5,
    projectPassCredits: 0,
    hasProjectPass: false,
    passExpiresAt: null,
  };
}

export function canConsumeDesignCredit(state: CreditState): boolean {
  return state.freeTrialRemaining > 0 || state.projectPassCredits > 0;
}

export function consumeDesignCredit(state: CreditState): CreditState {
  if (state.projectPassCredits > 0) {
    return {
      ...state,
      projectPassCredits: state.projectPassCredits - 1,
    };
  }
  if (state.freeTrialRemaining > 0) {
    return {
      ...state,
      freeTrialRemaining: state.freeTrialRemaining - 1,
    };
  }
  return state;
}

export function createAnalyticsEvent(
  name: AnalyticsEventName,
  rawMetadata: Record<string, string | number | boolean> = {}
): AnalyticsEventRecord {
  const safeMetadata: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(rawMetadata)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('image') ||
      lowerKey.includes('photo') ||
      lowerKey.includes('base64') ||
      lowerKey.includes('address') ||
      lowerKey.includes('email') ||
      lowerKey.includes('key') ||
      lowerKey.includes('secret')
    ) {
      continue;
    }
    if (typeof value === 'string' && value.length > 120) {
      safeMetadata[key] = value.slice(0, 120);
    } else {
      safeMetadata[key] = value;
    }
  }

  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    timestamp: new Date().toISOString(),
    metadata: safeMetadata,
  };
}
