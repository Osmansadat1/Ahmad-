import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  LEASE_SAFE_PRODUCTS,
  LeaseSafeProduct,
  AMAZON_AFFILIATE_TAG,
} from '../data/products';

describe('LeaseSafeProduct Database (src/data/products.ts)', () => {
  const VALID_CATEGORIES = [
    'partition',
    'flooring',
    'kitchen',
    'lighting',
    'bathroom',
    'decor',
  ];

  const VALID_ROOMS = [
    'Living Room',
    'Studio Apartment',
    'Bedroom',
    'Rental Bathroom',
    'Outdated Kitchen',
    'Dining Room',
    'Small Home Office',
  ];

  const VALID_BADGES = ['Zero-Drill', 'Peel & Stick', 'Damage-Free', 'Removable'];

  test('contains a rich catalog of at least 15 lease-safe products', () => {
    assert.ok(
      LEASE_SAFE_PRODUCTS.length >= 15,
      `Expected >= 15 products, found ${LEASE_SAFE_PRODUCTS.length}`
    );
  });

  test('all products adhere strictly to the LeaseSafeProduct schema', () => {
    const ids = new Set<string>();

    for (const product of LEASE_SAFE_PRODUCTS) {
      assert.ok(product.id, 'Product must have an id');
      assert.ok(!ids.has(product.id), `Duplicate product id found: ${product.id}`);
      ids.add(product.id);

      assert.ok(product.title && product.title.length > 5, `Product title too short: ${product.id}`);
      assert.ok(
        product.description && product.description.length > 15,
        `Product description too short: ${product.id}`
      );

      assert.ok(
        VALID_CATEGORIES.includes(product.category),
        `Invalid category ${product.category} on ${product.id}`
      );

      assert.ok(
        product.applicableRooms.length > 0,
        `Product must specify applicable rooms: ${product.id}`
      );

      for (const room of product.applicableRooms) {
        assert.ok(
          VALID_ROOMS.includes(room),
          `Invalid room "${room}" specified on ${product.id}`
        );
      }

      assert.ok(
        VALID_BADGES.includes(product.badge),
        `Invalid badge "${product.badge}" on ${product.id}`
      );

      assert.ok(
        product.amazonUrl && product.amazonUrl.startsWith('https://www.amazon.com/'),
        `Invalid Amazon URL for ${product.id}`
      );

      assert.ok(
        product.amazonUrl.includes(`tag=${AMAZON_AFFILIATE_TAG}`),
        `Amazon URL missing affiliate tag on ${product.id}`
      );

      assert.ok(
        product.imagePlaceholder && product.imagePlaceholder.length > 0,
        `Missing image placeholder on ${product.id}`
      );
    }
  });

  test('covers all 6 required categories', () => {
    const foundCategories = new Set(LEASE_SAFE_PRODUCTS.map((p) => p.category));
    for (const cat of VALID_CATEGORIES) {
      assert.ok(foundCategories.has(cat as any), `Missing category: ${cat}`);
    }
  });

  test('covers all 7 required room types with multiple recommendations', () => {
    for (const room of VALID_ROOMS) {
      const roomProducts = LEASE_SAFE_PRODUCTS.filter((p) =>
        p.applicableRooms.includes(room as any)
      );
      assert.ok(
        roomProducts.length >= 3,
        `Room "${room}" should have at least 3 products, found ${roomProducts.length}`
      );
    }
  });

  test('covers all 4 lease-safe badges', () => {
    const foundBadges = new Set(LEASE_SAFE_PRODUCTS.map((p) => p.badge));
    for (const badge of VALID_BADGES) {
      assert.ok(foundBadges.has(badge as any), `Missing badge: ${badge}`);
    }
  });
});
