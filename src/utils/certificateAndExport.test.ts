import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { packProductsForBudget, LEASE_SAFE_PRODUCTS, getProductPriceNumber } from '../data/products';
import { exportComparisonImage } from './imageExporter';

test('MoveOutCertificateModal: component file contains all formal legal and compliance requirements', () => {
  const content = fs.readFileSync('src/components/MoveOutCertificateModal.tsx', 'utf8');

  // Verify modal title & formal header
  assert.equal(content.includes('Landlord Move-Out Inspection Report'), true, 'Must include Landlord Move-Out Inspection Report');
  assert.equal(content.includes('Certified Non-Destructive Renter Makeover Audit'), true, 'Must include audit subtitle');
  assert.equal(content.includes('100% Lease-Compliance Certified'), true, 'Must display compliance badge');

  // Verify photographic record
  assert.equal(content.includes('Photographic Move-In vs. Reversible Concept Record'), true, 'Must display photographic record section');
  assert.equal(content.includes('BASE CONDITION'), true, 'Must label base condition');
  assert.equal(content.includes('REVERSIBLE MAKEOVER'), true, 'Must label reversible makeover');

  // Verify itemized hardware audit table
  assert.equal(content.includes('Itemized Fixture & Attachment Audit') || content.includes('Itemized Fixture &amp; Attachment Audit'), true, 'Must have itemized table');
  assert.equal(content.includes('0% (Zero Screws / Nails)'), true, 'Must include 0% screw/nail audit');
  assert.equal(content.includes('0% (Zero Residue / Glue)'), true, 'Must include 0% glue audit');
  assert.equal(content.includes('0% (Zero Hardwiring)'), true, 'Must include zero hardwiring audit');

  // Verify 3-step removal protocol
  assert.equal(content.includes('Mandatory 3-Step Move-Out Restoration Protocol'), true, 'Must have 3-step protocol');
  assert.equal(content.includes('Gently Peel & Release') || content.includes('Gently Peel &amp; Release'), true, 'Step 1 must be peel/release');
  assert.equal(content.includes('Surface Wipe-Down'), true, 'Step 2 must be wipe-down');
  assert.equal(content.includes('Pack & Reclaim') || content.includes('Pack &amp; Reclaim'), true, 'Step 3 must be pack & reclaim');

  // Verify formal sign-off
  assert.equal(content.includes('Property Manager Sign-Off'), true, 'Must have Property Manager Sign-Off block');
  assert.equal(content.includes('Signature / Move-Out Inspection'), true, 'Must have signature line');
  assert.equal(content.includes('window.print()'), true, 'Must trigger native print for PDF saving');
});

test('Image Exporter: module file defines clean 16:9 canvas stitching and brand watermark', () => {
  const content = fs.readFileSync('src/utils/imageExporter.ts', 'utf8');

  assert.equal(typeof exportComparisonImage, 'function', 'exportComparisonImage must be exported function');
  assert.equal(content.includes('Designed with Eden Canvas • woldeden.com'), true, 'Must include official Eden Canvas watermark');
  assert.equal(content.includes('BEFORE (Original)'), true, 'Must include BEFORE tag');
  assert.equal(content.includes('AFTER (100% Lease-Safe)'), true, 'Must include AFTER tag');
});

test('Dynamic Budget Packing: packProductsForBudget packs items within exact target budget', () => {
  // Test $50 budget
  const result50 = packProductsForBudget(LEASE_SAFE_PRODUCTS, 50);
  assert.ok(result50.totalSpent <= 50, `Spent ${result50.totalSpent} must not exceed $50`);
  assert.equal(result50.remainingBudget, Math.round((50 - result50.totalSpent) * 100) / 100);
  assert.ok(result50.packedProducts.length > 0, 'Must include at least 1 item for $50');

  // Test $100 budget
  const result100 = packProductsForBudget(LEASE_SAFE_PRODUCTS, 100);
  assert.ok(result100.totalSpent <= 100, `Spent ${result100.totalSpent} must not exceed $100`);
  assert.equal(result100.remainingBudget, Math.round((100 - result100.totalSpent) * 100) / 100);

  // Test $150 budget
  const result150 = packProductsForBudget(LEASE_SAFE_PRODUCTS, 150);
  assert.ok(result150.totalSpent <= 150, `Spent ${result150.totalSpent} must not exceed $150`);
  assert.equal(result150.remainingBudget, Math.round((150 - result150.totalSpent) * 100) / 100);

  // Test $200 budget
  const result200 = packProductsForBudget(LEASE_SAFE_PRODUCTS, 200);
  assert.ok(result200.totalSpent <= 200, `Spent ${result200.totalSpent} must not exceed $200`);
  assert.equal(result200.remainingBudget, Math.round((200 - result200.totalSpent) * 100) / 100);
});
