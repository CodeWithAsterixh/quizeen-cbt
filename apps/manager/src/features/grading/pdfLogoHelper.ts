export function preparePdfLogo(rawUrl?: string): Promise<string | null> {
  if (!rawUrl) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let w = img.naturalWidth || img.width || 160;
        let h = img.naturalHeight || img.height || 160;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(rawUrl);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch {
        resolve(rawUrl);
      }
    };
    img.onerror = () => resolve(null);
    img.src = rawUrl;
  });
}
