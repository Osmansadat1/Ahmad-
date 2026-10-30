/**
 * Client-Side HTML5 Canvas Side-by-Side Comparison Exporter
 * Stitches Before and After photos into a high-res shareable image
 * with small tags ("BEFORE" / "AFTER 100% LEASE-SAFE")
 * and subtle footer: "Designed with Eden Canvas • woldeden.com".
 */

export interface ComparisonExportOptions {
  beforeUrl: string;
  afterUrl: string;
  roomName?: string;
  styleName?: string;
  filename?: string;
  aspectRatio?: '9:16' | '16:9';
}

export function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;

  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgRatio > targetRatio) {
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / targetRatio;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

export async function exportComparisonImage({
  beforeUrl,
  afterUrl,
  roomName = 'Room',
  styleName = 'Organic Modern',
  filename = 'eden-canvas-makeover.jpg',
  aspectRatio = '9:16',
}: ComparisonExportOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const isVertical = aspectRatio === '9:16';
    const canvas = document.createElement('canvas');
    canvas.width = isVertical ? 1080 : 1920;
    canvas.height = isVertical ? 1920 : 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context not available'));
      return;
    }

    const beforeImg = new Image();
    const afterImg = new Image();
    beforeImg.crossOrigin = 'anonymous';
    afterImg.crossOrigin = 'anonymous';

    let loadedCount = 0;
    const onImageLoaded = () => {
      loadedCount++;
      if (loadedCount < 2) return;

      try {
        // Alabaster background
        ctx.fillStyle = '#FAF8F5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (isVertical) {
          // ==========================================
          // 9:16 VERTICAL STORY STITCH (1080 x 1920)
          // ==========================================
          const headerHeight = 160;
          const footerHeight = 120;
          const availableHeight = canvas.height - headerHeight - footerHeight;
          const sectionHeight = availableHeight / 2;

          // Header
          ctx.fillStyle = '#4A3B32';
          ctx.textAlign = 'center';
          ctx.font = 'bold 44px "Cormorant Garamond", Georgia, serif';
          ctx.fillText('Eden Canvas', canvas.width / 2, 80);

          ctx.fillStyle = '#6E7864';
          ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`${roomName.toUpperCase()} · ${styleName.toUpperCase()}`, canvas.width / 2, 125);

          // Top Image: Before
          drawCoverImage(ctx, beforeImg, 40, headerHeight, canvas.width - 80, sectionHeight - 15);

          // Tag: BEFORE
          ctx.fillStyle = 'rgba(74, 59, 50, 0.9)';
          ctx.beginPath();
          ctx.roundRect(65, headerHeight + 25, 120, 36, 18);
          ctx.fill();
          ctx.fillStyle = '#FAF8F5';
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('BEFORE', 125, headerHeight + 49);

          // Bottom Image: After
          const afterY = headerHeight + sectionHeight + 15;
          drawCoverImage(ctx, afterImg, 40, afterY, canvas.width - 80, sectionHeight - 15);

          // Tag: AFTER 100% LEASE-SAFE
          ctx.fillStyle = 'rgba(110, 120, 100, 0.95)';
          ctx.beginPath();
          ctx.roundRect(65, afterY + 25, 270, 36, 18);
          ctx.fill();
          ctx.fillStyle = '#FAF8F5';
          ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('AFTER 100% LEASE-SAFE', 200, afterY + 49);

          // Footer
          // Compulsory exact copy: "Designed with Eden Canvas • woldeden.com"
          ctx.fillStyle = '#4A3B32';
          ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Designed with Eden Canvas • woldeden.com', canvas.width / 2, canvas.height - 55);
        } else {
          // ==========================================
          // 16:9 HORIZONTAL SPLIT (1920 x 1080)
          // ==========================================
          const halfWidth = canvas.width / 2;
          const height = canvas.height - 80;

          drawCoverImage(ctx, beforeImg, 0, 0, halfWidth - 2, height);
          drawCoverImage(ctx, afterImg, halfWidth + 2, 0, halfWidth - 2, height);

          // Tag: BEFORE
          ctx.fillStyle = 'rgba(74, 59, 50, 0.9)';
          ctx.beginPath();
          ctx.roundRect(40, 40, 140, 42, 21);
          ctx.fill();
          ctx.fillStyle = '#FAF8F5';
          ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('BEFORE', 110, 67);

          // Tag: AFTER 100% LEASE-SAFE
          ctx.fillStyle = 'rgba(110, 120, 100, 0.95)';
          ctx.beginPath();
          ctx.roundRect(halfWidth + 40, 40, 310, 42, 21);
          ctx.fill();
          ctx.fillStyle = '#FAF8F5';
          ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('AFTER 100% LEASE-SAFE', halfWidth + 195, 67);

          // Footer Bar
          ctx.fillStyle = '#FAF8F5';
          ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

          ctx.fillStyle = '#4A3B32';
          ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Designed with Eden Canvas • woldeden.com', canvas.width / 2, canvas.height - 32);
        }

        // Trigger Download
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create canvas blob'));
              return;
            }
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            resolve();
          },
          'image/jpeg',
          0.94
        );
      } catch (err) {
        reject(err);
      }
    };

    beforeImg.onload = onImageLoaded;
    afterImg.onload = onImageLoaded;

    beforeImg.onerror = () => reject(new Error('Failed to load before image'));
    afterImg.onerror = () => reject(new Error('Failed to load after image'));

    beforeImg.src = beforeUrl;
    afterImg.src = afterUrl;
  });
}
