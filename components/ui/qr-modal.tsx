import React from 'react';
import { QrCode, Download, X, Copy, ExternalLink } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function QRModal({ isOpen, onClose, title, url }: QRModalProps) {
  if (!isOpen) return null;

  // Use zero-cost client QR generator service
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-5 text-center">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-indigo-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">QR Code Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
          <p className="text-[10px] text-slate-400 font-semibold truncate px-2">{url}</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center">
          <img
            src={qrImageUrl}
            alt="QR Code"
            className="w-48 h-48 rounded-xl shadow-xs border border-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              alert('Link copied to clipboard!');
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Copy size={13} />
            <span>Copy Link</span>
          </button>
          <a
            href={qrImageUrl}
            download="qrcode.png"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-100"
          >
            <Download size={13} />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
}
