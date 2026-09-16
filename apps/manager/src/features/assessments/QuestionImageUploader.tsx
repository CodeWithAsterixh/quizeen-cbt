import React, { useRef } from 'react';
import { Button, Trash, Image as ImageIcon, fileToDataUrl } from '@cbt/shared';

interface Props {
  imageUrl?: string;
  imageCaption?: string;
  onChange: (updates: { imageUrl?: string; imageCaption?: string }) => void;
}

export const QuestionImageUploader: React.FC<Props> = ({ imageUrl, imageCaption = '', onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange({ imageUrl: dataUrl });
    } catch {}
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          try {
            const dataUrl = await fileToDataUrl(file);
            onChange({ imageUrl: dataUrl });
          } catch {}
          break;
        }
      }
    }
  };

  return (
    <div onPaste={handlePaste} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Question Diagram or Image (Optional)
        </span>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        {!imageUrl ? (
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} icon={<ImageIcon size={15} />}>
            Attach Image (or Paste Ctrl+V)
          </Button>
        ) : (
          <Button variant="danger" size="sm" onClick={() => onChange({ imageUrl: undefined, imageCaption: undefined })} icon={<Trash size={15} />}>
            Remove Image
          </Button>
        )}
      </div>

      {imageUrl && (
        <div style={{ padding: 10, background: 'var(--color-bg)', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={imageUrl} alt={imageCaption || 'Question Diagram'} style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }} />
          </div>
          <input
            type="text"
            placeholder="Image caption (e.g. Figure 1: Circuit Diagram or Trial Balance)"
            value={imageCaption}
            onChange={(e) => onChange({ imageCaption: e.target.value })}
            style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', border: '1px solid var(--color-border)', borderRadius: 4 }}
          />
        </div>
      )}
    </div>
  );
};
