import { LandlordSpecialId, PresetId } from '../data/config';

export interface ReversibilityEvaluation {
  score: number;
  tierLabel: string;
  badgeColor: string;
  explanation: string;
  howToReach100Tip: string;
  removalSteps: {
    item: string;
    category: 'adhesive' | 'tension' | 'freestanding' | 'plugin';
    instructions: string;
  }[];
}

/**
 * Calculates the Reversibility Score (0-100 "Lease Safety Index")
 * 100 = freestanding furniture, tension rods, plug-in/battery lighting only
 * ~85 = adhesive hooks/strips, peel-and-stick wallpaper or cabinet wrap
 * ~50 = anything needing drywall anchors
 * 0 = painting, hardwiring, or demolition (strictly forbidden/never generated)
 */
export function calculateReversibilityScore(
  presets: PresetId[] = [],
  landlordFilters: LandlordSpecialId[] = [],
  customClausesCount: number = 0
): ReversibilityEvaluation {
  const hasAdhesiveWrap =
    presets.includes('90s Honey-Oak Cabinet Wrap') || landlordFilters.includes('dated-cabinets');
  const hasWallpaper = presets.includes('Removable Wallpaper');
  const hasAdhesiveStrips = true; // default safe baseline for lightweight frames
  const hasRug = presets.includes('Hide Carpet with Area Rug') || landlordFilters.includes('beige-carpet');
  const hasTensionOrPluginLighting =
    presets.includes('Zero-Drill Lighting') ||
    landlordFilters.includes('boob-light') ||
    landlordFilters.includes('popcorn-ceiling');
  const hasElectricalPanelCover = landlordFilters.includes('electrical-panel');

  const removalSteps: {
    item: string;
    category: 'adhesive' | 'tension' | 'freestanding' | 'plugin';
    instructions: string;
  }[] = [];

  let score = 100;
  const factors: string[] = [];

  if (hasAdhesiveWrap) {
    score = Math.min(score, 86);
    factors.push('peel-and-stick cabinet vinyl wrap');
    removalSteps.push({
      item: 'Matte Architectural Cabinet Wrap',
      category: 'adhesive',
      instructions:
        'Warm edges with a hair dryer on medium heat for 25–30 seconds to soften the adhesive. Slowly peel backward at a flat 45-degree angle. Wipe surface with isopropyl alcohol to remove any mild residue.',
    });
  }

  if (hasWallpaper) {
    score = Math.min(score, 84);
    factors.push('peel-and-stick removable wallpaper');
    removalSteps.push({
      item: 'Removable Accent Wallpaper',
      category: 'adhesive',
      instructions:
        'Starting at the top ceiling corner, gently lift the edge with your fingernail. Pull downward slowly parallel to the wall surface—never pull outward perpendicular to drywall.',
    });
  }

  if (hasRug) {
    removalSteps.push({
      item: 'Layered Neutral Accent Rug & Grip Pad',
      category: 'freestanding',
      instructions:
        'Roll up the accent rug, lift the non-slip natural rubber grip pad, and vacuum the underlying carpet. 100% zero-residue.',
    });
  }

  if (hasTensionOrPluginLighting) {
    removalSteps.push({
      item: 'Plug-In Swag Lighting / Tension Shades',
      category: 'plugin',
      instructions:
        'Unplug from the standard 120V wall outlet. Detach stretch-release adhesive cord clips by pulling tabs straight down parallel to baseboards.',
    });
  }

  if (hasElectricalPanelCover) {
    removalSteps.push({
      item: 'Leaning Canvas Art / Tension Screen',
      category: 'tension',
      instructions:
        'Simply lift the leaning frame away from the wall. Zero fasteners were attached to the breaker door.',
    });
  }

  // Always include standard picture hanging strips instruction
  removalSteps.push({
    item: 'Damage-Free Interlocking Picture Strips',
    category: 'adhesive',
    instructions:
      'Gently pivot the lower corners of the frame up away from the wall. Hold the remaining wall strip and stretch the release tab straight down at least 15 inches until it detaches smoothly.',
  });

  let tierLabel = 'Zero-Trace Guarantee';
  let badgeColor = 'text-[#6E7864] bg-[#6E7864]/10 border-[#6E7864]/30';
  let explanation = '';
  let howToReach100Tip = '';

  if (score === 100) {
    tierLabel = '100/100 Zero-Trace (Pure Freestanding & Tension)';
    badgeColor = 'text-[#6E7864] bg-[#6E7864]/10 border-[#6E7864]/30';
    explanation =
      'This design relies exclusively on gravity-balanced freestanding furnishings, spring-tension mounts, and 120V plug-in ambient lighting. Zero adhesive films or wall contact points.';
    howToReach100Tip =
      'You are already at the maximum 100/100 Lease Safety score! Everything in this concept packs up with zero trace during move-out.';
  } else if (score >= 80) {
    tierLabel = `${score}/100 High Reversibility (Removable Films & Adhesives)`;
    badgeColor = 'text-[#C69C6D] bg-[#C69C6D]/15 border-[#C69C6D]/40';
    explanation = `Score of ${score}/100 reflects the inclusion of ${factors.join(
      ' and '
    )}. When warmed with a hair dryer and peeled at a 45-degree angle, these leave zero glue residue and protect your original finishes.`;
    howToReach100Tip =
      'How to reach 100: Replace adhesive cabinet wrap or peel-and-stick wallpaper with freestanding acoustic fabric screens or tension-pole modular shelving.';
  } else if (score >= 50) {
    tierLabel = `${score}/100 Moderate Reversibility (Drywall Anchors)`;
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    explanation =
      'Requires minor drywall anchor patching and spackling upon move-out before landlord inspection.';
    howToReach100Tip =
      'How to reach 100: Eliminate drywall anchors by selecting floor-to-ceiling tension poles and heavy-duty interlocking adhesive strips.';
  } else {
    tierLabel = '0/100 Non-Reversible (Demolition / Painting)';
    badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
    explanation =
      'Involves permanent structural alteration or paint. Eden Canvas strictly excludes non-reversible changes from its generation model.';
    howToReach100Tip =
      'Eden Canvas never recommends permanent paint or hardwiring in rental properties.';
  }

  return {
    score,
    tierLabel,
    badgeColor,
    explanation,
    howToReach100Tip,
    removalSteps,
  };
}
