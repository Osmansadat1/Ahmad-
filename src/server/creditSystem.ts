import crypto from 'crypto';
import {
  AccountBalanceSummary,
  CheckoutSessionRecord,
  CreditGrantLot,
  CreditPackageConfig,
  CreditTransaction,
  GenerationAttemptRecord,
  PackagePlanId,
  PricingSystemConfig,
} from '../types/pricing';

export function formatUsdFromCents(cents: number): string {
  if (cents === 0) return '$0';
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

export function createDefaultPricingConfig(): PricingSystemConfig {
  return {
    currency: 'USD',
    initialFreeTrialCredits: 3,
    creditCosts: {
      roomRedesignStandard: 1,
    },
    refundPolicy: {
      refundOnGenerationFailure: true,
      reverseCreditsOnPaymentRefund: true,
      allowNegativeBalanceOnChargeback: false,
      policyDisclosureNote:
        'If an AI room generation fails due to a provider error, rate limit, or timeout, the deducted credit is automatically refunded to your balance. Refund policies for completed one-time credit package purchases require owner configuration before production launch.',
    },
    isLaunchHypothesis: true,
    updatedAt: new Date().toISOString(),
    packages: [
      {
        id: 'free',
        code: 'Plan A',
        name: 'Free',
        tagline: 'Try Eden Canvas on your room before spending anything.',
        priceCents: 0,
        priceFormatted: '$0',
        billingType: 'free_trial',
        credits: 3,
        expirationMonths: null,
        recommended: false,
        active: true,
        ctaLabel: 'Start Free',
        benefits: [
          '3 initial trial credits (1 credit per room redesign)',
          'Try the room redesign workflow on your own photo or sample rooms',
          'Choose a room type, design style, budget, and renter-friendly restrictions',
          'Preview before-and-after comparisons and step-by-step action plans',
          'No payment card required to start',
        ],
        limitationsDisclosure: [
          'Limited to 3 initial trial credits per account; does not include unlimited image generation.',
          'Output resolution and live AI generation depend on server Gemini API configuration; falls back to labeled Demo Mode concepts when live quota is unavailable.',
        ],
        providerProductId: 'prod_eden_free_trial',
        providerPriceId: 'price_eden_free_0',
      },
      {
        id: 'starter',
        code: 'Plan B',
        name: 'Starter',
        tagline: 'Ideal for refreshing a single bedroom, living area, or studio corner.',
        priceCents: 599,
        priceFormatted: '$5.99',
        billingType: 'one_time',
        credits: 20,
        expirationMonths: null,
        recommended: false,
        active: true,
        ctaLabel: 'Get Starter',
        benefits: [
          '20 design credits (one-time purchase, never recurring)',
          'Explore additional design concepts and compare room styles',
          'Refine design preferences, furniture retention, and rental rules',
          'Access supported concept image downloads and budget action plans',
        ],
        limitationsDisclosure: [
          'One-time credit package purchase (not a subscription).',
          'Each room redesign generation uses 1 credit.',
        ],
        providerProductId: 'prod_eden_starter_20',
        providerPriceId: 'price_eden_starter_599',
      },
      {
        id: 'room_refresh',
        code: 'Plan C',
        name: 'Room Refresh',
        tagline: 'Our most balanced package for testing multiple styles and furniture layouts.',
        priceCents: 1200,
        priceFormatted: '$12.00',
        billingType: 'one_time',
        credits: 50,
        expirationMonths: 6,
        recommended: true,
        active: true,
        ctaLabel: 'Get Room Refresh',
        benefits: [
          '50 design credits (one-time purchase, no recurring billing)',
          'Generate multiple room concepts across all 6 interior styles',
          'Explore different renter-friendly options and architectural locks',
          'Create budget-aware room refresh plans with subtotal tracking',
          'Prioritize furniture and decor you already own',
        ],
        limitationsDisclosure: [
          'Unused credits in the Room Refresh package expire 6 months (180 days) after purchase date.',
          'Expiration dates are tracked and displayed in your credit ledger.',
        ],
        providerProductId: 'prod_eden_room_refresh_50',
        providerPriceId: 'price_eden_room_refresh_1200',
      },
      {
        id: 'home_makeover',
        code: 'Plan D',
        name: 'Home Makeover',
        tagline: 'Built for moving into a new apartment or planning a multi-room refresh.',
        priceCents: 2400,
        priceFormatted: '$24.00',
        billingType: 'one_time',
        credits: 120,
        expirationMonths: null,
        recommended: false,
        active: true,
        ctaLabel: 'Get Home Makeover',
        benefits: [
          '120 design credits (one-time purchase, no recurring billing)',
          'Design multiple rooms (living room, bedroom, studio, home office, dining)',
          'Compare more design alternatives and lighting directions',
          'Iterate on room concepts and plan a broader apartment refresh',
        ],
        limitationsDisclosure: [
          'One-time credit package purchase (not a subscription).',
          'Each room redesign generation uses 1 credit.',
        ],
        providerProductId: 'prod_eden_home_makeover_120',
        providerPriceId: 'price_eden_home_makeover_2400',
      },
    ],
  };
}

interface InternalAccountRecord {
  accountId: string;
  sessionToken: string;
  createdAt: string;
  creditsPurchased: number;
  creditsUsed: number;
  creditsExpired: number;
  trialCreditsGranted: number;
  grants: CreditGrantLot[];
  transactions: CreditTransaction[];
  generationHistory: GenerationAttemptRecord[];
  expiredNotices: Array<{
    lotId: string;
    packageName: string;
    expiredCredits: number;
    expiredAt: string;
  }>;
  inFlightLocks: Set<string>;
}

export class CreditSystemStore {
  private config: PricingSystemConfig;
  private accounts = new Map<string, InternalAccountRecord>();
  private checkoutSessions = new Map<string, CheckoutSessionRecord>();
  private processedWebhookEvents = new Set<string>();
  private processedOperations = new Map<
    string,
    { accountId: string; status: 'deducted' | 'completed' | 'refunded'; creditCost: number }
  >();

  constructor(initialConfig?: PricingSystemConfig) {
    this.config = initialConfig ? structuredClone(initialConfig) : createDefaultPricingConfig();
  }

  public getConfig(): PricingSystemConfig {
    return structuredClone(this.config);
  }

  public getPaymentEnvironmentStatus(): {
    providerMode: 'development_demo' | 'live_provider';
    providerName: string;
    liveCredentialsConfigured: boolean;
    webhookSecretConfigured: boolean;
    adminTokenConfigured: boolean;
    persistenceMode: 'in_memory_server_ledger';
    authMode: 'session_token_isolated';
    productionChecklist: string[];
  } {
    const providerName = (process.env.PAYMENT_PROVIDER || '').trim();
    const secretKey = (process.env.PAYMENT_PROVIDER_SECRET_KEY || '').trim();
    const webhookSecret = (process.env.PAYMENT_WEBHOOK_SECRET || '').trim();
    const adminToken = (process.env.ADMIN_CONFIG_TOKEN || '').trim();

    const liveCredentialsConfigured = Boolean(providerName && secretKey);
    return {
      providerMode: liveCredentialsConfigured ? 'live_provider' : 'development_demo',
      providerName: providerName || 'unconfigured_development_sandbox',
      liveCredentialsConfigured,
      webhookSecretConfigured: Boolean(webhookSecret),
      adminTokenConfigured: Boolean(adminToken),
      persistenceMode: 'in_memory_server_ledger',
      authMode: 'session_token_isolated',
      productionChecklist: [
        'Configure PAYMENT_PROVIDER and PAYMENT_PROVIDER_SECRET_KEY in server environment secrets once merchant entity & settlement country are verified.',
        'Configure PAYMENT_WEBHOOK_SECRET and register POST /api/webhooks/payment with your payment provider.',
        'Configure ADMIN_CONFIG_TOKEN to restrict /api/admin/pricing to authorized administrators in production.',
        'Connect persistent database storage (Cloud SQL PostgreSQL or Firebase Firestore) and user authentication before public production launch.',
      ],
    };
  }

  /**
   * Provision a new isolated user account with the initial free trial credit allowance
   */
  public createAccount(now: Date = new Date()): {
    accountId: string;
    sessionToken: string;
    summary: AccountBalanceSummary;
  } {
    const accountId = `acct_${crypto.randomBytes(8).toString('hex')}`;
    const sessionToken = `tok_${crypto.randomBytes(16).toString('hex')}`;
    const nowIso = now.toISOString();
    const initialTrial = this.config.initialFreeTrialCredits;

    const initialGrant: CreditGrantLot = {
      id: `lot_trial_${crypto.randomBytes(6).toString('hex')}`,
      packageId: 'free',
      packageName: 'Free Trial Allowance',
      creditsGranted: initialTrial,
      creditsRemaining: initialTrial,
      purchasedAt: nowIso,
      expiresAt: null,
      expiredProcessed: false,
    };

    const initialTx: CreditTransaction = {
      id: `tx_${crypto.randomBytes(6).toString('hex')}`,
      accountId,
      type: 'trial_grant',
      amount: initialTrial,
      balanceAfter: initialTrial,
      description: `Initial Free plan allowance (${initialTrial} trial credits)`,
      packageId: 'free',
      createdAt: nowIso,
      expiresAt: null,
    };

    const record: InternalAccountRecord = {
      accountId,
      sessionToken,
      createdAt: nowIso,
      creditsPurchased: 0,
      creditsUsed: 0,
      creditsExpired: 0,
      trialCreditsGranted: initialTrial,
      grants: [initialGrant],
      transactions: [initialTx],
      generationHistory: [],
      expiredNotices: [],
      inFlightLocks: new Set(),
    };

    this.accounts.set(accountId, record);
    return {
      accountId,
      sessionToken,
      summary: this.getAccountSummary(accountId, sessionToken, now),
    };
  }

  /**
   * Verify that the caller owns the account via its sessionToken
   */
  private getVerifiedAccount(accountId: string, sessionToken: string, now: Date = new Date()): InternalAccountRecord {
    if (!accountId || !sessionToken) {
      throw new Error('UNAUTHORIZED_ACCOUNT_ACCESS: Missing account ID or session token.');
    }
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('ACCOUNT_NOT_FOUND: The requested credit account does not exist.');
    }
    if (account.sessionToken !== sessionToken) {
      throw new Error('UNAUTHORIZED_ACCOUNT_ACCESS: Session token does not match the requested account.');
    }
    this.processExpirationsForAccount(account, now);
    return account;
  }

  /**
   * Enforce credit lot expiration dates transparently and auditably.
   * Never silently removes credits: records a 'credit_expiration' transaction and an expiration notice.
   */
  public processExpirationsForAccount(account: InternalAccountRecord, now: Date = new Date()): void {
    const nowMs = now.getTime();
    for (const lot of account.grants) {
      if (!lot.expiredProcessed && lot.expiresAt) {
        const expMs = new Date(lot.expiresAt).getTime();
        if (nowMs >= expMs) {
          lot.expiredProcessed = true;
          if (lot.creditsRemaining > 0) {
            const expiredAmount = lot.creditsRemaining;
            lot.creditsRemaining = 0;
            account.creditsExpired += expiredAmount;
            const currentAvail = this.computeAvailableCredits(account);

            account.transactions.unshift({
              id: `tx_exp_${crypto.randomBytes(6).toString('hex')}`,
              accountId: account.accountId,
              type: 'credit_expiration',
              amount: -expiredAmount,
              balanceAfter: currentAvail,
              description: `${expiredAmount} unused credit${expiredAmount === 1 ? '' : 's'} from ${lot.packageName} expired on ${new Date(lot.expiresAt).toLocaleDateString('en-US')}`,
              packageId: lot.packageId,
              createdAt: now.toISOString(),
              expiresAt: lot.expiresAt,
            });

            account.expiredNotices.unshift({
              lotId: lot.id,
              packageName: lot.packageName,
              expiredCredits: expiredAmount,
              expiredAt: lot.expiresAt,
            });
          }
        }
      }
    }
  }

  private computeAvailableCredits(account: InternalAccountRecord): number {
    return account.grants.reduce((sum, lot) => {
      if (lot.expiredProcessed) return sum;
      return sum + Math.max(0, lot.creditsRemaining);
    }, 0);
  }

  public getAccountSummary(accountId: string, sessionToken: string, now: Date = new Date()): AccountBalanceSummary {
    const account = this.getVerifiedAccount(accountId, sessionToken, now);
    const availableCredits = this.computeAvailableCredits(account);

    // Find the earliest expiring active lot with remaining credits
    const expiringLots = account.grants
      .filter((lot) => !lot.expiredProcessed && lot.creditsRemaining > 0 && lot.expiresAt !== null)
      .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());

    const activeExpiringLot =
      expiringLots.length > 0
        ? {
            creditsRemaining: expiringLots[0].creditsRemaining,
            expiresAt: expiringLots[0].expiresAt!,
            packageName: expiringLots[0].packageName,
          }
        : null;

    const purchaseCount = account.transactions.filter((t) => t.type === 'purchase_grant').length;

    return {
      accountId: account.accountId,
      availableCredits,
      creditsPurchased: account.creditsPurchased,
      creditsUsed: account.creditsUsed,
      creditsExpired: account.creditsExpired,
      trialCreditsGranted: account.trialCreditsGranted,
      activeExpiringLot,
      expiredNotices: structuredClone(account.expiredNotices),
      grants: structuredClone(account.grants),
      transactions: structuredClone(account.transactions),
      generationHistory: structuredClone(account.generationHistory),
      purchaseCount,
    };
  }

  /**
   * Begin a room redesign operation:
   * - Validates session ownership
   * - Prevents duplicate deductions for the same operationId
   * - Prevents concurrent race conditions when spending the last credit
   * - Deducts credits in FIFO order (earliest expiring lot first, then oldest lot)
   */
  public reserveCreditsForGeneration(params: {
    accountId: string;
    sessionToken: string;
    operationId: string;
    roomType: string;
    style: string;
    now?: Date;
  }): {
    deductedCredits: number;
    balanceAfter: number;
    alreadyProcessed: boolean;
    summary: AccountBalanceSummary;
  } {
    const now = params.now || new Date();
    const account = this.getVerifiedAccount(params.accountId, params.sessionToken, now);

    // Idempotency check: never deduct twice for the same operationId
    const existingOp = this.processedOperations.get(params.operationId);
    if (existingOp) {
      if (existingOp.accountId !== account.accountId) {
        throw new Error('OPERATION_ID_CONFLICT: Operation ID belongs to a different account.');
      }
      return {
        deductedCredits: existingOp.creditCost,
        balanceAfter: this.computeAvailableCredits(account),
        alreadyProcessed: true,
        summary: this.getAccountSummary(account.accountId, params.sessionToken, now),
      };
    }

    // Concurrency lock check
    if (account.inFlightLocks.has('credit_mutation')) {
      throw new Error('CONCURRENT_OPERATION_REJECTED: Another credit deduction is currently in progress.');
    }

    account.inFlightLocks.add('credit_mutation');
    try {
      const cost = this.config.creditCosts.roomRedesignStandard;
      const available = this.computeAvailableCredits(account);

      if (available < cost) {
        throw new Error(
          `INSUFFICIENT_CREDITS: This redesign requires ${cost} credit${cost === 1 ? '' : 's'}, but your available balance is ${available}. Please visit /pricing to add credits.`
        );
      }

      // Deduct from active lots: prioritize lots with earliest expiration date first, then oldest purchase date
      const eligibleLots = account.grants
        .filter((lot) => !lot.expiredProcessed && lot.creditsRemaining > 0)
        .sort((a, b) => {
          if (a.expiresAt && b.expiresAt) {
            return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
          }
          if (a.expiresAt && !b.expiresAt) return -1;
          if (!a.expiresAt && b.expiresAt) return 1;
          return new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime();
        });

      let remainingToDeduct = cost;
      for (const lot of eligibleLots) {
        if (remainingToDeduct <= 0) break;
        const deductHere = Math.min(lot.creditsRemaining, remainingToDeduct);
        lot.creditsRemaining -= deductHere;
        remainingToDeduct -= deductHere;
      }

      account.creditsUsed += cost;
      const newBalance = this.computeAvailableCredits(account);
      const nowIso = now.toISOString();

      account.transactions.unshift({
        id: `tx_use_${crypto.randomBytes(6).toString('hex')}`,
        accountId: account.accountId,
        type: 'generation_deduction',
        amount: -cost,
        balanceAfter: newBalance,
        description: `Room redesign generation (${params.style} ${params.roomType})`,
        operationId: params.operationId,
        createdAt: nowIso,
      });

      account.generationHistory.unshift({
        id: `gen_${crypto.randomBytes(6).toString('hex')}`,
        operationId: params.operationId,
        accountId: account.accountId,
        roomType: params.roomType,
        style: params.style,
        creditCost: cost,
        status: 'in_progress',
        createdAt: nowIso,
      });

      this.processedOperations.set(params.operationId, {
        accountId: account.accountId,
        status: 'deducted',
        creditCost: cost,
      });

      return {
        deductedCredits: cost,
        balanceAfter: newBalance,
        alreadyProcessed: false,
        summary: this.getAccountSummary(account.accountId, params.sessionToken, now),
      };
    } finally {
      account.inFlightLocks.delete('credit_mutation');
    }
  }

  /**
   * Mark a generation operation as completed
   */
  public completeGenerationOperation(params: {
    accountId: string;
    sessionToken: string;
    operationId: string;
    mode: 'live_ai' | 'demo_fallback';
    now?: Date;
  }): AccountBalanceSummary {
    const now = params.now || new Date();
    const account = this.getVerifiedAccount(params.accountId, params.sessionToken, now);
    const op = this.processedOperations.get(params.operationId);
    if (op && op.accountId === account.accountId) {
      op.status = 'completed';
    }
    const genRecord = account.generationHistory.find((g) => g.operationId === params.operationId);
    if (genRecord) {
      genRecord.status = 'completed';
      genRecord.mode = params.mode;
      genRecord.completedAt = now.toISOString();
    }
    return this.getAccountSummary(account.accountId, params.sessionToken, now);
  }

  /**
   * Handle a failed generation operation according to the configured refund policy
   */
  public failAndRefundGenerationOperation(params: {
    accountId: string;
    sessionToken: string;
    operationId: string;
    errorMessage: string;
    now?: Date;
  }): {
    refunded: boolean;
    refundedCredits: number;
    summary: AccountBalanceSummary;
  } {
    const now = params.now || new Date();
    const account = this.getVerifiedAccount(params.accountId, params.sessionToken, now);
    const op = this.processedOperations.get(params.operationId);

    if (!op || op.accountId !== account.accountId) {
      return {
        refunded: false,
        refundedCredits: 0,
        summary: this.getAccountSummary(account.accountId, params.sessionToken, now),
      };
    }

    // Prevent double-refunding the same operationId
    if (op.status === 'refunded') {
      return {
        refunded: true,
        refundedCredits: op.creditCost,
        summary: this.getAccountSummary(account.accountId, params.sessionToken, now),
      };
    }

    const genRecord = account.generationHistory.find((g) => g.operationId === params.operationId);
    const nowIso = now.toISOString();

    if (this.config.refundPolicy.refundOnGenerationFailure) {
      const refundAmount = op.creditCost;
      // Restore credits to the most recent non-expired lot or create a refund lot
      const targetLot = account.grants.find((lot) => !lot.expiredProcessed);
      if (targetLot) {
        targetLot.creditsRemaining += refundAmount;
      } else {
        account.grants.push({
          id: `lot_refund_${crypto.randomBytes(6).toString('hex')}`,
          packageId: 'free',
          packageName: 'Generation Failure Refund',
          creditsGranted: refundAmount,
          creditsRemaining: refundAmount,
          purchasedAt: nowIso,
          expiresAt: null,
          expiredProcessed: false,
        });
      }

      account.creditsUsed = Math.max(0, account.creditsUsed - refundAmount);
      op.status = 'refunded';
      const newBalance = this.computeAvailableCredits(account);

      account.transactions.unshift({
        id: `tx_ref_${crypto.randomBytes(6).toString('hex')}`,
        accountId: account.accountId,
        type: 'generation_refund',
        amount: refundAmount,
        balanceAfter: newBalance,
        description: `Automatic credit refund for failed generation (${params.errorMessage.slice(0, 80)})`,
        operationId: params.operationId,
        createdAt: nowIso,
      });

      if (genRecord) {
        genRecord.status = 'failed_refunded';
        genRecord.errorMessage = params.errorMessage;
        genRecord.completedAt = nowIso;
      }

      return {
        refunded: true,
        refundedCredits: refundAmount,
        summary: this.getAccountSummary(account.accountId, params.sessionToken, now),
      };
    } else {
      if (genRecord) {
        genRecord.status = 'failed_no_refund';
        genRecord.errorMessage = params.errorMessage;
        genRecord.completedAt = nowIso;
      }
      return {
        refunded: false,
        refundedCredits: 0,
        summary: this.getAccountSummary(account.accountId, params.sessionToken, now),
      };
    }
  }

  /**
   * Create a server-validated checkout session for a one-time credit package.
   * Ignores any client-supplied price or credit count and uses only server configuration.
   */
  public createCheckoutSession(params: {
    accountId: string;
    sessionToken: string;
    packageId: PackagePlanId;
    appBaseUrl?: string;
    now?: Date;
  }): CheckoutSessionRecord {
    const now = params.now || new Date();
    const account = this.getVerifiedAccount(params.accountId, params.sessionToken, now);

    const pkg = this.config.packages.find((p) => p.id === params.packageId);
    if (!pkg || !pkg.active) {
      throw new Error(`INVALID_PACKAGE: Package "${params.packageId}" is not available.`);
    }

    if (pkg.id === 'free' || pkg.priceCents === 0) {
      throw new Error(
        'FREE_PLAN_NO_CHECKOUT: The Free plan is automatically provisioned upon account creation and does not require a payment checkout.'
      );
    }

    const sessionId = `cs_${crypto.randomBytes(10).toString('hex')}`;
    const envStatus = this.getPaymentEnvironmentStatus();
    const baseUrl = (params.appBaseUrl || '').replace(/\/$/, '');
    const nowIso = now.toISOString();

    const session: CheckoutSessionRecord = {
      id: sessionId,
      accountId: account.accountId,
      packageId: pkg.id,
      packageName: pkg.name,
      priceCents: pkg.priceCents,
      priceFormatted: pkg.priceFormatted,
      creditsToGrant: pkg.credits,
      expirationMonths: pkg.expirationMonths,
      billingType: 'one_time',
      providerMode: envStatus.providerMode,
      providerName: envStatus.providerName,
      status: 'pending',
      checkoutUrl: `${baseUrl}/pricing?checkout_session=${sessionId}`,
      successUrl: `${baseUrl}/pricing?checkout_status=success&session_id=${sessionId}`,
      cancelUrl: `${baseUrl}/pricing?checkout_status=cancelled&session_id=${sessionId}`,
      creditsGranted: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.checkoutSessions.set(sessionId, session);
    return structuredClone(session);
  }

  public getCheckoutSession(
    sessionId: string,
    accountId: string,
    sessionToken: string
  ): CheckoutSessionRecord {
    this.getVerifiedAccount(accountId, sessionToken);
    const session = this.checkoutSessions.get(sessionId);
    if (!session || session.accountId !== accountId) {
      throw new Error('CHECKOUT_SESSION_NOT_FOUND: Checkout session not found for this account.');
    }
    return structuredClone(session);
  }

  /**
   * Process a signed webhook event or development checkout resolution.
   * Strictly idempotent by webhookEventId AND checkoutSessionId so repeated events never double-grant credits.
   */
  public processPaymentWebhookEvent(params: {
    webhookEventId: string;
    sessionId: string;
    eventType: 'checkout.completed' | 'checkout.cancelled' | 'payment.failed' | 'payment.refunded';
    rawPayload?: string;
    signatureHeader?: string;
    isDevelopmentSandboxAction?: boolean;
    now?: Date;
  }): {
    idempotentDuplicate: boolean;
    session: CheckoutSessionRecord;
    creditsDelta: number;
  } {
    const now = params.now || new Date();
    const webhookSecret = (process.env.PAYMENT_WEBHOOK_SECRET || '').trim();

    // Verify HMAC-SHA256 webhook signature when not a local development sandbox action or when signature is required
    if (!params.isDevelopmentSandboxAction) {
      if (webhookSecret) {
        const expectedSig = crypto
          .createHmac('sha256', webhookSecret)
          .update(params.rawPayload || `${params.webhookEventId}:${params.sessionId}:${params.eventType}`)
          .digest('hex');
        if (!params.signatureHeader || params.signatureHeader !== expectedSig) {
          throw new Error('INVALID_WEBHOOK_SIGNATURE: Webhook cryptographic signature verification failed.');
        }
      }
    }

    const session = this.checkoutSessions.get(params.sessionId);
    if (!session) {
      throw new Error(`CHECKOUT_SESSION_NOT_FOUND: Unknown session "${params.sessionId}".`);
    }

    // Idempotency check on webhookEventId
    if (this.processedWebhookEvents.has(params.webhookEventId)) {
      return {
        idempotentDuplicate: true,
        session: structuredClone(session),
        creditsDelta: 0,
      };
    }

    const account = this.accounts.get(session.accountId);
    if (!account) {
      throw new Error('ACCOUNT_NOT_FOUND: Account associated with checkout session does not exist.');
    }

    this.processExpirationsForAccount(account, now);
    const nowIso = now.toISOString();

    if (params.eventType === 'checkout.completed') {
      // Secondary idempotency guard: if session already granted credits, never grant again
      if (session.creditsGranted || session.status === 'completed') {
        this.processedWebhookEvents.add(params.webhookEventId);
        return {
          idempotentDuplicate: true,
          session: structuredClone(session),
          creditsDelta: 0,
        };
      }

      let expiresAt: string | null = null;
      if (session.expirationMonths && session.expirationMonths > 0) {
        const expDate = new Date(now.getTime());
        expDate.setUTCMonth(expDate.getUTCMonth() + session.expirationMonths);
        expiresAt = expDate.toISOString();
      }

      const grantLot: CreditGrantLot = {
        id: `lot_buy_${crypto.randomBytes(6).toString('hex')}`,
        packageId: session.packageId,
        packageName: `${session.packageName} Package`,
        creditsGranted: session.creditsToGrant,
        creditsRemaining: session.creditsToGrant,
        purchasedAt: nowIso,
        expiresAt,
        expiredProcessed: false,
        checkoutSessionId: session.id,
      };

      account.grants.push(grantLot);
      account.creditsPurchased += session.creditsToGrant;
      const newBalance = this.computeAvailableCredits(account);

      account.transactions.unshift({
        id: `tx_buy_${crypto.randomBytes(6).toString('hex')}`,
        accountId: account.accountId,
        type: 'purchase_grant',
        amount: session.creditsToGrant,
        balanceAfter: newBalance,
        description: `Purchased ${session.packageName} (${session.creditsToGrant} credits · ${session.priceFormatted} one-time)`,
        packageId: session.packageId,
        checkoutSessionId: session.id,
        webhookEventId: params.webhookEventId,
        createdAt: nowIso,
        expiresAt,
      });

      session.status = 'completed';
      session.creditsGranted = true;
      session.webhookEventId = params.webhookEventId;
      session.completedAt = nowIso;
      session.updatedAt = nowIso;
      this.processedWebhookEvents.add(params.webhookEventId);

      return {
        idempotentDuplicate: false,
        session: structuredClone(session),
        creditsDelta: session.creditsToGrant,
      };
    }

    if (params.eventType === 'checkout.cancelled') {
      if (session.status === 'pending') {
        session.status = 'cancelled';
        session.updatedAt = nowIso;
      }
      this.processedWebhookEvents.add(params.webhookEventId);
      return {
        idempotentDuplicate: false,
        session: structuredClone(session),
        creditsDelta: 0,
      };
    }

    if (params.eventType === 'payment.failed') {
      if (session.status === 'pending') {
        session.status = 'failed';
        session.updatedAt = nowIso;
      }
      this.processedWebhookEvents.add(params.webhookEventId);
      return {
        idempotentDuplicate: false,
        session: structuredClone(session),
        creditsDelta: 0,
      };
    }

    if (params.eventType === 'payment.refunded') {
      if (session.status === 'completed' && session.creditsGranted) {
        let reversedAmount = 0;
        if (this.config.refundPolicy.reverseCreditsOnPaymentRefund) {
          const targetLot = account.grants.find((l) => l.checkoutSessionId === session.id);
          if (targetLot && targetLot.creditsRemaining > 0) {
            reversedAmount = targetLot.creditsRemaining;
            targetLot.creditsRemaining = 0;
          }
          account.creditsPurchased = Math.max(0, account.creditsPurchased - reversedAmount);
          const newBalance = this.computeAvailableCredits(account);

          account.transactions.unshift({
            id: `tx_rev_${crypto.randomBytes(6).toString('hex')}`,
            accountId: account.accountId,
            type: 'payment_refund_reversal',
            amount: -reversedAmount,
            balanceAfter: newBalance,
            description: `Payment refund credit reversal for ${session.packageName} (${reversedAmount} unused credits reversed)`,
            packageId: session.packageId,
            checkoutSessionId: session.id,
            webhookEventId: params.webhookEventId,
            createdAt: nowIso,
          });
        }
        session.status = 'refunded';
        session.updatedAt = nowIso;
        this.processedWebhookEvents.add(params.webhookEventId);
        return {
          idempotentDuplicate: false,
          session: structuredClone(session),
          creditsDelta: -reversedAmount,
        };
      }
      this.processedWebhookEvents.add(params.webhookEventId);
      return {
        idempotentDuplicate: true,
        session: structuredClone(session),
        creditsDelta: 0,
      };
    }

    throw new Error(`UNSUPPORTED_WEBHOOK_EVENT: ${params.eventType}`);
  }

  /**
   * Authorized Admin Configuration Update
   */
  public verifyAdminAuthorization(providedToken?: string): boolean {
    const configuredToken = (process.env.ADMIN_CONFIG_TOKEN || '').trim();
    if (configuredToken) {
      return Boolean(providedToken && providedToken === configuredToken);
    }
    // In development mode when ADMIN_CONFIG_TOKEN is not set in .env, require the explicit dev sandbox token
    return providedToken === 'eden_dev_admin_token';
  }

  public updateAdminPricingConfig(
    providedAdminToken: string | undefined,
    updates: {
      initialFreeTrialCredits?: number;
      roomRedesignCreditCost?: number;
      refundOnGenerationFailure?: boolean;
      packages?: Array<{
        id: PackagePlanId;
        name?: string;
        priceCents?: number;
        credits?: number;
        expirationMonths?: number | null;
        active?: boolean;
        providerProductId?: string;
        providerPriceId?: string;
      }>;
    }
  ): PricingSystemConfig {
    if (!this.verifyAdminAuthorization(providedAdminToken)) {
      throw new Error(
        'ADMIN_UNAUTHORIZED: Valid administrator token (x-admin-token) is required to modify pricing or credit configuration.'
      );
    }

    if (
      typeof updates.initialFreeTrialCredits === 'number' &&
      updates.initialFreeTrialCredits >= 0 &&
      updates.initialFreeTrialCredits <= 100
    ) {
      this.config.initialFreeTrialCredits = Math.floor(updates.initialFreeTrialCredits);
      const freePkg = this.config.packages.find((p) => p.id === 'free');
      if (freePkg) {
        freePkg.credits = this.config.initialFreeTrialCredits;
      }
    }

    if (
      typeof updates.roomRedesignCreditCost === 'number' &&
      updates.roomRedesignCreditCost >= 1 &&
      updates.roomRedesignCreditCost <= 50
    ) {
      this.config.creditCosts.roomRedesignStandard = Math.floor(updates.roomRedesignCreditCost);
    }

    if (typeof updates.refundOnGenerationFailure === 'boolean') {
      this.config.refundPolicy.refundOnGenerationFailure = updates.refundOnGenerationFailure;
    }

    if (Array.isArray(updates.packages)) {
      for (const patch of updates.packages) {
        const target = this.config.packages.find((p) => p.id === patch.id);
        if (!target) continue;
        if (typeof patch.name === 'string' && patch.name.trim()) {
          target.name = patch.name.trim();
        }
        if (typeof patch.priceCents === 'number' && patch.priceCents >= 0) {
          target.priceCents = Math.floor(patch.priceCents);
          target.priceFormatted = formatUsdFromCents(target.priceCents);
        }
        if (typeof patch.credits === 'number' && patch.credits >= 0) {
          target.credits = Math.floor(patch.credits);
        }
        if (patch.expirationMonths !== undefined) {
          target.expirationMonths =
            patch.expirationMonths === null || patch.expirationMonths <= 0
              ? null
              : Math.floor(patch.expirationMonths);
        }
        if (typeof patch.active === 'boolean') {
          target.active = patch.active;
        }
        if (typeof patch.providerProductId === 'string') {
          target.providerProductId = patch.providerProductId.trim();
        }
        if (typeof patch.providerPriceId === 'string') {
          target.providerPriceId = patch.providerPriceId.trim();
        }
      }
    }

    this.config.updatedAt = new Date().toISOString();
    return this.getConfig();
  }
}

export const defaultCreditStore = new CreditSystemStore();
