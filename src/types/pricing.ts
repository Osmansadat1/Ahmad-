/**
 * Centralized Pricing, Credit Ledger, Payment Checkout & Admin Configuration Types
 */

export type PackagePlanId = 'free' | 'starter' | 'room_refresh' | 'home_makeover';

export interface CreditPackageConfig {
  id: PackagePlanId;
  code: 'Plan A' | 'Plan B' | 'Plan C' | 'Plan D';
  name: string;
  tagline: string;
  priceCents: number;
  priceFormatted: string;
  billingType: 'free_trial' | 'one_time';
  credits: number;
  expirationMonths: number | null;
  recommended: boolean;
  active: boolean;
  ctaLabel: string;
  benefits: string[];
  limitationsDisclosure: string[];
  providerProductId: string;
  providerPriceId: string;
}

export interface CreditCostConfig {
  roomRedesignStandard: number;
}

export interface RefundAndReversalPolicy {
  refundOnGenerationFailure: boolean;
  reverseCreditsOnPaymentRefund: boolean;
  allowNegativeBalanceOnChargeback: boolean;
  policyDisclosureNote: string;
}

export interface PricingSystemConfig {
  currency: 'USD';
  initialFreeTrialCredits: number;
  creditCosts: CreditCostConfig;
  refundPolicy: RefundAndReversalPolicy;
  packages: CreditPackageConfig[];
  updatedAt: string;
  isLaunchHypothesis: boolean;
}

export type CreditTransactionType =
  | 'trial_grant'
  | 'purchase_grant'
  | 'generation_deduction'
  | 'generation_refund'
  | 'credit_expiration'
  | 'payment_refund_reversal'
  | 'admin_adjustment';

export interface CreditGrantLot {
  id: string;
  packageId: PackagePlanId;
  packageName: string;
  creditsGranted: number;
  creditsRemaining: number;
  purchasedAt: string;
  expiresAt: string | null;
  expiredProcessed: boolean;
  checkoutSessionId?: string;
}

export interface CreditTransaction {
  id: string;
  accountId: string;
  type: CreditTransactionType;
  amount: number; // positive for grants/refunds, negative for deductions/expirations/reversals
  balanceAfter: number;
  description: string;
  packageId?: PackagePlanId;
  checkoutSessionId?: string;
  webhookEventId?: string;
  operationId?: string;
  createdAt: string;
  expiresAt?: string | null;
}

export type GenerationAttemptStatus = 'in_progress' | 'completed' | 'failed_refunded' | 'failed_no_refund';

export interface GenerationAttemptRecord {
  id: string;
  operationId: string;
  accountId: string;
  roomType: string;
  style: string;
  creditCost: number;
  status: GenerationAttemptStatus;
  mode?: 'live_ai' | 'demo_fallback';
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AccountBalanceSummary {
  accountId: string;
  availableCredits: number;
  creditsPurchased: number;
  creditsUsed: number;
  creditsExpired: number;
  trialCreditsGranted: number;
  activeExpiringLot: {
    creditsRemaining: number;
    expiresAt: string;
    packageName: string;
  } | null;
  expiredNotices: Array<{
    lotId: string;
    packageName: string;
    expiredCredits: number;
    expiredAt: string;
  }>;
  grants: CreditGrantLot[];
  transactions: CreditTransaction[];
  generationHistory: GenerationAttemptRecord[];
  purchaseCount: number;
}

export type CheckoutSessionStatus =
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'refunded';

export interface CheckoutSessionRecord {
  id: string;
  accountId: string;
  packageId: PackagePlanId;
  packageName: string;
  priceCents: number;
  priceFormatted: string;
  creditsToGrant: number;
  expirationMonths: number | null;
  billingType: 'one_time';
  providerMode: 'development_demo' | 'live_provider';
  providerName: string;
  status: CheckoutSessionStatus;
  checkoutUrl: string;
  successUrl: string;
  cancelUrl: string;
  creditsGranted: boolean;
  webhookEventId?: string;
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
}

export type PricingAnalyticsEventName =
  | 'pricing_page_viewed'
  | 'pricing_package_selected'
  | 'checkout_started'
  | 'checkout_completed'
  | 'checkout_cancelled'
  | 'payment_failed'
  | 'credits_granted'
  | 'credits_used'
  | 'generation_failed'
  | 'insufficient_credits_shown'
  | 'repeat_purchase';
