import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RENTER_TESTIMONIALS } from '../components/RenterTestimonials';

describe('Renter Testimonials Data & Contract', () => {
  test('contains exactly 6 curated quiet luxury testimonials', () => {
    assert.equal(RENTER_TESTIMONIALS.length, 6);
  });

  test('all testimonials have realistic renter details, locations, and tags', () => {
    const requiredRenters = [
      'Elena S.',
      'Marcus T.',
      'Chloe W.',
      'Julian M.',
      'Hannah K.',
      'Liam D.',
    ];

    const names = RENTER_TESTIMONIALS.map((t) => t.name);
    for (const renter of requiredRenters) {
      assert.ok(names.includes(renter), `Missing renter testimonial for ${renter}`);
    }

    for (const item of RENTER_TESTIMONIALS) {
      assert.ok(item.id && item.id.length > 0, 'Must have unique id');
      assert.ok(item.name && item.name.length > 0, 'Must have name');
      assert.ok(item.location && item.location.includes(','), 'Must specify city/state');
      assert.ok(item.tag && item.tag.length > 0, 'Must specify lease-safe win tag');
      assert.ok(item.feedback && item.feedback.length >= 20, 'Feedback must be substantial');
    }
  });

  test('all tags correspond to lease-safe and deposit-safe wins', () => {
    const validTags = [
      'Full Deposit Kept',
      'P&S Cabinets',
      'Zero Drill',
      '100% Lease-Safe',
      'Damage-Free Light',
      'Deposit Protected',
    ];

    for (const item of RENTER_TESTIMONIALS) {
      assert.ok(
        validTags.includes(item.tag),
        `Unexpected or unverified tag: ${item.tag}`
      );
    }
  });
});
