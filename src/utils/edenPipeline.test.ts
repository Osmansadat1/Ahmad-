import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AMAZON_AFFILIATE_TAG,
  DISPOSABLE_EMAIL_DOMAINS,
  EMAIL_BONUS,
  LANDLORD_SPECIAL_OPTIONS,
  PRICING_PACKAGES,
  ROOM_OPTIONS,
  SHOP_PRODUCTS,
  START_CREDITS,
  STYLE_OPTIONS,
  BUDGET_TIERS,
  buildAmazonAffiliateUrl,
  validateEmailAddress,
} from '../data/config';
import { MAX_DIMENSION, MAX_UPLOAD_BYTES, JPEG_QUALITY } from './imageCompressor';
import { calculateReversibilityScore } from './reversibilityScore';
import { redactLeaseTextLocally, extractHeuristicLeaseClauses } from './leaseParser';
import { LEASE_SAFE_PRODUCTS, packProductsForBudget } from '../data/products';

test('Email Gate: validates correct format and rejects disposable temporary domains', () => {
  // Empty
  const emptyRes = validateEmailAddress('');
  assert.equal(emptyRes.valid, false);

  // Invalid syntax
  const invalidSyntax = validateEmailAddress('notanemail');
  assert.equal(invalidSyntax.valid, false);

  // Disposable blocked domains
  assert.equal(validateEmailAddress('test@mailinator.com').valid, false);
  assert.equal(validateEmailAddress('user@tempmail.com').valid, false);
  assert.equal(validateEmailAddress('renter@guerrillamail.com').valid, false);
  assert.equal(validateEmailAddress('person@10minutemail.com').valid, false);
  assert.equal(validateEmailAddress('fake@sharklasers.com').valid, false);

  // Valid standard domains
  assert.equal(validateEmailAddress('alex@gmail.com').valid, true);
  assert.equal(validateEmailAddress('jordan@outlook.com').valid, true);
  assert.equal(validateEmailAddress('taylor@company.org').valid, true);
});

test('Amazon Shop: affiliate URLs always strictly contain tag=Sayedosmanema-20', () => {
  assert.equal(AMAZON_AFFILIATE_TAG, 'Sayedosmanema-20');

  for (const product of SHOP_PRODUCTS) {
    const url = buildAmazonAffiliateUrl(product);
    assert.ok(url.includes('tag=Sayedosmanema-20'), `URL for ${product.name} must include affiliate tag`);
    assert.ok(url.startsWith('https://www.amazon.com/'), 'Must point to amazon.com');
  }

  // All LEASE_SAFE_PRODUCTS in products.ts must contain tag=Sayedosmanema-20
  for (const prod of LEASE_SAFE_PRODUCTS) {
    assert.ok(
      prod.amazonUrl.includes('tag=Sayedosmanema-20'),
      `Product ${prod.title} amazonUrl must include tag=Sayedosmanema-20`
    );
  }
});

test('Pricing & Credits: matches exact RoomGPT freemium specification', () => {
  assert.equal(START_CREDITS, 3, 'Initial credits must be 3');
  assert.equal(EMAIL_BONUS, 4, 'Email unlock bonus must be 4');

  // Verify 4 packages
  assert.equal(PRICING_PACKAGES.length, 4, 'Must have exactly 4 pricing packs');

  const freePkg = PRICING_PACKAGES.find((p) => p.id === 'free');
  assert.ok(freePkg, 'Free pack exists');
  assert.equal(freePkg.credits, 3);
  assert.equal(freePkg.priceAmount, 0);

  const starterPkg = PRICING_PACKAGES.find((p) => p.id === 'starter');
  assert.ok(starterPkg, 'Starter pack exists');
  assert.equal(starterPkg.credits, 20);
  assert.equal(starterPkg.priceAmount, 5.99);

  const refreshPkg = PRICING_PACKAGES.find((p) => p.id === 'room-refresh');
  assert.ok(refreshPkg, 'Room refresh pack exists');
  assert.equal(refreshPkg.credits, 50);
  assert.equal(refreshPkg.priceAmount, 12);
  assert.equal(refreshPkg.popular, true);

  const makeoverPkg = PRICING_PACKAGES.find((p) => p.id === 'home-makeover');
  assert.ok(makeoverPkg, 'Home makeover pack exists');
  assert.equal(makeoverPkg.credits, 120);
  assert.equal(makeoverPkg.priceAmount, 24);
});

test('Feature 1 - Reversibility Score: accurately evaluates Lease Safety Index (0-100)', () => {
  // 100/100 score for pure freestanding & tension elements
  const score100 = calculateReversibilityScore(
    ['Zero-Drill Lighting', 'Hide Carpet with Area Rug'],
    ['beige-carpet', 'popcorn-ceiling']
  );
  assert.equal(score100.score, 100);
  assert.ok(score100.tierLabel.includes('100/100'));
  assert.ok(score100.explanation.includes('gravity-balanced'));
  assert.ok(score100.howToReach100Tip.length > 0);
  assert.ok(score100.removalSteps.length >= 2);

  // ~85 score for peel-and-stick adhesive wrap
  const score85 = calculateReversibilityScore(
    ['90s Honey-Oak Cabinet Wrap'],
    ['dated-cabinets']
  );
  assert.ok(score85.score >= 80 && score85.score <= 90);
  assert.ok(score85.explanation.includes('hair dryer'));
  assert.ok(score85.howToReach100Tip.includes('How to reach 100'));

  // Includes detailed removal step for cabinet wrap
  const wrapStep = score85.removalSteps.find((s) => s.item.includes('Cabinet Wrap'));
  assert.ok(wrapStep);
  assert.ok(wrapStep.instructions.includes('45-degree angle'));
});

test('Feature 2 - Anti-Landlord-Special Filter: includes all 6 rental eyesore solutions', () => {
  const ids = LANDLORD_SPECIAL_OPTIONS.map((o) => o.id);
  assert.ok(ids.includes('boob-light'), 'Contains flush-mount boob light mask');
  assert.ok(ids.includes('beige-carpet'), 'Contains beige carpet mask');
  assert.ok(ids.includes('popcorn-ceiling'), 'Contains popcorn ceiling mask');
  assert.ok(ids.includes('electrical-panel'), 'Contains exposed electrical panel mask');
  assert.ok(ids.includes('painted-vents'), 'Contains painted-over vents rule');
  assert.ok(ids.includes('dated-cabinets'), 'Contains dated honey-oak cabinets mask');

  for (const opt of LANDLORD_SPECIAL_OPTIONS) {
    assert.ok(opt.solution.length > 5, 'Every option has a clear solution');
    assert.ok(opt.promptInstruction.length > 15, 'Every option has prompt instruction');
  }
});

test('Feature 3 - Budget-Locked Hardware Cart: packs items strictly under $50, $150, $300', () => {
  assert.deepEqual(BUDGET_TIERS, [50, 150, 300]);

  for (const tier of BUDGET_TIERS) {
    const pack = packProductsForBudget(LEASE_SAFE_PRODUCTS, tier);
    assert.ok(
      pack.totalSpent <= tier,
      `Basket total (${pack.totalSpent}) must be <= budget tier (${tier})`
    );
    assert.ok(pack.packedProducts.length > 0, `Must pack at least 1 item for $${tier}`);
    for (const prod of pack.packedProducts) {
      assert.ok(prod.amazonUrl.includes('tag=Sayedosmanema-20'));
    }
  }
});

test('Feature 6 - Lease Parser: client-side privacy redaction scrubs PII locally', () => {
  const sensitiveText = `RESIDENTIAL LEASE AGREEMENT
Tenant Name: John Smith
Lessor: Apex Living Properties LLC
SSN: 123-45-6789
Bank Account: 9876543210123
Phone: (555) 234-5678
Email: tenant.john@domain.com
Monthly Rent: $2,850.00 / month
12. WALLS & PAINT: Tenant shall not paint, wallpaper, or apply adhesive films to any wall.
13. FIXTURES: Light fixtures and ceiling fans must remain intact.
Tenant Signature: John Smith`;

  const { redactedText, redactionsCount } = redactLeaseTextLocally(sensitiveText);

  // Sensitive items must be scrubbed
  assert.ok(!redactedText.includes('123-45-6789'), 'SSN must be redacted');
  assert.ok(redactedText.includes('[REDACTED SSN]'));
  assert.ok(!redactedText.includes('9876543210123'), 'Account must be redacted');
  assert.ok(!redactedText.includes('tenant.john@domain.com'), 'Email must be redacted');
  assert.ok(!redactedText.includes('(555) 234-5678'), 'Phone must be redacted');
  assert.ok(!redactedText.includes('$2,850.00'), 'Rent dollar amount must be redacted');
  assert.ok(redactionsCount >= 5, 'Must report accurate redactions count');

  // Test heuristic clause extraction
  const clauses = extractHeuristicLeaseClauses(redactedText);
  assert.ok(clauses.length >= 2, 'Must extract at least 2 relevant restrictive clauses');
  const paintClause = clauses.find((c) => c.topic === 'Painting');
  assert.ok(paintClause, 'Must detect painting clause');
  const fixtureClause = clauses.find((c) => c.topic === 'Fixtures & Lighting');
  assert.ok(fixtureClause, 'Must detect fixture clause');
});
