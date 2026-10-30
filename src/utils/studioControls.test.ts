import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PRICING_PACKAGES } from '../components/PricingModal';
import { DepositProtectionWidget } from '../components/DepositProtectionWidget';
import { exportComparisonImage } from './imageExporter';

describe('Studio Workspace Dropdowns & Pricing Architecture', () => {
  test('Pricing packages match RoomGPT 3-tier structure ($9, $19, $29)', () => {
    assert.equal(PRICING_PACKAGES.length, 3);

    const starter = PRICING_PACKAGES.find((p) => p.name === 'Starter Pack');
    assert.ok(starter, 'Starter Pack exists');
    assert.equal(starter.credits, 30);
    assert.equal(starter.price, '$9');

    const popular = PRICING_PACKAGES.find((p) => p.name === 'Most Popular');
    assert.ok(popular, 'Most Popular pack exists');
    assert.equal(popular.credits, 100);
    assert.equal(popular.price, '$19');
    assert.equal(popular.highlighted, true);
    assert.equal(popular.badge, 'MOST POPULAR');

    const vip = PRICING_PACKAGES.find((p) => p.name === 'Renter VIP');
    assert.ok(vip, 'Renter VIP exists');
    assert.equal(vip.credits, 200);
    assert.equal(vip.price, '$29');
  });

  test('Pricing packages include required renter-friendly features', () => {
    for (const pkg of PRICING_PACKAGES) {
      assert.ok(pkg.features.length >= 4, `${pkg.name} has rich features`);
      assert.ok(pkg.description.length > 0, `${pkg.name} has description`);
    }
  });

  test('DepositProtectionWidget component and image exporter are properly exported', () => {
    assert.equal(typeof DepositProtectionWidget, 'function');
    assert.equal(typeof exportComparisonImage, 'function');
  });
});
