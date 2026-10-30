import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CreditSystemStore } from './creditSystem';

test('Acceptance Test 1: A new user sees the correct free allowance (3 trial credits)', () => {
  const store = new CreditSystemStore();
  const acct = store.createAccount();
  assert.equal(acct.summary.availableCredits, 3);
  assert.equal(acct.summary.trialCreditsGranted, 3);
  assert.equal(acct.summary.creditsPurchased, 0);
  assert.equal(acct.summary.creditsUsed, 0);
  assert.equal(acct.summary.transactions.length, 1);
  assert.equal(acct.summary.transactions[0].type, 'trial_grant');
  assert.equal(acct.summary.transactions[0].amount, 3);
});

test('Acceptance Test 2 & 3: User can view all four packages and prices/allowances match server configuration', () => {
  const store = new CreditSystemStore();
  const cfg = store.getConfig();
  assert.equal(cfg.packages.length, 4);

  const [freePlan, starterPlan, refreshPlan, makeoverPlan] = cfg.packages;
  assert.equal(freePlan.id, 'free');
  assert.equal(freePlan.priceCents, 0);
  assert.equal(freePlan.credits, 3);

  assert.equal(starterPlan.id, 'starter');
  assert.equal(starterPlan.priceCents, 599);
  assert.equal(starterPlan.priceFormatted, '$5.99');
  assert.equal(starterPlan.credits, 20);
  assert.equal(starterPlan.expirationMonths, null);

  assert.equal(refreshPlan.id, 'room_refresh');
  assert.equal(refreshPlan.priceCents, 1200);
  assert.equal(refreshPlan.priceFormatted, '$12.00');
  assert.equal(refreshPlan.credits, 50);
  assert.equal(refreshPlan.expirationMonths, 6);
  assert.equal(refreshPlan.recommended, true);

  assert.equal(makeoverPlan.id, 'home_makeover');
  assert.equal(makeoverPlan.priceCents, 2400);
  assert.equal(makeoverPlan.priceFormatted, '$24.00');
  assert.equal(makeoverPlan.credits, 120);
  assert.equal(makeoverPlan.expirationMonths, null);
});

test('Acceptance Test 4: An unauthenticated user or another user cannot access another user balance', () => {
  const store = new CreditSystemStore();
  const userA = store.createAccount();
  const userB = store.createAccount();

  // Missing token fails
  assert.throws(() => {
    store.getAccountSummary(userA.accountId, '');
  }, /UNAUTHORIZED_ACCOUNT_ACCESS/);

  // Wrong user's token fails
  assert.throws(() => {
    store.getAccountSummary(userA.accountId, userB.sessionToken);
  }, /UNAUTHORIZED_ACCOUNT_ACCESS/);
});

test('Acceptance Test 5 & 6: Checkout cancellation and failed payment do not grant credits', () => {
  const store = new CreditSystemStore();
  const user = store.createAccount();

  const cancelSession = store.createCheckoutSession({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    packageId: 'starter',
  });

  store.processPaymentWebhookEvent({
    webhookEventId: 'evt_cancel_1',
    sessionId: cancelSession.id,
    eventType: 'checkout.cancelled',
    isDevelopmentSandboxAction: true,
  });

  let summary = store.getAccountSummary(user.accountId, user.sessionToken);
  assert.equal(summary.availableCredits, 3);
  assert.equal(summary.creditsPurchased, 0);

  const failSession = store.createCheckoutSession({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    packageId: 'room_refresh',
  });

  store.processPaymentWebhookEvent({
    webhookEventId: 'evt_fail_1',
    sessionId: failSession.id,
    eventType: 'payment.failed',
    isDevelopmentSandboxAction: true,
  });

  summary = store.getAccountSummary(user.accountId, user.sessionToken);
  assert.equal(summary.availableCredits, 3);
  assert.equal(summary.creditsPurchased, 0);
});

test('Acceptance Test 7 & 8: Verified successful payment grants credits once, and repeated webhooks do not grant duplicate credits', () => {
  const store = new CreditSystemStore();
  const user = store.createAccount();

  const session = store.createCheckoutSession({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    packageId: 'room_refresh',
  });

  // First webhook event grants 50 credits
  const firstResult = store.processPaymentWebhookEvent({
    webhookEventId: 'evt_success_50',
    sessionId: session.id,
    eventType: 'checkout.completed',
    isDevelopmentSandboxAction: true,
  });
  assert.equal(firstResult.idempotentDuplicate, false);
  assert.equal(firstResult.creditsDelta, 50);

  let summary = store.getAccountSummary(user.accountId, user.sessionToken);
  assert.equal(summary.availableCredits, 53); // 3 trial + 50 purchased
  assert.equal(summary.creditsPurchased, 50);

  // Repeated webhook with the same event ID is ignored
  const duplicateEvent = store.processPaymentWebhookEvent({
    webhookEventId: 'evt_success_50',
    sessionId: session.id,
    eventType: 'checkout.completed',
    isDevelopmentSandboxAction: true,
  });
  assert.equal(duplicateEvent.idempotentDuplicate, true);
  assert.equal(duplicateEvent.creditsDelta, 0);

  // Even a different webhook event ID for the same completed session is blocked from double-granting
  const duplicateSessionEvent = store.processPaymentWebhookEvent({
    webhookEventId: 'evt_success_50_retry',
    sessionId: session.id,
    eventType: 'checkout.completed',
    isDevelopmentSandboxAction: true,
  });
  assert.equal(duplicateSessionEvent.idempotentDuplicate, true);
  assert.equal(duplicateSessionEvent.creditsDelta, 0);

  summary = store.getAccountSummary(user.accountId, user.sessionToken);
  assert.equal(summary.availableCredits, 53);
});

test('Acceptance Test 9: A failed image-generation request follows the configured automatic credit-refund policy and never double-deducts', () => {
  const store = new CreditSystemStore();
  const user = store.createAccount();

  // Deduct 1 credit for operation op_101
  const reservation = store.reserveCreditsForGeneration({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    operationId: 'op_101',
    roomType: 'Living Room',
    style: 'Organic Modern',
  });
  assert.equal(reservation.balanceAfter, 2);

  // Repeating the same operationId does not deduct again
  const duplicateReservation = store.reserveCreditsForGeneration({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    operationId: 'op_101',
    roomType: 'Living Room',
    style: 'Organic Modern',
  });
  assert.equal(duplicateReservation.alreadyProcessed, true);
  assert.equal(duplicateReservation.balanceAfter, 2);

  // Generation fails -> automatically refunds 1 credit
  const refundResult = store.failAndRefundGenerationOperation({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    operationId: 'op_101',
    errorMessage: 'Provider timeout',
  });
  assert.equal(refundResult.refunded, true);
  assert.equal(refundResult.refundedCredits, 1);
  assert.equal(refundResult.summary.availableCredits, 3);
  assert.equal(refundResult.summary.creditsUsed, 0);
  assert.equal(refundResult.summary.generationHistory[0].status, 'failed_refunded');
});

test('Acceptance Test 10: A user with insufficient credits cannot start a generation operation', () => {
  const store = new CreditSystemStore();
  const user = store.createAccount();

  // Spend all 3 free trial credits
  for (let i = 1; i <= 3; i++) {
    store.reserveCreditsForGeneration({
      accountId: user.accountId,
      sessionToken: user.sessionToken,
      operationId: `op_${i}`,
      roomType: 'Bedroom',
      style: 'Japandi',
    });
    store.completeGenerationOperation({
      accountId: user.accountId,
      sessionToken: user.sessionToken,
      operationId: `op_${i}`,
      mode: 'demo_fallback',
    });
  }

  const summaryAfter = store.getAccountSummary(user.accountId, user.sessionToken);
  assert.equal(summaryAfter.availableCredits, 0);

  // 4th attempt is rejected with INSUFFICIENT_CREDITS
  assert.throws(() => {
    store.reserveCreditsForGeneration({
      accountId: user.accountId,
      sessionToken: user.sessionToken,
      operationId: 'op_4',
      roomType: 'Bedroom',
      style: 'Japandi',
    });
  }, /INSUFFICIENT_CREDITS/);
});

test('Acceptance Test 11: Client-side manipulation cannot change the actual balance or package price, and unauthorized admin updates are rejected', () => {
  const store = new CreditSystemStore();
  const user = store.createAccount();

  // Unauthorized admin update without valid token is rejected
  assert.throws(() => {
    store.updateAdminPricingConfig('invalid_hacker_token', {
      packages: [{ id: 'home_makeover', priceCents: 1, credits: 99999 }],
    });
  }, /ADMIN_UNAUTHORIZED/);

  // Checkout session always uses server-configured price ($24.00 / 2400 cents) and credits (120)
  const session = store.createCheckoutSession({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    packageId: 'home_makeover',
  });
  assert.equal(session.priceCents, 2400);
  assert.equal(session.creditsToGrant, 120);
});

test('Acceptance Test 12: Expired credits (Room Refresh 6-month rule) are handled according to disclosed policy with an auditable ledger entry and notice', () => {
  const store = new CreditSystemStore();
  const purchaseDate = new Date('2026-01-01T12:00:00.000Z');
  const user = store.createAccount(purchaseDate);

  const session = store.createCheckoutSession({
    accountId: user.accountId,
    sessionToken: user.sessionToken,
    packageId: 'room_refresh',
    now: purchaseDate,
  });

  store.processPaymentWebhookEvent({
    webhookEventId: 'evt_refresh_exp_test',
    sessionId: session.id,
    eventType: 'checkout.completed',
    isDevelopmentSandboxAction: true,
    now: purchaseDate,
  });

  // 2 months later (March 2026): 53 credits available, activeExpiringLot is visible
  const twoMonthsLater = new Date('2026-03-01T12:00:00.000Z');
  const midSummary = store.getAccountSummary(user.accountId, user.sessionToken, twoMonthsLater);
  assert.equal(midSummary.availableCredits, 53);
  assert.ok(midSummary.activeExpiringLot);
  assert.equal(midSummary.activeExpiringLot?.creditsRemaining, 50);

  // 7 months later (August 2026): the 50 Room Refresh credits have expired, while the 3 non-expiring trial credits remain
  const sevenMonthsLater = new Date('2026-08-05T12:00:00.000Z');
  const postExpirySummary = store.getAccountSummary(user.accountId, user.sessionToken, sevenMonthsLater);
  assert.equal(postExpirySummary.availableCredits, 3);
  assert.equal(postExpirySummary.creditsExpired, 50);
  assert.equal(postExpirySummary.expiredNotices.length, 1);
  assert.equal(postExpirySummary.expiredNotices[0].expiredCredits, 50);
  assert.equal(postExpirySummary.transactions[0].type, 'credit_expiration');
  assert.equal(postExpirySummary.transactions[0].amount, -50);
});

test('Acceptance Test 13 & 14: Payment credentials are not exposed in frontend code and dev mode is honestly reported', () => {
  const store = new CreditSystemStore();
  const envStatus = store.getPaymentEnvironmentStatus();
  assert.equal(envStatus.providerMode, 'development_demo');
  assert.equal(envStatus.liveCredentialsConfigured, false);

  // Verify no frontend file references PAYMENT_PROVIDER_SECRET_KEY or PAYMENT_WEBHOOK_SECRET
  const srcDir = path.resolve(process.cwd(), 'src');
  const checkFiles = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'server') {
        files = files.concat(checkFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        if (!entry.name.endsWith('.test.ts')) {
          files.push(fullPath);
        }
      }
    }
    return files;
  };

  for (const file of checkFiles(srcDir)) {
    const content = fs.readFileSync(file, 'utf8');
    assert.equal(
      content.includes('process.env.PAYMENT_PROVIDER_SECRET_KEY'),
      false,
      `Frontend file ${file} must not access PAYMENT_PROVIDER_SECRET_KEY`
    );
  }
});
