/**
 * Eden Canvas Configuration & Constants
 * Quiet Luxury damage-free interior design platform for US renters.
 */

export const START_CREDITS = 1;
export const EMAIL_BONUS = 0;
export const AMAZON_AFFILIATE_TAG = 'Sayedosmanema-20';

export type RoomTypeId = 'Living Room' | 'Kitchen' | 'Bedroom' | 'Bathroom';

export interface RoomOption {
  id: RoomTypeId;
  label: string;
  beforePhoto: string;
  sampleAfterPhoto: string;
}

export const ROOM_OPTIONS: RoomOption[] = [
  {
    id: 'Living Room',
    label: 'Living Room',
    beforePhoto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sampleAfterPhoto: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'Kitchen',
    label: 'Kitchen',
    beforePhoto: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
    sampleAfterPhoto: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'Bedroom',
    label: 'Bedroom',
    beforePhoto: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    sampleAfterPhoto: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'Bathroom',
    label: 'Bathroom',
    beforePhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    sampleAfterPhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
  },
];

export type StyleId =
  | 'Japandi'
  | 'Organic Modern'
  | 'Cozy Modern'
  | 'Quiet Luxury'
  | 'Refined Farmhouse';

export interface StyleOption {
  id: StyleId;
  label: string;
  description: string;
  promptDescription: string;
  photoUrl: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'Japandi',
    label: 'Japandi',
    description: 'Warm wood, low furniture, calm neutrals',
    promptDescription: 'warm wood, low furniture, calm neutrals',
    photoUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Organic Modern',
    label: 'Organic Modern',
    description: 'Natural textures, curves, linen, rattan',
    promptDescription: 'natural textures, curves, linen, rattan',
    photoUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Cozy Modern',
    label: 'Cozy Modern',
    description: 'Layered textiles, soft rounded furniture, warm light',
    promptDescription: 'layered textiles, soft rounded furniture, warm light',
    photoUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Quiet Luxury',
    label: 'Quiet Luxury',
    description: 'Muted palette, premium natural materials, restrained decor',
    promptDescription: 'muted palette, premium natural materials, restrained decor',
    photoUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Refined Farmhouse',
    label: 'Refined Farmhouse',
    description: 'Warm whites, light oak, matte black accents',
    promptDescription: 'warm whites, light oak, matte black accents',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
];

export interface GalleryStyleItem {
  id: string;
  name: string;
  subtitle: string;
  photoUrl: string;
}

export const GALLERY_STYLES: GalleryStyleItem[] = [
  {
    id: 'japandi',
    name: 'Japandi',
    subtitle: 'Calm minimalism & warm oak',
    photoUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'organic-modern',
    name: 'Organic Modern',
    subtitle: 'Curves, woven linen & raw clay',
    photoUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cozy-modern',
    name: 'Cozy Modern',
    subtitle: 'Bouclé textures & 2700K warmth',
    photoUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'quiet-luxury',
    name: 'Quiet Luxury',
    subtitle: 'Rich walnut, bronze & gallery layout',
    photoUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'refined-farmhouse',
    name: 'Refined Farmhouse',
    subtitle: 'Alabaster walls, light wood & clean lines',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'warm-minimalist',
    name: 'Warm Minimalist',
    subtitle: 'Understated comfort & natural light',
    photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
];

export type PresetId =
  | '90s Honey-Oak Cabinet Wrap'
  | 'Hide Carpet with Area Rug'
  | 'Zero-Drill Lighting'
  | 'Removable Wallpaper';

export interface PresetOption {
  id: PresetId;
  label: string;
  plainLanguage: string;
}

export const PRESET_OPTIONS: PresetOption[] = [
  {
    id: '90s Honey-Oak Cabinet Wrap',
    label: '90s Honey-Oak Cabinet Wrap',
    plainLanguage: 'removable matte film over existing cabinets',
  },
  {
    id: 'Hide Carpet with Area Rug',
    label: 'Hide Carpet with Area Rug',
    plainLanguage: 'large layered rug over existing carpet',
  },
  {
    id: 'Zero-Drill Lighting',
    label: 'Zero-Drill Lighting',
    plainLanguage: 'plug-in sconces and lamps',
  },
  {
    id: 'Removable Wallpaper',
    label: 'Removable Wallpaper',
    plainLanguage: 'one accent wall of removable peel-and-stick paper',
  },
];

export type LandlordSpecialId =
  | 'boob-light'
  | 'beige-carpet'
  | 'popcorn-ceiling'
  | 'electrical-panel'
  | 'painted-vents'
  | 'dated-cabinets';

export interface LandlordSpecialOption {
  id: LandlordSpecialId;
  label: string;
  solution: string;
  promptInstruction: string;
}

export const LANDLORD_SPECIAL_OPTIONS: LandlordSpecialOption[] = [
  {
    id: 'boob-light',
    label: 'Flush-Mount "Boob" Light',
    solution: 'Oversized plug-in/hanging shade alternative or fabric drum diffuser',
    promptInstruction: 'Replace visual impact of the flush-mount boob ceiling light with an oversized plug-in pendant or fabric drum diffuser. Zero hardwiring or ceiling electrical modification.',
  },
  {
    id: 'beige-carpet',
    label: 'Beige / Worn Carpet',
    solution: 'Layered neutral textured area rugs',
    promptInstruction: 'Layer a large textured low-pile neutral area rug over the existing wall-to-wall carpet to conceal stains and define the living zone without pulling up flooring.',
  },
  {
    id: 'popcorn-ceiling',
    label: 'Popcorn Ceiling',
    solution: 'Draw eye downward with warm 2700K lighting & vertical textiles',
    promptInstruction: 'Do not scrape or touch popcorn ceiling. Draw the visual focal point downward with low-hung warm 2700K floor lamps, floor-to-ceiling vertical linen drapery, and low-profile furniture.',
  },
  {
    id: 'electrical-panel',
    label: 'Exposed Electrical Panel',
    solution: 'Leaning oversized framed art or tension textile screen',
    promptInstruction: 'Conceal the exposed metal utility or electrical panel using oversized leaning framed canvas art or a tension-mounted linen screen. Do not paint or adhere directly to the breaker door.',
  },
  {
    id: 'painted-vents',
    label: 'Thick Painted-Over Vents',
    solution: 'Leave untouched; balance with architectural symmetry',
    promptInstruction: 'Leave painted-over HVAC vents strictly untouched. Balance the wall composition with symmetrical shelving, leaning artwork, or ambient plant stands to de-emphasize the vent.',
  },
  {
    id: 'dated-cabinets',
    label: 'Dated Honey-Oak Cabinets',
    solution: 'Removable architectural matte vinyl wrap',
    promptInstruction: 'Apply removable matte architectural vinyl contact wrap in soft oat or muted alabaster over dated 90s honey-oak cabinets. Zero sanding, stripping, or paint.',
  },
];

export type BudgetTier = 50 | 150 | 300;
export const BUDGET_TIERS: BudgetTier[] = [50, 150, 300];

export type ShopPriceTier = 'all' | 'under-50' | 'under-150';

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  searchQuery?: string;
  asin?: string;
  tier: 'under-50' | 'under-150';
  priceEstimate: string;
  thumbnail: string;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'cabinet-wrap',
    name: 'Matte cabinet vinyl wrap',
    description: 'Removable, damage-free matte film to transform outdated kitchen & bathroom cabinets without paint.',
    searchQuery: 'matte cabinet vinyl wrap removable contact paper',
    tier: 'under-50',
    priceEstimate: 'Typically under $50',
    thumbnail: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'marble-tiles',
    name: 'Peel-and-stick marble tiles',
    description: 'Heat-resistant, removable adhesive backsplash tiles that lift clean when moving out.',
    searchQuery: 'peel and stick marble backsplash tiles renter friendly',
    tier: 'under-50',
    priceEstimate: 'Typically under $50',
    thumbnail: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'textured-rug',
    name: 'Textured washable area rug',
    description: 'Low-pile, washable neutral rug designed to layer directly over stained or worn rental carpeting.',
    searchQuery: 'textured washable area rug neutral renter friendly',
    tier: 'under-150',
    priceEstimate: 'Typically under $150',
    thumbnail: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'arched-lamp',
    name: '2700K arched floor lamp',
    description: 'Plug-in overhead warm lighting that brings cozy ambient light without ceiling hardwiring or drilling.',
    searchQuery: '2700k arched floor lamp brass plug in dimmable',
    tier: 'under-150',
    priceEstimate: 'Typically under $150',
    thumbnail: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'hanging-strips',
    name: 'Damage-free hanging strips',
    description: 'Heavy-duty interlocking adhesive picture strips that hold frames securely and release cleanly.',
    searchQuery: 'command picture hanging strips heavy duty damage free',
    tier: 'under-50',
    priceEstimate: 'Typically under $50',
    thumbnail: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=400&q=80',
  },
];

/**
 * Build Amazon Affiliate Search Link with compulsory tag=Sayedosmanema-20
 */
export function buildAmazonAffiliateUrl(product: ShopProduct): string {
  if (product.asin) {
    const params = new URLSearchParams({ tag: AMAZON_AFFILIATE_TAG });
    return `https://www.amazon.com/dp/${encodeURIComponent(product.asin)}?${params.toString()}`;
  }
  const query = product.searchQuery || product.name;
  const params = new URLSearchParams({
    k: query,
    tag: AMAZON_AFFILIATE_TAG,
  });
  return `https://www.amazon.com/s?${params.toString()}`;
}

export interface PricingPackage {
  id: string;
  name: string;
  priceFormatted: string;
  priceAmount: number;
  credits: number;
  pricePerCredit: string;
  validityLine: string;
  popular?: boolean;
  cta: string;
}

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    priceFormatted: '$9',
    priceAmount: 9.0,
    credits: 25,
    pricePerCredit: '$0.36 / credit',
    validityLine: 'Valid 6 months',
    cta: 'Get Starter Pack',
  },
  {
    id: 'most-popular',
    name: 'Most Popular',
    priceFormatted: '$19',
    priceAmount: 19.0,
    credits: 75,
    pricePerCredit: '$0.25 / credit',
    validityLine: 'Includes Room Refresh Blueprint',
    popular: true,
    cta: 'Get Most Popular',
  },
  {
    id: 'vip-studio-pass',
    name: 'VIP Studio Pass',
    priceFormatted: '$29',
    priceAmount: 29.0,
    credits: 150,
    pricePerCredit: '$0.19 / credit',
    validityLine: 'Full 60-Page Vault & Planner',
    cta: 'Get VIP Studio Pass',
  },
];

/**
 * Configurable Checkout Links mapping.
 * When empty, the app shows a gentle toast: "Checkout isn't connected yet."
 */
export const CHECKOUT_PAYMENT_LINKS: Record<string, string> = {
  free: '',
  starter: '',
  'room-refresh': '',
  'home-makeover': '',
};

export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'burnermail.io',
  'fakeinbox.com',
  'maildrop.cc',
  'mohmal.com',
  'crazymailing.com',
  'throwawaymail.com',
]);

export function validateEmailAddress(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return { valid: false, error: 'Please enter your email address.' };
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@gmail.com).' };
  }
  const domain = trimmed.split('@')[1];
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'Disposable temporary emails are blocked. Please use your standard personal or work email.',
    };
  }
  return { valid: true };
}

/**
 * Analytics Hooks (Configurable Pinterest Tag & Meta Pixel)
 */
export type AnalyticsEventType = 'upload' | 'generate' | 'unlock' | 'purchase_click';

export interface AnalyticsPayload {
  roomType?: string;
  style?: string;
  presets?: string[];
  creditsRemaining?: number;
  packageId?: string;
  [key: string]: unknown;
}

export function trackEvent(eventName: AnalyticsEventType, payload: AnalyticsPayload = {}) {
  // Empty configuration hooks ready for Pinterest Tag / Meta Pixel
  if (typeof window !== 'undefined') {
    // 1. Meta Pixel hook
    const win = window as unknown as {
      fbq?: (action: string, event: string, data?: unknown) => void;
      pintrk?: (action: string, event: string, data?: unknown) => void;
    };
    if (typeof win.fbq === 'function') {
      try {
        win.fbq('trackCustom', eventName, payload);
      } catch {
        // no-op
      }
    }
    // 2. Pinterest Tag hook
    if (typeof win.pintrk === 'function') {
      try {
        win.pintrk('track', eventName, payload);
      } catch {
        // no-op
      }
    }
  }
}
