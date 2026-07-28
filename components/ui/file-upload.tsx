import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => Promise<string | null>; // Returns URL or null
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  label?: string;
}

export function FileUpload({ onUpload, accept = 'image/*', maxSizeMB = 5, multiple = false, label = 'Upload files' }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number; url?: string; type?: string; status: 'uploading' | 'done' | 'error'; error?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    for (const file of incoming) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setFiles(prev => [...prev, { name: file.name, size: file.size, type: file.type, status: 'error', error: `File too large (max ${maxSizeMB}MB)` }]);
        continue;
      }
      if (accept === 'image/*' && !file.type.startsWith('image/')) {
        setFiles(prev => [...prev, { name: file.name, size: file.size, type: file.type, status: 'error', error: 'Only images are accepted' }]);
        continue;
      }
      setFiles(prev => [...prev, { name: file.name, size: file.size, type: file.type, status: 'uploading' }]);
      try {
        const url = await onUpload(file);
        if (url) {
          setFiles(prev => prev.map(f => f.name === file.name && f.status === 'uploading' ? { ...f, url, status: 'done' } : f));
        } else {
          setFiles(prev => prev.map(f => f.name === file.name && f.status === 'uploading' ? { ...f, status: 'error', error: 'Upload failed' } : f));
        }
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.name === file.name && f.status === 'uploading' ? { ...f, status: 'error', error: err.message || 'Upload error' } : f));
      }
    }
  }, [onUpload, maxSizeMB, accept]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragOver ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
            <UploadCloud size={24} />
          </div>
          <p className="text-sm font-bold text-slate-700">{dragOver ? 'Drop files here' : label}</p>
          <p className="text-[10px] text-slate-400 font-medium">or click to browse · Max {maxSizeMB}MB per file</p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              {file.url ? (
                <img src={file.url} alt={file.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
              ) : (
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  file.status === 'error' ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'
                }`}>
                  {accept === 'image/*' ? <ImageIcon size={16} /> : <FileText size={16} />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
              </div>
              {file.status === 'uploading' && (
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              )}
              {file.status === 'done' && <CheckCircle2 size={16} className="text-emerald-500" />}
              {file.status === 'error' && (
                <div className="flex items-center gap-1">
                  <AlertCircle size={14} className="text-rose-500" />
                  <span className="text-[9px] text-rose-600 font-medium hidden sm:inline">{file.error}</span>
                </div>
              )}
              <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 cursor-pointer">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
