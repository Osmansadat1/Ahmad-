import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PREFERENCES,
  RENTER_VALIDATION_SCENARIOS,
  buildActionablePlan,
  buildArchitecturalNotes,
  buildRedesignPrompt,
  buildSmallSpaceNotes,
  calculateBudgetSummary,
  createAnalyticsEvent,
  createInitialCreditState,
  consumeDesignCredit,
  formatApiErrorMessage,
  reviseRecommendationsToFitBudget,
  selectRecommendations,
  validatePhotoUpload,
} from './designEngine';

test('validatePhotoUpload rejects missing files, unsupported formats/extensions, empty files, and oversized files', () => {
  assert.equal(validatePhotoUpload(null).valid, false);
  assert.equal(validatePhotoUpload({ name: 'room.pdf', type: 'application/pdf', size: 1024 }).valid, false);
  assert.equal(validatePhotoUpload({ name: 'room.jpg', type: 'image/jpeg', size: 0 }).valid, false);
  assert.equal(
    validatePhotoUpload({ name: 'room.jpg', type: 'image/jpeg', size: 12 * 1024 * 1024 }).valid,
    false
  );
  assert.equal(validatePhotoUpload({ name: 'room.webp', type: 'image/webp', size: 250000 }).valid, true);
});

test('Scenario 1: Renter with a $50 budget gets affordable recommendations, accurate budget calculation, and revision support', () => {
  const scenario = RENTER_VALIDATION_SCENARIOS.find((s) => s.id === 'budget-50')!;
  const result = selectRecommendations(scenario.preferences, {
    userVerifiedPrices: scenario.simulatedVerifiedPrices,
  });

  assert.equal(scenario.preferences.maxBudgetDollars, 50);
  // If 2 items ($32 + $38 = $70) exceed $50, isOverBudget is flagged and reviseRecommendationsToFitBudget trims to <= $50
  assert.equal(result.budgetSummary.isOverBudget, true);
  assert.equal(result.budgetSummary.exceedsBudgetByDollars, 20);

  const revised = reviseRecommendationsToFitBudget(
    result.items,
    50,
    scenario.simulatedVerifiedPrices
  );
  assert.equal(revised.length, 1);
  const revisedSummary = calculateBudgetSummary(
    revised,
    50,
    scenario.preferences.budgetIntent,
    scenario.simulatedVerifiedPrices
  );
  assert.equal(revisedSummary.isOverBudget, false);
  assert.equal(revisedSummary.verifiedSubtotalDollars, 32);
  assert.equal(revisedSummary.remainingBudgetDollars, 18);
});

test('Scenario 2: Renter who cannot paint, drill, hardwire, or use permanent adhesives receives 100% compliant recommendations and prompt', () => {
  const scenario = RENTER_VALIDATION_SCENARIOS.find((s) => s.id === 'no-paint-no-drill')!;
  const prompt = buildRedesignPrompt(scenario.preferences);
  const recs = selectRecommendations(scenario.preferences);

  assert.match(prompt, /\[No Painting: ENABLED\]/);
  assert.match(prompt, /\[No Drilling: ENABLED\]/);
  assert.match(prompt, /\[No Hardwiring: ENABLED\]/);
  assert.match(prompt, /\[No Permanent Adhesives: ENABLED\]/);
  assert.match(prompt, /\[Keep Existing Fixtures: ENABLED\]/);

  for (const item of recs.items) {
    assert.equal(item.requiresDrilling, false);
    assert.equal(item.requiresHardwiring, false);
    assert.equal(item.requiresPainting, false);
    assert.equal(item.usesAdhesive, false);
    assert.equal(item.replacesFixture, false);
  }
});

test('Scenario 3: Renter in a small studio apartment gets small-space scale, walkway, and non-distorting perspective instructions', () => {
  const scenario = RENTER_VALIDATION_SCENARIOS.find((s) => s.id === 'small-studio')!;
  const prompt = buildRedesignPrompt(scenario.preferences);
  const smallSpaceNotes = buildSmallSpaceNotes(scenario.preferences);

  assert.match(prompt, /\[Small-Space Apartment Logic: ENABLED\]/);
  assert.match(prompt, /Do NOT alter room dimensions or camera perspective to fake a larger room/);
  assert.ok(smallSpaceNotes.length >= 3);
});

test('Scenario 4: Renter who wants to keep existing furniture prioritizes reusing identified items before purchases', () => {
  const scenario = RENTER_VALIDATION_SCENARIOS.find((s) => s.id === 'keep-existing-furniture')!;
  const prompt = buildRedesignPrompt(scenario.preferences);
  const recs = selectRecommendations(scenario.preferences);
  const plan = buildActionablePlan(scenario.preferences, recs.items);

  assert.match(prompt, /\[What I Already Own: KEEP ALL EXISTING FURNITURE\]/);
  assert.match(prompt, /Sofa \/ Sectional, Coffee Table, TV Stand \/ Media Console/);
  assert.equal(plan[0].costTier, 'free');
  assert.match(plan[0].description, /Sofa \/ Sectional/);
});

test('Scenario 5: Renter who wants inspiration only ($0 spend / existing items only) gets $0 free action plan and zero forced purchases', () => {
  const scenario = RENTER_VALIDATION_SCENARIOS.find((s) => s.id === 'inspiration-no-purchase')!;
  const recs = selectRecommendations(scenario.preferences);
  const plan = buildActionablePlan(scenario.preferences, recs.items);

  assert.equal(recs.items.length, 0);
  assert.equal(recs.budgetSummary.isOverBudget, false);
  assert.ok(plan.every((step) => step.costTier === 'free'));
});

test('Scenario 6: Renter whose selected products exceed the budget sees clear excess amount and can revise list to fit budget', () => {
  const scenario = RENTER_VALIDATION_SCENARIOS.find((s) => s.id === 'exceeds-budget')!;
  const recs = selectRecommendations(scenario.preferences, {
    userVerifiedPrices: scenario.simulatedVerifiedPrices,
  });

  assert.equal(recs.budgetSummary.isOverBudget, true);
  assert.ok((recs.budgetSummary.exceedsBudgetByDollars || 0) > 0);

  const revised = reviseRecommendationsToFitBudget(
    recs.items,
    scenario.preferences.maxBudgetDollars,
    scenario.simulatedVerifiedPrices
  );
  const revisedSummary = calculateBudgetSummary(
    revised,
    scenario.preferences.maxBudgetDollars,
    scenario.preferences.budgetIntent,
    scenario.simulatedVerifiedPrices
  );
  assert.equal(revisedSummary.isOverBudget, false);
  assert.ok(revisedSummary.verifiedSubtotalDollars <= 120);
});

test('Scenario 7: User whose uploaded photo contains architectural features that must remain unchanged locks all 7 features in prompt', () => {
  const scenario = RENTER_VALIDATION_SCENARIOS.find((s) => s.id === 'locked-architecture')!;
  const prompt = buildRedesignPrompt(scenario.preferences);
  const archNotes = buildArchitecturalNotes(scenario.preferences);

  assert.match(prompt, /\[Keep What Cannot Be Changed: LOCKED\]/);
  assert.match(prompt, /wall colors/);
  assert.match(prompt, /existing flooring/);
  assert.match(prompt, /windows/);
  assert.match(prompt, /doors/);
  assert.match(prompt, /built-in cabinets/);
  assert.match(prompt, /fixed lighting/);
  assert.match(prompt, /existing architectural features/);
  assert.equal(archNotes.length, 7);
});

test('formatApiErrorMessage and privacy-safe analytics work as expected', () => {
  assert.match(formatApiErrorMessage(401), /Invalid or unauthorized API key/);
  assert.match(formatApiErrorMessage(429), /rate limit/i);

  const credit0 = createInitialCreditState();
  const credit1 = consumeDesignCredit(credit0);
  assert.equal(credit1.freeTrialRemaining, credit0.freeTrialRemaining - 1);

  const evt = createAnalyticsEvent('photo_uploaded_successfully', {
    imageBase64: 'secret-photo-bytes',
    apiKey: 'secret-key',
    roomType: 'Studio Apartment',
  });
  assert.equal('imageBase64' in evt.metadata, false);
  assert.equal('apiKey' in evt.metadata, false);
  assert.equal(evt.metadata.roomType, 'Studio Apartment');
});
