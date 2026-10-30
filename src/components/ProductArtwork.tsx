import React, { useState } from 'react';
import { ProductRecommendation } from '../types/eden';

interface ProductArtworkProps {
  visualType: ProductRecommendation['visualType'];
  swatches: [string, string, string];
}

const PRODUCT_PHOTO_MAP: Record<ProductRecommendation['visualType'], string> = {
  'floor-lamp': '/images/prod-floor-lamp.jpg',
  'table-lamp': '/images/prod-table-lamp.jpg',
  'area-rug': '/images/prod-area-rug.jpg',
  'linen-curtains': '/images/prod-linen-curtains.jpg',
  'throw-pillows': '/images/prod-throw-pillows.jpg',
  'wood-console': '/images/prod-wood-console.jpg',
  'woven-baskets': '/images/prod-woven-baskets.jpg',
  'olive-planter': '/images/prod-olive-planter.jpg',
  'peel-art': '/images/prod-peel-art.jpg',
};

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ visualType, swatches }) => {
  const [imageError, setImageError] = useState(false);
  const photoUrl = PRODUCT_PHOTO_MAP[visualType] || '/images/prod-floor-lamp.jpg';

  return (
    <div className="w-full aspect-4/3 bg-[#E9E1D5] flex items-center justify-center relative overflow-hidden group">
      {!imageError ? (
        <img
          src={photoUrl}
          alt={`${visualType.replace('-', ' ')} decor sample`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-xs text-[#1C2420]/60"
          style={{ backgroundColor: swatches[0] || '#E9E1D5' }}
        >
          Renter-Safe Decor Sample
        </div>
      )}

      {/* Subtle gradient scrim for swatch legibility */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

      {/* Palette swatches in bottom-right corner */}
      <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-10 bg-white/85 backdrop-blur-xs px-2 py-1 rounded-full shadow-2xs">
        {swatches.map((hex, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full border border-black/15"
            style={{ backgroundColor: hex }}
            title={`Material tone ${hex}`}
          />
        ))}
      </div>
    </div>
  );
};
