/**
 * Client-Side Room Photo Downscaler
 * Resizes uploaded image to max 1280px (width/height) at JPEG quality 0.86.
 * Enforces max 12 MB file size limit and valid image mime types.
 */

export interface DownscaleResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB
export const MAX_DIMENSION = 1280;
export const JPEG_QUALITY = 0.86;

export async function downscaleRoomPhoto(file: File): Promise<DownscaleResult> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image size exceeds 12 MB. Please select a smaller photo.');
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Please upload a valid JPG, PNG, or WebP photo.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read photo from your device.'));
    reader.onload = () => {
      const srcUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!srcUrl) {
        reject(new Error('Empty photo data.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Could not parse image file.'));
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
          if (targetWidth >= targetHeight) {
            targetHeight = Math.round((targetHeight / targetWidth) * MAX_DIMENSION);
            targetWidth = MAX_DIMENSION;
          } else {
            targetWidth = Math.round((targetWidth / targetHeight) * MAX_DIMENSION);
            targetHeight = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available.'));
          return;
        }

        // Clean high quality resize
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve({
          dataUrl: compressedDataUrl,
          width: targetWidth,
          height: targetHeight,
          sizeBytes: Math.round((compressedDataUrl.length * 3) / 4),
        });
      };
      img.src = srcUrl;
    };
    reader.readAsDataURL(file);
  });
}
