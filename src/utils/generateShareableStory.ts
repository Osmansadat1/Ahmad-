/**
 * Shareable 9:16 Vertical Before/After Story Generator
 * Renders an ultra-clean 1080x1920 canvas export suitable for Instagram/TikTok stories.
 * Strict label: "Designed with Eden Canvas. Zero damage."
 */

export interface ShareableStoryOptions {
  beforeImageUrl: string;
  afterImageUrl: string;
  roomType: string;
  styleName: string;
}

export async function exportShareableStory(options: ShareableStoryOptions): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Alabaster #FAF8F5
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, 1080, 1920);

  // Helper to load HTMLImageElement
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image for story export'));
      img.src = url;
    });
  };

  try {
    const [beforeImg, afterImg] = await Promise.all([
      loadImage(options.beforeImageUrl),
      loadImage(options.afterImageUrl),
    ]);

    // Top Brand Header (Y: 60 to 220)
    ctx.fillStyle = '#4A3B32';
    ctx.textAlign = 'center';

    ctx.font = 'bold 56px "Cormorant Garamond", serif';
    ctx.fillText('Eden Canvas', 540, 130);

    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6E7864';
    ctx.fillText(
      `${options.roomType.toUpperCase()} · ${options.styleName.toUpperCase()}`,
      540,
      175
    );

    // Decorative thin line
    ctx.strokeStyle = '#E8E2D8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 205);
    ctx.lineTo(740, 205);
    ctx.stroke();

    // Image Block Dimensions
    const imageWidth = 960;
    const imageHeight = 720;
    const imageX = 60;
    const beforeY = 240;
    const afterY = 1010;

    // Helper for cover fit drawing inside rounded rect
    const drawCoverImageWithRoundedClip = (
      img: HTMLImageElement,
      x: number,
      y: number,
      w: number,
      h: number,
      radius: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.clip();

      const imgAspect = img.width / img.height;
      const targetAspect = w / h;
      let drawW = w;
      let drawH = h;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > targetAspect) {
        drawW = h * imgAspect;
        offsetX = (w - drawW) / 2;
      } else {
        drawH = w / imgAspect;
        offsetY = (h - drawH) / 2;
      }

      ctx.drawImage(img, x + offsetX, y + offsetY, drawW, drawH);
      ctx.restore();

      // Subtle border
      ctx.strokeStyle = '#E8E2D8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.stroke();
    };

    // 1. Draw Before Image
    drawCoverImageWithRoundedClip(beforeImg, imageX, beforeY, imageWidth, imageHeight, 24);

    // Pill: "Before"
    ctx.fillStyle = 'rgba(74, 59, 50, 0.85)';
    ctx.beginPath();
    ctx.roundRect(imageX + 24, beforeY + 24, 150, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#FAF8F5';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Before', imageX + 99, beforeY + 56);

    // 2. Draw After Image
    drawCoverImageWithRoundedClip(afterImg, imageX, afterY, imageWidth, imageHeight, 24);

    // Pill: "Eden Makeover · 100% Lease-Safe"
    ctx.fillStyle = 'rgba(110, 120, 100, 0.9)';
    ctx.beginPath();
    ctx.roundRect(imageX + 24, afterY + 24, 340, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#FAF8F5';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Eden Makeover · 100% Lease-Safe', imageX + 194, afterY + 55);

    // Bottom Footer Area (Y: 1750 to 1900)
    // Compulsory exact copy: "Designed with Eden Canvas. Zero damage."
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 1770, 1080, 150);

    ctx.fillStyle = '#4A3B32';
    ctx.textAlign = 'center';
    ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Designed with Eden Canvas. Zero damage.', 540, 1835);

    ctx.fillStyle = '#8C7D73';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('No painting · No drilling · 100% deposit safe', 540, 1875);

    // Trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Eden-Canvas-${options.roomType.replace(/\s+/g, '-')}-Story.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }, 'image/png');
  } catch (err) {
    console.error('Failed to export story image:', err);
  }
}
