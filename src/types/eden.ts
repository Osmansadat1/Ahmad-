export type RoomType =
  | 'Studio'
  | 'Living Room'
  | 'Bedroom'
  | 'Bathroom'
  | 'Kitchen'
  | 'Studio Apartment'
  | 'Home Office'
  | 'Dining Area'
  | 'Other';

export type DesignStyle =
  | 'Japandi'
  | 'Organic Modern'
  | 'Cozy Modern'
  | 'Quiet Luxury'
  | 'Mid-Century Modern'
  | 'Warm Minimalist'
  | 'Modern Classic'
  | 'Dark Cozy'
  | 'Contemporary Eclectic';

export type BudgetTier =
  | 'Under $100'
  | '$100–$300'
  | '$300–$500'
  | '$500–$1,000'
  | 'Inspiration Only';

export type ExistingFurnitureMode =
  | 'keep_all'
  | 'keep_selected'
  | 'replace_necessary'
  | 'mostly_empty';

export type BudgetIntent =
  | 'existing_only'
  | 'few_affordable'
  | 'refresh_most'
  | 'inspiration_no_limit';

export type ActionCostTier = 'free' | 'low_cost' | 'optional_upgrade';

export interface RentalRules {
  noPainting: boolean;
  noDrilling: boolean;
  noHardwiring: boolean;
  noPermanentAdhesives: boolean;
  removableDecorOnly: boolean;
  keepExistingFixtures: boolean;
  preserveLayout: boolean;
  keepExistingFurniture: boolean;
}

export interface PreservedArchitecture {
  wallColors: boolean;
  existingFlooring: boolean;
  windows: boolean;
  doors: boolean;
  builtInCabinets: boolean;
  fixedLighting: boolean;
  architecturalFeatures: boolean;
}

export interface RedesignPreferences {
  roomType: RoomType;
  style: DesignStyle;
  budget: BudgetTier;
  maxBudgetDollars: number | null;
  budgetIntent: BudgetIntent;
  existingFurnitureMode: ExistingFurnitureMode;
  identifiedFurniture: string[];
  identifiedFurnitureNotes: string;
  isSmallSpace: boolean;
  improvementGoal: string;
  customInstruction: string;
  rentalRules: RentalRules;
  preservedArchitecture: PreservedArchitecture;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  category: string;
  verifiedPrice: string | null;
  verifiedPriceDollars: number | null;
  estimatedMidpointDollars: number;
  dimensionsLabel: string;
  costTier: ActionCostTier;
  budgetCategory: BudgetTier;
  typicalRangeLabel: string;
  styles: DesignStyle[];
  roomTypes: RoomType[];
  fitReason: string;
  renterExplanation: string;
  smallSpaceBenefit?: string;
  requiresDrilling: boolean;
  requiresHardwiring: boolean;
  requiresPainting: boolean;
  usesAdhesive: boolean;
  replacesFixture: boolean;
  searchQuery: string;
  retailerSearchUrl: string;
  visualType:
    | 'floor-lamp'
    | 'table-lamp'
    | 'area-rug'
    | 'linen-curtains'
    | 'throw-pillows'
    | 'wood-console'
    | 'woven-baskets'
    | 'olive-planter'
    | 'peel-art';
  paletteSwatches: [string, string, string];
}

export interface ActionPlanStep {
  stepNumber: number;
  title: string;
  description: string;
  costTier: ActionCostTier;
  costLabel: string;
}

export interface BudgetCalculationSummary {
  maxBudgetDollars: number | null;
  budgetIntent: BudgetIntent;
  recommendedCount: number;
  verifiedItemCount: number;
  unverifiedItemCount: number;
  verifiedSubtotalDollars: number;
  estimatedRangeMinDollars: number;
  estimatedRangeMaxDollars: number;
  remainingBudgetDollars: number | null;
  exceedsBudgetByDollars: number | null;
  isOverBudget: boolean;
  exclusionNote: string;
  statusMessage: string;
}

export interface RedesignResult {
  id: string;
  variationNumber: number;
  createdAt: string;
  mode: 'live_ai' | 'demo_fallback';
  modeReason?: string;
  originalImageDataUrl: string;
  redesignedImageDataUrl: string;
  preferences: RedesignPreferences;
  promptUsed: string;
  serverConfirmedPrompt?: string;
  architecturalNotes: string[];
  renterComplianceNotes: string[];
  smallSpaceNotes: string[];
  designSummary: string;
  actionPlan: ActionPlanStep[];
  recommendations: ProductRecommendation[];
  budgetSummary: BudgetCalculationSummary;
  budgetGuidance: string;
}

export type AnalyticsEventName =
  | 'homepage_viewed'
  | 'upload_started'
  | 'photo_uploaded_successfully'
  | 'design_options_selected'
  | 'generation_requested'
  | 'generation_completed'
  | 'generation_failed'
  | 'before_after_viewed'
  | 'result_downloaded'
  | 'product_link_clicked'
  | 'pricing_page_viewed'
  | 'pricing_package_selected'
  | 'checkout_started'
  | 'checkout_completed'
  | 'checkout_cancelled'
  | 'payment_failed'
  | 'credits_granted'
  | 'credits_used'
  | 'insufficient_credits_shown'
  | 'repeat_purchase'
  | 'purchase_completed'
  | 'studio_viewed'
  | 'landing_viewed';

export interface AnalyticsEventRecord {
  id: string;
  name: AnalyticsEventName;
  timestamp: string;
  metadata: Record<string, string | number | boolean>;
}

export interface CreditState {
  freeTrialRemaining: number;
  projectPassCredits: number;
  hasProjectPass: boolean;
  passExpiresAt: string | null;
}
