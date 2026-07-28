import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X, CheckCircle2, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  currentUrl?: string;
  businessName: string;
  onUpload: (file: File) => Promise<string | null>;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUpload({ currentUrl, businessName, onUpload, size = 'md' }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizes = { sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-24 h-24' };
  const iconSizes = { sm: 14, md: 18, lg: 24 };
  const initials = businessName.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    try {
      const url = await onUpload(file);
      if (url) {
        setPreview(url);
      }
    } catch {
      // Keep local preview if upload fails
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`${sizes[size]} rounded-full overflow-hidden border-2 border-dashed transition-all cursor-pointer group relative ${
          dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {preview ? (
          <img src={preview} alt={businessName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-sm font-black text-indigo-600">
            {initials}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <Loader2 size={iconSizes[size]} className="animate-spin text-white" />
          ) : (
            <Camera size={iconSizes[size]} className="text-white" />
          )}
        </div>
      </div>

      {/* Upload label */}
      <span className="text-[9px] text-slate-400 font-medium mt-1 block text-center">
        {uploading ? 'Uploading...' : 'Click to change'}
      </span>
    </div>
  );
}

export default AvatarUpload;
