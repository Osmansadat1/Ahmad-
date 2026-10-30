import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  FileText,
  HelpCircle,
  History,
  Info,
  Lock,
  RefreshCw,
  RotateCcw,
  Shield,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  AccountBalanceSummary,
  CheckoutSessionRecord,
  CreditPackageConfig,
  PackagePlanId,
  PricingSystemConfig,
} from '../types/pricing';
import { AnalyticsEventName } from '../types/eden';

interface PaymentEnvironmentInfo {
  providerMode: 'development_demo' | 'live_provider';
  providerName: string;
  liveCredentialsConfigured: boolean;
  webhookSecretConfigured: boolean;
  adminTokenConfigured: boolean;
  persistenceMode: string;
  authMode: string;
  productionChecklist: string[];
}

export type PolicyDocType = 'terms' | 'privacy' | 'refund' | 'support';

interface PricingPageProps {
  pricingConfig: PricingSystemConfig | null;
  paymentEnv: PaymentEnvironmentInfo | null;
  accountSummary: AccountBalanceSummary | null;
  accountId: string;
  sessionToken: string;
  onStartFreeDesign: () => void;
  onRefreshPricingAndBalance: () => Promise<void>;
  onTrackEvent: (
    name: AnalyticsEventName,
    metadata?: Record<string, string | number | boolean>
  ) => void;
  activePolicyDoc: PolicyDocType | null;
  onOpenPolicyDoc: (doc: PolicyDocType | null) => void;
}

const FAQ_ITEMS = [
  {
    question: 'What are design credits?',
    answer:
      'Design credits are the unit used in Eden Canvas to generate AI room redesign concepts, step-by-step renter action plans, and budget-aware shopping lists for your uploaded or sample room photos.',
    policyStatus: 'Configured in Server Ledger',
  },
  {
    question: 'How many credits does a room redesign use?',
    answer:
      'By default, generating a room redesign concept (including the before-and-after visualization, architectural preservation notes, and 3-part action plan) uses 1 credit per generation. The required credit cost is always displayed above the "Generate My Room Design" button before you start.',
    policyStatus: 'Configured centrally (1 credit / redesign)',
  },
  {
    question: 'Do unused credits expire?',
    answer:
      'Credits included in the Free trial (3 credits), Starter package (20 credits), and Home Makeover package (120 credits) do not currently have an expiration date configured. Credits purchased in the Room Refresh package (50 credits) expire 6 months (180 days) after the purchase timestamp. Expiration dates are displayed in your credit ledger, and expiring credits are always used first.',
    policyStatus: 'Enforced in Server Ledger (6 months for Room Refresh)',
  },
  {
    question: 'Are these one-time purchases or subscriptions?',
    answer:
      'All paid credit packages (Starter, Room Refresh, and Home Makeover) are one-time purchases. We do not charge recurring monthly or annual subscription fees unless you explicitly choose to buy another credit package when your balance runs low.',
    policyStatus: 'One-Time Purchases Only',
  },
  {
    question: 'What happens if image generation fails?',
    answer:
      'If a generation request fails due to an AI provider error, rate limit, missing server credentials, or network timeout, our server ledger automatically refunds the deducted credit back to your available balance and logs a "generation_refund" entry in your transaction history.',
    policyStatus: 'Automatic Server Refund Enabled',
  },
  {
    question: 'Can I change my plan later?',
    answer:
      'Because Eden Canvas uses one-time credit packages rather than recurring subscriptions, there is no subscription lock-in. You can start with the Free trial and purchase any credit package (Starter, Room Refresh, or Home Makeover) whenever you need additional credits.',
    policyStatus: 'No Subscription Lock-In',
  },
  {
    question: 'Are taxes included?',
    answer:
      'Displayed package prices ($5.99, $12.00, and $24.00 USD) are base launch prices before applicable state or local sales taxes. Final tax calculation depends on the merchant payment provider configuration and your billing jurisdiction.',
    policyStatus: 'Requires Owner Tax Configuration in Payment Provider',
  },
  {
    question: 'How are refunds handled?',
    answer:
      'Failed AI generations are refunded in credits automatically. For monetary refunds on completed one-time credit package purchases, our server webhook processor supports automated credit reversal ("payment_refund_reversal") when a refund is issued. Specific monetary refund eligibility windows (e.g., unused package refunds within 14 days) must be finalized by the business owner prior to production launch.',
    policyStatus: 'Requires Owner Refund Policy Approval Before Launch',
  },
];

export const PricingPage: React.FC<PricingPageProps> = ({
  pricingConfig,
  paymentEnv,
  accountSummary,
  accountId,
  sessionToken,
  onStartFreeDesign,
  onRefreshPricingAndBalance,
  onTrackEvent,
  activePolicyDoc,
  onOpenPolicyDoc,
}) => {
  const [activeCheckoutSession, setActiveCheckoutSession] =
    useState<CheckoutSessionRecord | null>(null);
  const [checkoutBanner, setCheckoutBanner] = useState<{
    type: 'success' | 'cancelled' | 'failed' | 'pending' | 'duplicate_info';
    title: string;
    message: string;
    packageName?: string;
    creditsGranted?: number;
    updatedBalance?: number;
  } | null>(null);
  const [checkoutLoadingPkg, setCheckoutLoadingPkg] = useState<PackagePlanId | null>(null);
  const [resolvingCheckout, setResolvingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Admin panel state
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTokenInput, setAdminTokenInput] = useState('eden_dev_admin_token');
  const [adminCostInput, setAdminCostInput] = useState<number>(
    pricingConfig?.creditCosts.roomRedesignStandard ?? 1
  );
  const [adminStarterPriceCents, setAdminStarterPriceCents] = useState<number>(599);
  const [adminRefreshCredits, setAdminRefreshCredits] = useState<number>(50);
  const [adminStatusMessage, setAdminStatusMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const creditCost = pricingConfig?.creditCosts.roomRedesignStandard ?? 1;

  const handleSelectPackage = async (pkg: CreditPackageConfig) => {
    setCheckoutError(null);
    onTrackEvent('pricing_package_selected', {
      packageId: pkg.id,
      priceCents: pkg.priceCents,
      credits: pkg.credits,
    });

    if (pkg.id === 'free') {
      onStartFreeDesign();
      return;
    }

    if (!accountId || !sessionToken) {
      setCheckoutError('Initializing your credit session. Please try again in a moment.');
      return;
    }

    setCheckoutLoadingPkg(pkg.id);
    try {
      const response = await fetch('/api/payments/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-account-id': accountId,
          'x-session-token': sessionToken,
        },
        body: JSON.stringify({ packageId: pkg.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Could not start checkout session.');
      }

      const session: CheckoutSessionRecord = data.session;
      setActiveCheckoutSession(session);
      setCheckoutBanner({
        type: 'pending',
        title: 'Checkout Session Created — Payment Pending Verification',
        message: `Selected ${session.packageName} (${session.priceFormatted} USD one-time for ${session.creditsToGrant} credits). Credits will be added only after the server confirms a completed payment.`,
      });

      onTrackEvent('checkout_started', {
        packageId: session.packageId,
        priceCents: session.priceCents,
        credits: session.creditsToGrant,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to start checkout.';
      setCheckoutError(msg);
    } finally {
      setCheckoutLoadingPkg(null);
    }
  };

  const handleResolveDevCheckout = async (
    outcome: 'completed' | 'cancelled' | 'failed' | 'refunded',
    simulateDuplicateWebhook = false
  ) => {
    if (!activeCheckoutSession) return;
    setResolvingCheckout(true);
    setCheckoutError(null);

    const priorPurchases = accountSummary?.purchaseCount ?? 0;

    try {
      const webhookEventId = simulateDuplicateWebhook
        ? activeCheckoutSession.webhookEventId || `evt_dev_${activeCheckoutSession.id}_completed`
        : `evt_${activeCheckoutSession.id}_${outcome}_${Date.now()}`;

      const response = await fetch('/api/payments/dev-resolve-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-account-id': accountId,
          'x-session-token': sessionToken,
        },
        body: JSON.stringify({
          sessionId: activeCheckoutSession.id,
          outcome,
          customWebhookEventId: webhookEventId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to resolve checkout session.');
      }

      setActiveCheckoutSession(data.session);
      await onRefreshPricingAndBalance();

      const updatedBal: number = data.summary?.availableCredits ?? 0;

      if (data.idempotentDuplicate) {
        setCheckoutBanner({
          type: 'duplicate_info',
          title: 'Duplicate Webhook Blocked (Idempotency Verified)',
          message: `The server detected that webhook/session "${activeCheckoutSession.id}" was already processed. 0 duplicate credits were granted. Your balance remains ${updatedBal} credits.`,
          packageName: activeCheckoutSession.packageName,
          creditsGranted: 0,
          updatedBalance: updatedBal,
        });
        return;
      }

      if (outcome === 'completed') {
        setCheckoutBanner({
          type: 'success',
          title: 'Your credits are ready.',
          message: `Your Eden Canvas balance has been updated. Added +${activeCheckoutSession.creditsToGrant} credits from the ${activeCheckoutSession.packageName} one-time package.`,
          packageName: activeCheckoutSession.packageName,
          creditsGranted: activeCheckoutSession.creditsToGrant,
          updatedBalance: updatedBal,
        });
        onTrackEvent('checkout_completed', {
          packageId: activeCheckoutSession.packageId,
          priceCents: activeCheckoutSession.priceCents,
          creditsGranted: activeCheckoutSession.creditsToGrant,
        });
        onTrackEvent('credits_granted', {
          packageId: activeCheckoutSession.packageId,
          credits: activeCheckoutSession.creditsToGrant,
          balanceAfter: updatedBal,
        });
        if (priorPurchases >= 1) {
          onTrackEvent('repeat_purchase', {
            packageId: activeCheckoutSession.packageId,
            purchaseNumber: priorPurchases + 1,
          });
        }
      } else if (outcome === 'cancelled') {
        setCheckoutBanner({
          type: 'cancelled',
          title: 'Checkout Cancelled — No Credits Added',
          message: `Your checkout for ${activeCheckoutSession.packageName} was cancelled before payment completion. No charges were made and 0 credits were added. Your balance remains ${updatedBal} credits.`,
          updatedBalance: updatedBal,
        });
        onTrackEvent('checkout_cancelled', {
          packageId: activeCheckoutSession.packageId,
        });
      } else if (outcome === 'failed') {
        setCheckoutBanner({
          type: 'failed',
          title: 'Payment Failed — No Credits Added',
          message: `The payment attempt for ${activeCheckoutSession.packageName} was declined or failed verification. 0 credits were granted. Your balance remains ${updatedBal} credits.`,
          updatedBalance: updatedBal,
        });
        onTrackEvent('payment_failed', {
          packageId: activeCheckoutSession.packageId,
        });
      } else if (outcome === 'refunded') {
        setCheckoutBanner({
          type: 'cancelled',
          title: 'Payment Refund Processed — Credits Reversed',
          message: `Webhook "payment.refunded" processed. Unused credits from ${activeCheckoutSession.packageName} were reversed (${data.creditsDelta} credits). Updated balance: ${updatedBal} credits.`,
          updatedBalance: updatedBal,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout verification failed.';
      setCheckoutError(msg);
    } finally {
      setResolvingCheckout(false);
    }
  };

  const handleSaveAdminConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminStatusMessage(null);
    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminTokenInput,
        },
        body: JSON.stringify({
          roomRedesignCreditCost: Number(adminCostInput),
          packages: [
            {
              id: 'starter',
              priceCents: Number(adminStarterPriceCents),
            },
            {
              id: 'room_refresh',
              credits: Number(adminRefreshCredits),
            },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAdminStatusMessage({
          ok: false,
          text: data?.error || 'Admin update rejected.',
        });
        return;
      }
      await onRefreshPricingAndBalance();
      setAdminStatusMessage({
        ok: true,
        text: 'Server pricing & credit configuration updated and synced.',
      });
    } catch (err: unknown) {
      setAdminStatusMessage({
        ok: false,
        text: err instanceof Error ? err.message : 'Failed to update server config.',
      });
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Top Back to Studio + Current Balance Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D6]">
          <button
            type="button"
            onClick={onStartFreeDesign}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1F4D3D] hover:text-[#153A2E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Design Studio</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div
              data-testid="pricing-balance-pill"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E8E1D6] text-xs sm:text-sm font-semibold text-[#1C2420]"
            >
              <Coins className="w-4 h-4 text-[#1F4D3D]" />
              <span>{accountSummary?.availableCredits ?? 3} credits remaining</span>
            </div>

            <span className="text-xs px-3 py-1.5 rounded-full bg-[#D9E7DC] text-[#1F4D3D] font-semibold">
              1 Room Redesign = {creditCost} Credit{creditCost === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* 3. PRICING PAGE HEADER */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9E7DC] text-[#1F4D3D] text-xs font-semibold uppercase tracking-[0.14em]">
            <span>One-Time Credit Packages · No Subscriptions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1C2420] tracking-tight leading-tight">
            Choose Your Next Room Refresh
          </h1>
          <p className="text-base sm:text-lg text-[#667067] leading-relaxed">
            Start free, explore your ideas, and get more design credits when you are ready.
          </p>
          <p className="text-xs text-[#667067]">
            All paid packages are one-time USD purchases—never recurring monthly billing. Each room
            redesign generation costs <strong>{creditCost} credit{creditCost === 1 ? '' : 's'}</strong>.
          </p>
        </div>

        {/* Development / Demo Payment Mode Disclosure Banner */}
        {paymentEnv && paymentEnv.providerMode === 'development_demo' && (
          <div
            data-testid="payment-demo-mode-banner"
            className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D6] flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D9E7DC] text-[#1F4D3D] flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-[#667067]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#1C2420]">
                  Development / Demo Checkout Mode Active
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#D9E7DC] text-[#1F4D3D]">
                  No Live Card Charges
                </span>
              </div>
              <p className="leading-relaxed">
                Live payment provider credentials (<code className="text-[#1C2420]">PAYMENT_PROVIDER</code>{' '}
                and <code className="text-[#1C2420]">PAYMENT_PROVIDER_SECRET_KEY</code>) are not yet
                configured on the server. Selecting a paid package below opens our{' '}
                <strong>Server-Validated Development Checkout Sandbox</strong> so you can test real
                server-side credit grants, webhook idempotency, cancellations, failed payments, and
                refunds without collecting or charging real credit cards.
              </p>
            </div>
          </div>
        )}

        {/* Active Checkout Verification / Status Banner */}
        {checkoutBanner && (
          <div
            role="status"
            data-testid="checkout-status-banner"
            className={`max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl border shadow-xs ${
              checkoutBanner.type === 'success'
                ? 'bg-[#F3EDE2] text-[#1C2420] border-[#1F4D3D]'
                : checkoutBanner.type === 'pending' || checkoutBanner.type === 'duplicate_info'
                ? 'bg-[#FFFFFF] text-[#1C2420] border-[#E8E1D6]'
                : 'bg-[#EFE5D6]/50 text-[#1C2420] border-[#C2623F]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {checkoutBanner.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#1F4D3D] shrink-0 mt-0.5" />
                ) : checkoutBanner.type === 'pending' ||
                  checkoutBanner.type === 'duplicate_info' ? (
                  <Clock className="w-6 h-6 text-[#1F4D3D] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-[#B45309] shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#1C2420]">
                    {checkoutBanner.title}
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#667067]">
                    {checkoutBanner.message}
                  </p>
                  {typeof checkoutBanner.updatedBalance === 'number' && (
                    <p className="text-xs font-semibold pt-1 text-[#1F4D3D]">
                      Verified Available Balance: {checkoutBanner.updatedBalance} credits
                    </p>
                  )}
                </div>
              </div>

              {checkoutBanner.type === 'success' && (
                <button
                  type="button"
                  onClick={onStartFreeDesign}
                  className="px-4 py-2.5 rounded-xl bg-[#1F4D3D] text-[#FFFFFF] text-xs sm:text-sm font-semibold hover:bg-[#153A2E] transition-colors shrink-0 cursor-pointer"
                >
                  Use Credits in Studio
                </button>
              )}
            </div>
          </div>
        )}

        {/* Interactive Server-Validated Checkout Modal / Drawer when a paid package is selected */}
        {activeCheckoutSession && (
          <div
            data-testid="checkout-sandbox-panel"
            className="max-w-4xl mx-auto bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#1F4D3D] shadow-md space-y-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#E8E1D6]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9E7DC] text-[#1F4D3D] text-xs font-semibold mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {activeCheckoutSession.providerMode === 'development_demo'
                      ? 'Development Sandbox Checkout (No Real Charge)'
                      : 'Secure Provider Checkout'}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-[#1C2420]">
                  Checkout Summary: {activeCheckoutSession.packageName} Package
                </h3>
                <p className="text-xs text-[#667067] mt-1">
                  Server Session ID: <code>{activeCheckoutSession.id}</code> · Status:{' '}
                  <strong className="uppercase text-[#1F4D3D]">
                    {activeCheckoutSession.status}
                  </strong>
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-semibold text-[#1C2420]">
                  {activeCheckoutSession.priceFormatted}{' '}
                  <span className="text-xs font-normal text-[#667067]">USD</span>
                </div>
                <div className="text-xs font-semibold text-[#1F4D3D]">
                  One-time payment · +{activeCheckoutSession.creditsToGrant} design credits
                </div>
                {activeCheckoutSession.expirationMonths && (
                  <div className="text-[11px] text-[#667067] mt-0.5">
                    Credits expire {activeCheckoutSession.expirationMonths} months after purchase
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D6] text-xs text-[#667067] space-y-1.5">
              <p className="font-semibold text-[#1C2420]">
                Server-Side Payment &amp; Webhook Verification Controls (Development Mode):
              </p>
              <p>
                Test how the server credit ledger handles each payment outcome. Credits are granted{' '}
                <strong>only once</strong> after a verified <code>checkout.completed</code> webhook
                event.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={resolvingCheckout}
                onClick={() => handleResolveDevCheckout('completed', false)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1F4D3D] hover:bg-[#153A2E] text-[#FFFFFF] text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Verified Payment (+{activeCheckoutSession.creditsToGrant} Credits)</span>
              </button>

              {activeCheckoutSession.status === 'completed' && (
                <>
                  <button
                    type="button"
                    disabled={resolvingCheckout}
                    onClick={() => handleResolveDevCheckout('completed', true)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D9E7DC] hover:bg-[#cbe0cd] text-[#1C2420] text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Shield className="w-4 h-4 text-[#1F4D3D]" />
                    <span>Test Duplicate Webhook (Idempotency Check)</span>
                  </button>

                  <button
                    type="button"
                    disabled={resolvingCheckout}
                    onClick={() => handleResolveDevCheckout('refunded', false)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E8E1D6] text-[#1C2420] hover:bg-[#FAF7F2] text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4 text-[#B45309]" />
                    <span>Simulate Payment Refund (Reverse Credits)</span>
                  </button>
                </>
              )}

              {activeCheckoutSession.status === 'pending' && (
                <>
                  <button
                    type="button"
                    disabled={resolvingCheckout}
                    onClick={() => handleResolveDevCheckout('cancelled', false)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E8E1D6] hover:bg-[#FAF7F2] text-[#1C2420] text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 text-[#667067]" />
                    <span>Cancel Checkout (0 Credits)</span>
                  </button>

                  <button
                    type="button"
                    disabled={resolvingCheckout}
                    onClick={() => handleResolveDevCheckout('failed', false)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E8E1D6] hover:bg-[#FAF7F2] text-[#1C2420] text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <AlertCircle className="w-4 h-4 text-[#B45309]" />
                    <span>Simulate Failed Payment (0 Credits)</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setActiveCheckoutSession(null)}
                className="ml-auto text-xs font-medium text-[#667067] hover:text-[#1C2420] underline cursor-pointer"
              >
                Close Checkout Panel
              </button>
            </div>
          </div>
        )}

        {checkoutError && (
          <div
            role="alert"
            className="max-w-4xl mx-auto p-4 rounded-2xl bg-[#EFE5D6]/50 border border-[#C2623F] text-xs sm:text-sm text-[#1C2420] flex items-center gap-2.5"
          >
            <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        {(!pricingConfig || pricingConfig.packages.length === 0) && (
          <div role="status" className="max-w-xl mx-auto text-center p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D6] text-sm text-[#667067]">
            Loading current packages… If this message stays, please refresh the page.
          </div>
        )}

        {/* FOUR PRICING CARDS — Clean white cards with subtle borders and soft sage accent for Recommended */}
        <div
          data-testid="pricing-cards-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {(pricingConfig?.packages || []).map((pkg) => {
            const isRecommended = pkg.recommended;
            const costPerCredit =
              pkg.priceCents > 0 && pkg.credits > 0
                ? `$${(pkg.priceCents / 100 / pkg.credits).toFixed(2)} / credit`
                : 'Free initial allowance';

            return (
              <div
                key={pkg.id}
                data-testid={`pricing-card-${pkg.id}`}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  isRecommended
                    ? 'bg-[#FFFFFF] text-[#1C2420] border-2 border-[#1F4D3D] shadow-md ring-4 ring-[#D9E7DC]/60'
                    : 'bg-[#FFFFFF] text-[#1C2420] border border-[#E8E1D6] shadow-2xs hover:border-[#1F4D3D]/40'
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667067]">
                      {pkg.code}
                    </span>
                    {isRecommended && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#D9E7DC] text-[#1F4D3D]">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C2420]">{pkg.name}</h2>
                    <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-[#667067]">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price & Credit Allowance */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      isRecommended
                        ? 'bg-[#F3EDE2] border-[#D9E7DC]'
                        : 'bg-[#FAF7F2] border-[#E8E1D6]'
                    }`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-semibold text-[#1C2420]">
                        {pkg.priceFormatted}
                      </span>
                      <span className="text-xs font-medium text-[#667067]">
                        {pkg.priceCents === 0 ? 'USD · No card required' : 'USD · One-time'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#1F4D3D]">
                        {pkg.credits} {pkg.id === 'free' ? 'Trial Credits' : 'Design Credits'}
                      </span>
                      <span className="font-normal text-[#667067]">{costPerCredit}</span>
                    </div>
                    {pkg.expirationMonths && (
                      <div className="mt-1.5 pt-1.5 border-t border-[#E8E1D6] text-[11px] flex items-center gap-1.5 text-[#667067]">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-[#1F4D3D]" />
                        <span>Credits expire {pkg.expirationMonths} months after purchase</span>
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#1C2420]">
                      Included Features
                    </p>
                    <ul className="space-y-2">
                      {pkg.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-xs sm:text-sm flex items-start gap-2.5">
                          <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#1F4D3D]" />
                          <span className="text-[#1C2420]/90">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations & Expiration Disclosure */}
                  <div className="pt-3 border-t border-[#E8E1D6] text-[11px] space-y-1 text-[#667067]">
                    {pkg.limitationsDisclosure.map((note, idx) => (
                      <p key={idx}>• {note}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    type="button"
                    disabled={!pkg.active || checkoutLoadingPkg === pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full py-3.5 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                      isRecommended
                        ? 'bg-[#1F4D3D] text-[#FFFFFF] hover:bg-[#153A2E] shadow-xs'
                        : pkg.id === 'free'
                        ? 'bg-[#F3EDE2] text-[#1C2420] border border-[#E8E1D6] hover:bg-[#D9E7DC]/60'
                        : 'bg-[#FFFFFF] text-[#1F4D3D] border-2 border-[#1F4D3D] hover:bg-[#F3EDE2]'
                    }`}
                  >
                    <span>
                      {checkoutLoadingPkg === pkg.id ? 'Starting Checkout...' : pkg.ctaLabel}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. AUDITABLE CREDIT LEDGER & ACCOUNT BALANCE SECTION */}
        <section
          id="credit-ledger-section"
          aria-labelledby="credit-ledger-heading"
          className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#1C2420]/12 shadow-2xs space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C2420]/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#153A2E]">
                Server-Authoritative Credit Ledger
              </p>
              <h2
                id="credit-ledger-heading"
                className="font-serif text-2xl sm:text-3xl text-[#1C2420] mt-1"
              >
                Your Credit Balance &amp; Activity History
              </h2>
              <p className="text-xs sm:text-sm text-[#5F645D] mt-1">
                Account Session ID: <code>{accountId || 'initializing...'}</code> · All balance
                checks, credit deductions, expirations, and automatic failure refunds are validated
                on the server.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRefreshPricingAndBalance()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F8F6F0] hover:bg-[#E9E1D5]/60 border border-[#1C2420]/10 text-xs font-semibold text-[#1C2420] transition-colors self-start cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#153A2E]" />
              <span>Sync Server Balance</span>
            </button>
          </div>

          {/* 4 Summary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F6F0] border border-[#1C2420]/10">
              <span className="text-xs uppercase tracking-wider text-[#5F645D] font-semibold">
                Available Credits
              </span>
              <div
                data-testid="ledger-available-credits"
                className="font-serif text-3xl sm:text-4xl text-[#153A2E] mt-1"
              >
                {accountSummary?.availableCredits ?? 3}
              </div>
              <span className="text-xs text-[#5F645D]">
                Ready for room redesigns ({creditCost} credit / generation)
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F6F0] border border-[#1C2420]/10">
              <span className="text-xs uppercase tracking-wider text-[#5F645D] font-semibold">
                Trial Allowance
              </span>
              <div className="font-serif text-3xl sm:text-4xl text-[#1C2420] mt-1">
                {accountSummary?.trialCreditsGranted ?? 3}
              </div>
              <span className="text-xs text-[#5F645D]">Initial Free plan credits granted</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F6F0] border border-[#1C2420]/10">
              <span className="text-xs uppercase tracking-wider text-[#5F645D] font-semibold">
                Credits Purchased
              </span>
              <div
                data-testid="ledger-purchased-credits"
                className="font-serif text-3xl sm:text-4xl text-[#1C2420] mt-1"
              >
                {accountSummary?.creditsPurchased ?? 0}
              </div>
              <span className="text-xs text-[#5F645D]">
                Across {accountSummary?.purchaseCount ?? 0} verified one-time purchase
                {accountSummary?.purchaseCount === 1 ? '' : 's'}
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F6F0] border border-[#1C2420]/10">
              <span className="text-xs uppercase tracking-wider text-[#5F645D] font-semibold">
                Credits Used
              </span>
              <div
                data-testid="ledger-used-credits"
                className="font-serif text-3xl sm:text-4xl text-[#1C2420] mt-1"
              >
                {accountSummary?.creditsUsed ?? 0}
              </div>
              <span className="text-xs text-[#5F645D]">
                Failed generations are refunded automatically
              </span>
            </div>
          </div>

          {/* Active Expiration Notice (e.g., Room Refresh 6-month rule) */}
          {accountSummary?.activeExpiringLot && (
            <div
              data-testid="active-expiration-notice"
              className="p-4 rounded-2xl bg-[#E9E1D5]/65 border border-[#153A2E]/25 flex items-start gap-3 text-xs sm:text-sm text-[#1C2420]"
            >
              <Clock className="w-5 h-5 text-[#153A2E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Credit Expiration Schedule ({accountSummary.activeExpiringLot.packageName})
                </p>
                <p className="text-[#5F645D] mt-0.5">
                  You have{' '}
                  <strong>{accountSummary.activeExpiringLot.creditsRemaining} credits</strong> that
                  expire on{' '}
                  <strong>
                    {new Date(accountSummary.activeExpiringLot.expiresAt).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </strong>
                  . Our ledger automatically uses expiring credits before non-expiring credits.
                </p>
              </div>
            </div>
          )}

          {/* Expired Credit Lot Notices (Never silently removed) */}
          {accountSummary?.expiredNotices && accountSummary.expiredNotices.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#C2623F]/15 border border-[#C2623F] text-xs sm:text-sm text-[#1C2420] space-y-1">
              <p className="font-semibold">Expired Credit Notice</p>
              {accountSummary.expiredNotices.map((notice) => (
                <p key={notice.lotId} className="text-[#5F645D]">
                  • {notice.expiredCredits} unused credit(s) from {notice.packageName} expired on{' '}
                  {new Date(notice.expiredAt).toLocaleDateString('en-US')}.
                </p>
              ))}
            </div>
          )}

          {/* Two Columns: Transaction Ledger & Generation Attempts History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Credit Transaction Ledger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-[#1C2420] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#153A2E]" />
                  <span>Credit Transactions</span>
                </h3>
                <span className="text-xs text-[#5F645D]">
                  {accountSummary?.transactions.length ?? 0} entries
                </span>
              </div>

              <div className="border border-[#1C2420]/10 rounded-2xl divide-y divide-[#1C2420]/10 max-h-80 overflow-y-auto bg-[#F8F6F0]/50">
                {(accountSummary?.transactions || []).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#1C2420]">{tx.description}</p>
                      <p className="text-[#5F645D]">
                        {new Date(tx.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                        {tx.expiresAt
                          ? ` · Expires ${new Date(tx.expiresAt).toLocaleDateString('en-US')}`
                          : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          tx.amount > 0
                            ? 'bg-[#153A2E]/12 text-[#153A2E]'
                            : 'bg-[#C2623F]/15 text-[#1C2420]'
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                      <div className="text-[11px] text-[#5F645D] mt-1">
                        Balance: {tx.balanceAfter}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generation Attempts History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-[#1C2420] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#153A2E]" />
                  <span>Generation Attempts History</span>
                </h3>
                <span className="text-xs text-[#5F645D]">
                  {accountSummary?.generationHistory.length ?? 0} attempts
                </span>
              </div>

              <div className="border border-[#1C2420]/10 rounded-2xl divide-y divide-[#1C2420]/10 max-h-80 overflow-y-auto bg-[#F8F6F0]/50">
                {!accountSummary?.generationHistory ||
                accountSummary.generationHistory.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#5F645D]">
                    No room redesign generations recorded in this session yet. Start in the Design
                    Studio to see completed or auto-refunded attempts here.
                  </div>
                ) : (
                  accountSummary.generationHistory.map((gen) => (
                    <div
                      key={gen.id}
                      className="p-3.5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[#1C2420]">
                          {gen.style} · {gen.roomType}
                        </p>
                        <p className="text-[#5F645D]">
                          {new Date(gen.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                          {gen.mode
                            ? ` · ${gen.mode === 'live_ai' ? 'Live AI' : 'Demo Concept'}`
                            : ''}
                        </p>
                        {gen.errorMessage && (
                          <p className="text-[#C2623F] text-[11px]">
                            Error: {gen.errorMessage} (Credit Automatically Refunded)
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold shrink-0 ${
                          gen.status === 'completed'
                            ? 'bg-[#153A2E]/12 text-[#153A2E]'
                            : gen.status === 'failed_refunded'
                            ? 'bg-[#E9E1D5] text-[#1C2420]'
                            : 'bg-[#C2623F]/15 text-[#1C2420]'
                        }`}
                      >
                        {gen.status === 'completed'
                          ? `Completed (-${gen.creditCost})`
                          : gen.status === 'failed_refunded'
                          ? 'Failed (Refunded)'
                          : gen.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 7. PRICING AND CREDIT TRANSPARENCY FAQ */}
        <section
          id="pricing-faq"
          aria-labelledby="pricing-faq-heading"
          className="space-y-8"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#153A2E]">
              Pricing &amp; Credit Transparency
            </p>
            <h2
              id="pricing-faq-heading"
              className="font-serif text-3xl text-[#1C2420] mt-1"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#5F645D] mt-1.5">
              Clear answers on how design credits, one-time payments, automatic failure refunds, and
              expiration dates work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#1C2420]/10 shadow-2xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-medium text-[#1C2420] flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#153A2E] shrink-0 mt-0.5" />
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F645D] leading-relaxed pl-7">
                    {item.answer}
                  </p>
                </div>
                <div className="pl-7">
                  <span className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#F8F6F0] text-[#153A2E] border border-[#1C2420]/10">
                    Status: {item.policyStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. SERVER-SIDE ADMIN CONFIGURATION WORKFLOW */}
        <section
          aria-labelledby="admin-config-heading"
          className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#1C2420]/12 shadow-2xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9E1D5] text-[#153A2E] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 id="admin-config-heading" className="font-serif text-xl text-[#1C2420]">
                  Server-Side Admin Pricing &amp; Credit Configuration
                </h2>
                <p className="text-xs text-[#5F645D]">
                  Protected by server-side <code>x-admin-token</code> verification on{' '}
                  <code>PUT /api/admin/pricing</code>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdminPanel((prev) => !prev)}
              className="px-4 py-2 rounded-xl border border-[#1C2420]/15 text-xs font-semibold text-[#1C2420] hover:bg-[#F8F6F0] transition-colors cursor-pointer"
            >
              {showAdminPanel ? 'Hide Admin Configuration' : 'Open Admin Configuration'}
            </button>
          </div>

          {showAdminPanel && (
            <form onSubmit={handleSaveAdminConfig} className="mt-6 pt-6 border-t border-[#1C2420]/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C2420] mb-1">
                    Admin Authorization Token
                  </label>
                  <input
                    type="text"
                    value={adminTokenInput}
                    onChange={(e) => setAdminTokenInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#1C2420]/20 text-xs bg-[#F8F6F0]"
                    placeholder="Enter x-admin-token"
                  />
                  <span className="text-[11px] text-[#5F645D]">
                    Try an invalid token to verify 403 server rejection.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2420] mb-1">
                    Redesign Credit Cost (Credits / Gen)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={adminCostInput}
                    onChange={(e) => setAdminCostInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#1C2420]/20 text-xs bg-[#F8F6F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2420] mb-1">
                    Starter Package Price (USD Cents)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={50000}
                    value={adminStarterPriceCents}
                    onChange={(e) => setAdminStarterPriceCents(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#1C2420]/20 text-xs bg-[#F8F6F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2420] mb-1">
                    Room Refresh Credit Allowance
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={adminRefreshCredits}
                    onChange={(e) => setAdminRefreshCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#1C2420]/20 text-xs bg-[#F8F6F0]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#153A2E] text-[#FFFFFF] text-xs font-semibold hover:bg-[#1f372d] transition-colors cursor-pointer"
                >
                  Apply Server Configuration
                </button>

                {adminStatusMessage && (
                  <span
                    className={`text-xs font-semibold ${
                      adminStatusMessage.ok ? 'text-[#153A2E]' : 'text-[#C2623F]'
                    }`}
                  >
                    {adminStatusMessage.text}
                  </span>
                )}
              </div>
            </form>
          )}
        </section>

        {/* 8. TRUST, PRIVACY, AND CUSTOMER SUPPORT LINKS */}
        <section
          aria-labelledby="trust-privacy-heading"
          className="bg-[#E9E1D5]/55 rounded-3xl p-6 sm:p-8 border border-[#1C2420]/10 space-y-6"
        >
          <div className="max-w-3xl space-y-2">
            <h2 id="trust-privacy-heading" className="font-serif text-2xl text-[#1C2420]">
              Trust, Privacy &amp; AI Visualization Disclosures
            </h2>
            <p className="text-xs sm:text-sm text-[#5F645D] leading-relaxed">
              <strong>AI Concept Disclosure:</strong> AI room redesign images generated by Eden
              Canvas are conceptual visualizations for inspiration and planning—they are not
              guarantees of exact retail product appearance, physical dimensions, lighting, or final
              room outcomes. Always measure your physical apartment and check lease rules before
              purchasing furniture or installing decor.
            </p>
            <p className="text-xs sm:text-sm text-[#5F645D] leading-relaxed">
              <strong>Image Processing &amp; Retention:</strong> Uploaded room photos are sent to
              the server-side AI endpoint solely to generate your requested room concept and are not
              stored in a permanent public gallery by this prototype.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenPolicyDoc('terms')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#1C2420]/12 text-xs font-semibold text-[#1C2420] hover:border-[#153A2E] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#153A2E]" />
              <span>Terms of Service (Draft)</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicyDoc('privacy')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#1C2420]/12 text-xs font-semibold text-[#1C2420] hover:border-[#153A2E] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#153A2E]" />
              <span>Privacy Policy (Draft)</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicyDoc('refund')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#1C2420]/12 text-xs font-semibold text-[#1C2420] hover:border-[#153A2E] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#153A2E]" />
              <span>Refund Policy (Draft)</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicyDoc('support')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#1C2420]/12 text-xs font-semibold text-[#1C2420] hover:border-[#153A2E] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#153A2E]" />
              <span>Contact / Support (Draft)</span>
            </button>
          </div>

          {activePolicyDoc && (
            <div
              role="dialog"
              aria-label="Draft Legal Policy Document"
              className="mt-4 bg-[#FFFFFF] rounded-2xl p-6 border border-[#153A2E]/30 space-y-3 text-xs sm:text-sm text-[#5F645D]"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1C2420]/10">
                <span className="font-serif text-lg font-semibold text-[#1C2420]">
                  {activePolicyDoc === 'terms' && 'Draft Terms of Service — Owner Review Required'}
                  {activePolicyDoc === 'privacy' && 'Draft Privacy Policy — Owner Review Required'}
                  {activePolicyDoc === 'refund' && 'Draft Refund Policy — Owner Review Required'}
                  {activePolicyDoc === 'support' && 'Customer Support & Contact — Owner Configuration Required'}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPolicyDoc(null)}
                  className="text-xs font-semibold text-[#153A2E] underline cursor-pointer"
                >
                  Close Document
                </button>
              </div>

              {activePolicyDoc === 'terms' && (
                <div className="space-y-2 leading-relaxed">
                  <p className="font-semibold text-[#C2623F]">
                    [DRAFT TEMPLATE — MUST BE REVIEWED AND COMPLETED BY LEGAL OWNER BEFORE LAUNCH]
                  </p>
                  <p>
                    1. <strong>Service Scope:</strong> Eden Canvas (by Wold Eden) provides conceptual
                    AI interior design visualizations and renter-oriented planning checklists.
                    Generated images are illustrative concepts and do not guarantee exact physical
                    dimensions, structural feasibility, or lease compliance.
                  </p>
                  <p>
                    2. <strong>One-Time Credit Packages:</strong> Purchased credits are one-time
                    allowances redeemable for supported design generations. Room Refresh package
                    credits expire 6 months after purchase as disclosed prior to checkout.
                  </p>
                  <p>
                    3. <strong>Legal Entity &amp; Governing Law:</strong> [Owner must insert formal
                    registered legal entity name, state/country of incorporation, and governing law
                    prior to production deployment.]
                  </p>
                </div>
              )}

              {activePolicyDoc === 'privacy' && (
                <div className="space-y-2 leading-relaxed">
                  <p className="font-semibold text-[#C2623F]">
                    [DRAFT TEMPLATE — MUST BE REVIEWED AND COMPLETED BY OWNER BEFORE LAUNCH]
                  </p>
                  <p>
                    1. <strong>Room Photos:</strong> Uploaded room images are transmitted to our
                    server-side API endpoint to generate your requested room redesign concept. We do
                    not sell your room photos or expose them in public galleries.
                  </p>
                  <p>
                    2. <strong>Payment Data:</strong> Eden Canvas never collects or stores raw
                    credit-card numbers directly on its servers. Live payments, once configured by
                    the owner, are processed by an external PCI-compliant payment provider.
                  </p>
                  <p>
                    3. <strong>Product Analytics:</strong> We log minimal anonymous workflow events
                    (such as package selection and credit usage) without including personal room
                    photos or payment credentials.
                  </p>
                </div>
              )}

              {activePolicyDoc === 'refund' && (
                <div className="space-y-2 leading-relaxed">
                  <p className="font-semibold text-[#C2623F]">
                    [DRAFT TEMPLATE — REQUIRES OWNER POLICY CONFIGURATION BEFORE PRODUCTION]
                  </p>
                  <p>
                    1. <strong>Failed Generations:</strong> If a room redesign request fails due to
                    a technical or provider error, the deducted design credit is automatically
                    restored to your account balance at no cost.
                  </p>
                  <p>
                    2. <strong>Credit Package Purchases:</strong> When a payment refund is issued by
                    the merchant, unused credits from that package are automatically reversed on the
                    server ledger. [Owner must specify the official monetary refund window and
                    eligibility conditions before activating live payments.]
                  </p>
                </div>
              )}

              {activePolicyDoc === 'support' && (
                <div className="space-y-2 leading-relaxed">
                  <p className="font-semibold text-[#C2623F]">
                    [DRAFT — OWNER MUST CONFIGURE OFFICIAL SUPPORT EMAIL / HELP DESK BEFORE LAUNCH]
                  </p>
                  <p>
                    For questions regarding your design credits, room redesign concepts, or billing
                    inquiries, the business owner must configure a verified support contact address
                    prior to public launch. No fabricated phone numbers or mailing addresses are
                    displayed in this prototype.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
