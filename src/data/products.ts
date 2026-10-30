export interface LeaseSafeProduct {
  id: string;
  title: string;
  description: string;
  category: 'partition' | 'flooring' | 'kitchen' | 'lighting' | 'bathroom' | 'decor';
  applicableRooms: (
    | 'Living Room'
    | 'Studio Apartment'
    | 'Bedroom'
    | 'Rental Bathroom'
    | 'Outdated Kitchen'
    | 'Dining Room'
    | 'Small Home Office'
  )[];
  amazonUrl: string;
  imagePlaceholder: string;
  badge: 'Zero-Drill' | 'Peel & Stick' | 'Damage-Free' | 'Removable';
  priceEstimate?: string;
  highlightBenefit?: string;
}

export const AMAZON_AFFILIATE_TAG = 'Sayedosmanema-20';

export function buildAmazonAffiliateUrl(searchQuery: string): string {
  const encoded = encodeURIComponent(searchQuery);
  return `https://www.amazon.com/s?k=${encoded}&tag=${AMAZON_AFFILIATE_TAG}`;
}

export function getProductPriceNumber(product: LeaseSafeProduct): number {
  if (!product.priceEstimate) return 25;
  const num = parseFloat(product.priceEstimate.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 25 : num;
}

/**
 * Algorithmic Basket Packing:
 * Curates a combination of damage-free hardware products matching the active room
 * so that Sum(Selected Products Price) <= User Entered Budget.
 * Prioritizes high-impact essentials first (e.g., peel-and-stick wrap, tension rod, adhesive sconces).
 */
export function packProductsForBudget(
  products: LeaseSafeProduct[],
  budget: number
): {
  packedProducts: LeaseSafeProduct[];
  totalSpent: number;
  remainingBudget: number;
} {
  const sorted = [...products].sort((a, b) => {
    const isEssentialA = a.badge === 'Zero-Drill' || a.badge === 'Peel & Stick' ? 1 : 0;
    const isEssentialB = b.badge === 'Zero-Drill' || b.badge === 'Peel & Stick' ? 1 : 0;
    if (isEssentialA !== isEssentialB) return isEssentialB - isEssentialA;
    return getProductPriceNumber(a) - getProductPriceNumber(b);
  });

  const packed: LeaseSafeProduct[] = [];
  let currentTotal = 0;

  for (const item of sorted) {
    const price = getProductPriceNumber(item);
    if (currentTotal + price <= budget) {
      packed.push(item);
      currentTotal += price;
    }
  }

  // If budget is very tight and nothing fit, include the single lowest-cost essential item
  if (packed.length === 0 && sorted.length > 0) {
    const cheapest = [...sorted].sort(
      (a, b) => getProductPriceNumber(a) - getProductPriceNumber(b)
    )[0];
    packed.push(cheapest);
    currentTotal = getProductPriceNumber(cheapest);
  }

  return {
    packedProducts: packed,
    totalSpent: Math.round(currentTotal * 100) / 100,
    remainingBudget: Math.max(0, Math.round((budget - currentTotal) * 100) / 100),
  };
}

export const LEASE_SAFE_PRODUCTS: LeaseSafeProduct[] = [
  // 1. PARTITIONS & ZONING
  {
    id: 'prod-tension-divider-rod',
    title: 'Heavy-Duty Room Divider Tension Rod (8ft–12ft)',
    description:
      'Industrial spring tension bar with non-marring silicone end pads. Holds heavy linen divider drapes to zone studios and open layouts without drilling a single ceiling anchor.',
    category: 'partition',
    applicableRooms: ['Studio Apartment', 'Living Room', 'Small Home Office', 'Bedroom'],
    amazonUrl: buildAmazonAffiliateUrl('heavy duty room divider tension rod no drill 12ft'),
    imagePlaceholder: '/images/prod-linen-curtains.jpg',
    badge: 'Zero-Drill',
    priceEstimate: '$26.99',
    highlightBenefit: 'Holds 35 lbs with zero screw holes or ceiling marks',
  },
  {
    id: 'prod-woven-rattan-screen',
    title: 'Freestanding 4-Panel Folding Rattan Screen',
    description:
      'Natural woven wicker privacy screen that establishes dedicated entryways, home offices, or bedroom sleeping zones without altering drywall or layout.',
    category: 'partition',
    applicableRooms: ['Studio Apartment', 'Living Room', 'Bedroom', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('freestanding 4 panel folding rattan room divider'),
    imagePlaceholder: '/images/prod-woven-baskets.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$89.00',
    highlightBenefit: '100% freestanding with zero wall contact',
  },
  {
    id: 'prod-tension-post-partition',
    title: 'Vertical Floor-to-Ceiling Tension Shelf & Slat Pillar',
    description:
      'Dual-spring architectural tension post system creating custom Japanese slat walls or floating display ledges between rooms with zero permanent fasteners.',
    category: 'partition',
    applicableRooms: ['Studio Apartment', 'Living Room', 'Dining Room', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('floor to ceiling tension post room divider slat wall'),
    imagePlaceholder: '/images/prod-wood-console.jpg',
    badge: 'Zero-Drill',
    priceEstimate: '$64.50',
    highlightBenefit: 'Adjustable tension fit from 7ft to 9.5ft ceilings',
  },

  // 2. FLOORING & ACOUSTICS
  {
    id: 'prod-washable-flatweave-rug',
    title: 'Low-Pile Neutral Washable Flatweave Area Rug (8x10)',
    description:
      'Stain-resistant low-profile rug in muted oat and mineral tones. Conceals worn rental carpets and buffers floor echo without trapping move-out dust or odors.',
    category: 'flooring',
    applicableRooms: ['Living Room', 'Bedroom', 'Dining Room', 'Studio Apartment', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('washable low pile neutral area rug 8x10 stain resistant'),
    imagePlaceholder: '/images/prod-area-rug.jpg',
    badge: 'Removable',
    priceEstimate: '$84.99',
    highlightBenefit: 'Fits in home washing machine; protects tenant deposit',
  },
  {
    id: 'prod-galley-kitchen-runner',
    title: 'Cushioned Non-Slip Renter Floor Runner (2.5x8ft)',
    description:
      'Spill-proof, anti-fatigue textured runner that covers outdated yellowed linoleum while providing high-traffic cushioning in galley kitchens and hallways.',
    category: 'flooring',
    applicableRooms: ['Outdated Kitchen', 'Rental Bathroom', 'Studio Apartment'],
    amazonUrl: buildAmazonAffiliateUrl('non slip washable kitchen runner rug spill proof 8ft'),
    imagePlaceholder: '/images/prod-area-rug.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$32.50',
    highlightBenefit: 'Waterproof TPR backing prevents floor staining',
  },
  {
    id: 'prod-floating-vinyl-planks',
    title: 'Click-Lock Floating Vinyl Plank Flooring Sample Kit',
    description:
      'Zero-glue interlocking floor planks that lay directly over tile or laminate without adhesive residue, creating a luxury light-oak Scandinavian foundation.',
    category: 'flooring',
    applicableRooms: ['Rental Bathroom', 'Outdated Kitchen', 'Studio Apartment', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('click lock floating vinyl plank flooring temporary rental'),
    imagePlaceholder: '/images/prod-wood-console.jpg',
    badge: 'Removable',
    priceEstimate: '$45.00',
    highlightBenefit: 'Zero adhesive glue; lifts cleanly on lease termination',
  },

  // 3. KITCHEN TRANSFORMATIONS
  {
    id: 'prod-marble-counter-wrap',
    title: 'Matte Calacatta Marble Peel-and-Stick Countertop Vinyl Film',
    description:
      'Architectural-grade vinyl overlay engineered with micro air-release channels. Transforms scratched honey-oak laminate into seamless Calacatta stone with zero sticky residue.',
    category: 'kitchen',
    applicableRooms: ['Outdated Kitchen', 'Rental Bathroom', 'Studio Apartment'],
    amazonUrl: buildAmazonAffiliateUrl('matte marble peel and stick countertop wrap removable thick'),
    imagePlaceholder: '/images/prod-peel-art.jpg',
    badge: 'Peel & Stick',
    priceEstimate: '$18.99',
    highlightBenefit: 'Heat-resistant, waterproof & residue-free removal',
  },
  {
    id: 'prod-subway-tile-backsplash',
    title: '3D Glossy White Subway Tile Peel-and-Stick Backsplash Sheets (10-Pack)',
    description:
      'Realistic gel-tile sheets that apply straight over builder-grade kitchen drywall or outdated tiles. Easily peeled off with a hair dryer at move-out.',
    category: 'kitchen',
    applicableRooms: ['Outdated Kitchen', 'Rental Bathroom', 'Studio Apartment'],
    amazonUrl: buildAmazonAffiliateUrl('peel and stick subway tile backsplash removable 10 pack'),
    imagePlaceholder: '/images/prod-peel-art.jpg',
    badge: 'Peel & Stick',
    priceEstimate: '$34.99',
    highlightBenefit: 'Wipe-clean surface; removes cleanly with gentle heat',
  },
  {
    id: 'prod-under-cabinet-pucks',
    title: 'Magnetic Rechargeable Under-Cabinet LED Puck Lights (3-Pack)',
    description:
      'Warm 2700K ambient task lights with wireless magnetic adhesive plates. Eliminates harsh overhead fluorescent bulbs in rental kitchens without electrical work.',
    category: 'kitchen',
    applicableRooms: ['Outdated Kitchen', 'Studio Apartment', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('rechargeable magnetic under cabinet puck lights warm 2700k'),
    imagePlaceholder: '/images/prod-table-lamp.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$24.99',
    highlightBenefit: 'USB-C rechargeable with 60-day battery life',
  },
  {
    id: 'prod-tension-kitchen-rack',
    title: 'Counter-to-Cabinet Tension Spice & Utensil Rail',
    description:
      'Sleek matte black tension organizer extending between kitchen counter and upper cabinets to hang cooking spoons, mugs, and spices without screws.',
    category: 'kitchen',
    applicableRooms: ['Outdated Kitchen', 'Studio Apartment'],
    amazonUrl: buildAmazonAffiliateUrl('counter to cabinet tension organizer kitchen rail no drill'),
    imagePlaceholder: '/images/prod-wood-console.jpg',
    badge: 'Zero-Drill',
    priceEstimate: '$28.00',
    highlightBenefit: 'Frees up precious rental counter prep space',
  },

  // 4. LIGHTING & AMBIENCE
  {
    id: 'prod-rechargeable-brass-sconces',
    title: 'Rechargeable Wireless Brass Wall Sconce Duo with Magnetic Base',
    description:
      'Quiet luxury brushed brass sconces featuring 360° magnetic rotation, touch dimming, and warm 2700K illumination. Installs with damage-free 3M Command strips.',
    category: 'lighting',
    applicableRooms: ['Living Room', 'Bedroom', 'Dining Room', 'Studio Apartment', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('rechargeable wireless wall sconce battery operated brass magnetic'),
    imagePlaceholder: '/images/prod-floor-lamp.jpg',
    badge: 'Zero-Drill',
    priceEstimate: '$46.99',
    highlightBenefit: 'Zero wiring or electrician; 100% damage-free wall strips',
  },
  {
    id: 'prod-plug-in-arc-lamp',
    title: 'Freestanding Plug-In Brass & Walnut Arc Floor Lamp',
    description:
      'Heavy-base freestanding arc lamp with woven natural linen drum shade. Positions warm overhead glow directly above sofas or dining tables without ceiling hooks.',
    category: 'lighting',
    applicableRooms: ['Living Room', 'Dining Room', 'Studio Apartment', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('freestanding brass arc floor lamp plug in linen drum shade'),
    imagePlaceholder: '/images/prod-floor-lamp.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$115.00',
    highlightBenefit: 'Base tucks under sofa; zero wall or ceiling hardware',
  },
  {
    id: 'prod-ceramic-bedside-lamp',
    title: 'Warm Ribbed Ceramic Plug-In Accent Lamp with Fabric Cord',
    description:
      'Organic modern bedside and desk lighting. Features an earthy terracotta-wash base and textured shade that diffuses relaxing ambient light.',
    category: 'lighting',
    applicableRooms: ['Bedroom', 'Living Room', 'Small Home Office', 'Studio Apartment'],
    amazonUrl: buildAmazonAffiliateUrl('ribbed ceramic plug in table lamp warm linen shade 2700k'),
    imagePlaceholder: '/images/prod-table-lamp.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$38.50',
    highlightBenefit: 'Standard 2-prong plug; replaces harsh rental ceiling light',
  },
  {
    id: 'prod-plug-in-swag-pendant',
    title: 'Plug-In Japanese Paper Swag Pendant with Brass Anchor Peg',
    description:
      '15ft braided hemp cord with inline dimmer and Akari-inspired paper lantern. Hangs gracefully from a single pinhole anchor to elevate dining areas.',
    category: 'lighting',
    applicableRooms: ['Dining Room', 'Living Room', 'Studio Apartment', 'Bedroom'],
    amazonUrl: buildAmazonAffiliateUrl('plug in paper lantern pendant light with cord and dimmer switch'),
    imagePlaceholder: '/images/prod-floor-lamp.jpg',
    badge: 'Removable',
    priceEstimate: '$36.00',
    highlightBenefit: 'Plugs into wall; single pinhole easily patched with dab of spackle',
  },

  // 5. BATHROOM UPGRADES
  {
    id: 'prod-curved-tension-shower-rod',
    title: 'No-Drill Curved Tension Shower Curtain Rod (Matte Black)',
    description:
      'Expands rental shower space by 33% without drilling tiles. Spring-loaded dual tension system holds tight on glossy ceramic walls without slippage.',
    category: 'bathroom',
    applicableRooms: ['Rental Bathroom'],
    amazonUrl: buildAmazonAffiliateUrl('curved shower curtain rod tension no drill rustproof'),
    imagePlaceholder: '/images/prod-linen-curtains.jpg',
    badge: 'Zero-Drill',
    priceEstimate: '$33.99',
    highlightBenefit: 'Adds 9 inches of elbow room with zero tile drilling',
  },
  {
    id: 'prod-filtered-rainfall-showerhead',
    title: 'High-Pressure Filtered Rainfall Showerhead & Handheld Combo',
    description:
      'Quick-twist brass showerhead that replaces crusty landlord fixtures in 3 minutes without tools. Removes hard water chlorine and boosts pressure.',
    category: 'bathroom',
    applicableRooms: ['Rental Bathroom'],
    amazonUrl: buildAmazonAffiliateUrl('filtered shower head with handheld high pressure 15 stage filter'),
    imagePlaceholder: '/images/prod-table-lamp.jpg',
    badge: 'Removable',
    priceEstimate: '$39.99',
    highlightBenefit: 'Original showerhead swaps back effortlessly on move-out',
  },
  {
    id: 'prod-adhesive-shower-caddy',
    title: 'Rustproof Matte Black Adhesive Shower Caddy Organizers (Set of 2)',
    description:
      'Transparent nano-adhesive strips that support up to 40 lbs of shampoo bottles on shower tile. Releases cleanly with hairdryer warmth leaving no residue.',
    category: 'bathroom',
    applicableRooms: ['Rental Bathroom'],
    amazonUrl: buildAmazonAffiliateUrl('adhesive shower caddy rustproof matte black 2 pack no drilling'),
    imagePlaceholder: '/images/prod-woven-baskets.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$21.99',
    highlightBenefit: 'Strong nano-adhesive strips remove cleanly with heat',
  },
  {
    id: 'prod-waterproof-bath-floor-tiles',
    title: 'Waterproof Moroccan Slate Peel-and-Stick Floor Tile Decals (20-Pack)',
    description:
      'Heavy-duty non-slip waterproof floor decals that cover chipped or discolored bathroom tiles in under an hour without grouting or demolition.',
    category: 'bathroom',
    applicableRooms: ['Rental Bathroom', 'Outdated Kitchen'],
    amazonUrl: buildAmazonAffiliateUrl('waterproof peel and stick floor tiles bathroom non slip removable'),
    imagePlaceholder: '/images/prod-peel-art.jpg',
    badge: 'Peel & Stick',
    priceEstimate: '$29.99',
    highlightBenefit: '100% moisture-proof and peelable upon lease termination',
  },

  // 6. DECOR & FINISHES
  {
    id: 'prod-oatmeal-tension-drapes',
    title: 'Zero-Drill Oatmeal Slub Linen Window Curtain Panels (Pair)',
    description:
      'Natural textured linen panels that mount inside window frames using spring rods. Softens bare rental blinds and filters harsh southern exposure.',
    category: 'decor',
    applicableRooms: ['Living Room', 'Bedroom', 'Studio Apartment', 'Dining Room', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('oatmeal linen curtains tension rod window panels 84 inch'),
    imagePlaceholder: '/images/prod-linen-curtains.jpg',
    badge: 'Zero-Drill',
    priceEstimate: '$54.00',
    highlightBenefit: 'Mounts on window casing; protects blinds and trim',
  },
  {
    id: 'prod-leaning-floor-mirror',
    title: 'Arched Solid Wood Full-Length Leaning Floor Mirror (65" × 22")',
    description:
      'Statement mirror that rests stably against the wall with non-skid rubber feet. Bounces natural light throughout compact apartments with zero wall brackets.',
    category: 'decor',
    applicableRooms: ['Living Room', 'Bedroom', 'Studio Apartment', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('arched full length mirror floor standing leaning solid wood 65 inch'),
    imagePlaceholder: '/images/prod-wood-console.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$119.00',
    highlightBenefit: 'Zero wall anchor holes; instantly doubles perceived room depth',
  },
  {
    id: 'prod-olive-floor-tree',
    title: 'Faux Silk Olive Tree in Fluted Ceramic Pot (5ft)',
    description:
      'Realistic natural wood trunk with lifelike silver-green leaves. Fills empty rental corners with organic warmth without soil moisture or insect risk.',
    category: 'decor',
    applicableRooms: ['Living Room', 'Dining Room', 'Studio Apartment', 'Small Home Office'],
    amazonUrl: buildAmazonAffiliateUrl('artificial olive tree 5ft with ceramic fluted pot natural trunk'),
    imagePlaceholder: '/images/prod-olive-planter.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$89.00',
    highlightBenefit: '100% freestanding with zero wall or ceiling hooks',
  },
  {
    id: 'prod-command-frame-art-set',
    title: 'Minimalist Botanical Wood Art Print Set with Damage-Free Hanging Strips',
    description:
      'Lightweight gallery set featuring archival linen paper and shatterproof plexiglass, bundled with heavy-duty interlocking click strips that leave zero paint tears.',
    category: 'decor',
    applicableRooms: ['Living Room', 'Bedroom', 'Dining Room', 'Small Home Office', 'Studio Apartment'],
    amazonUrl: buildAmazonAffiliateUrl('lightweight framed wall art set of 3 with command picture hanging strips'),
    imagePlaceholder: '/images/prod-peel-art.jpg',
    badge: 'Damage-Free',
    priceEstimate: '$42.00',
    highlightBenefit: 'Zero nails, hooks, or holes; pull-tab release leaves paint intact',
  },
];
