import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, ChevronDown, Copy, Plus, Save, Trash2, UploadCloud, Loader2, Crop, RotateCw, ZoomIn, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function InspectorCollection({
  icon: Icon,
  title,
  count,
  addLabel,
  onAdd,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Icon size={13} /> {title}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {count} item{count === 1 ? "" : "s"} · changes update the canvas
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg bg-lime-100 px-2.5 py-2 text-xs font-semibold text-lime-800 transition hover:bg-lime-200"
        >
          <Plus size={12} /> {addLabel}
        </button>
      </div>
      {count === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
          <p className="text-xs font-medium text-slate-500">
            No items yet
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-2 text-xs font-semibold text-lime-700"
          >
            Add the first one
          </button>
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function InspectorDetails({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <Icon size={13} /> {title}
      </p>
      {children}
    </div>
  );
}

export function InspectorItem({
  index,
  label,
  isSelected = false,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  children,
}: {
  key?: React.Key;
  index: number;
  label: string;
  isSelected?: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(index === 0 || isSelected);

  useEffect(() => {
    if (isSelected) {
      setOpen(true);
    }
  }, [isSelected]);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className={`group overflow-hidden rounded-xl border transition-all ${
        isSelected
          ? "border-lime-500 ring-2 ring-lime-200 bg-white shadow-sm"
          : "border-slate-200 bg-white"
      }`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3">
        <span className={`grid size-5 shrink-0 place-items-center rounded-md text-xs font-semibold ${
          isSelected ? "bg-lime-600 text-white" : "bg-slate-100 text-slate-500"
        }`}>
          {index + 1}
        </span>
        <span className={`min-w-0 flex-1 truncate text-xs font-semibold ${
          isSelected ? "text-lime-950" : "text-slate-700"
        }`}>
          {label || `Item ${index + 1}`}
        </span>
        <ChevronDown
          size={13}
          className="text-slate-600 transition group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-slate-100 p-3">
        {children}
        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label="Move item up"
              title="Move up"
            >
              <ArrowUp size={11} />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label="Move item down"
              title="Move down"
            >
              <ArrowDown size={11} />
            </button>
          )}
          <button
            type="button"
            onClick={onDuplicate}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
          >
            <Copy size={11} /> Duplicate
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </details>
  );
}

export function ImageCropModal({
  imageUrl,
  onSave,
  onClose,
}: {
  imageUrl: string;
  onSave: (newUrl: string) => void;
  onClose: () => void;
}) {
  const [aspect, setAspect] = useState<string>("1:1");
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
  const [targetWidth, setTargetWidth] = useState<number>(1200);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setImageError(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setLoading(false);
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imgRef.current = fallbackImg;
        setLoading(false);
      };
      fallbackImg.onerror = () => {
        setLoading(false);
        setImageError(true);
      };
      fallbackImg.src = imageUrl;
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const drawPreview = React.useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerWidth = 440;
    const containerHeight = 300;
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    ctx.clearRect(0, 0, containerWidth, containerHeight);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    ctx.save();
    ctx.translate(containerWidth / 2 + position.x, containerHeight / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    const scale = (zoom / 100) * Math.min(containerWidth / img.width, containerHeight / img.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    let cropW = 240;
    let cropH = 240;
    if (aspect === "16:9") { cropW = 340; cropH = 191; }
    else if (aspect === "4:3") { cropW = 300; cropH = 225; }
    else if (aspect === "3:4") { cropW = 195; cropH = 260; }
    else if (aspect === "21:9") { cropW = 360; cropH = 154; }
    else if (aspect === "free") { cropW = 320; cropH = 220; }

    const cropX = (containerWidth - cropW) / 2;
    const cropY = (containerHeight - cropH) / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    ctx.fillRect(0, 0, containerWidth, cropY);
    ctx.fillRect(0, cropY + cropH, containerWidth, containerHeight - (cropY + cropH));
    ctx.fillRect(0, cropY, cropX, cropH);
    ctx.fillRect(cropX + cropW, cropY, containerWidth - (cropX + cropW), cropH);

    ctx.strokeStyle = "#84cc16";
    ctx.lineWidth = 2.5;

    if (aspect === "circle") {
      ctx.beginPath();
      ctx.arc(containerWidth / 2, containerHeight / 2, cropW / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeRect(cropX, cropY, cropW, cropH);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cropX + cropW / 3, cropY);
      ctx.lineTo(cropX + cropW / 3, cropY + cropH);
      ctx.moveTo(cropX + (2 * cropW) / 3, cropY);
      ctx.lineTo(cropX + (2 * cropW) / 3, cropY + cropH);
      ctx.moveTo(cropX, cropY + cropH / 3);
      ctx.lineTo(cropX + cropW, cropY + cropH / 3);
      ctx.moveTo(cropX, cropY + (2 * cropH) / 3);
      ctx.lineTo(cropX + cropW, cropY + (2 * cropH) / 3);
      ctx.stroke();
    }
  }, [aspect, rotation, zoom, position]);

  useEffect(() => {
    if (!loading && !imageError) {
      drawPreview();
    }
  }, [loading, imageError, drawPreview]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleSave = async () => {
    const img = imgRef.current;
    if (!img) return;

    setSaving(true);
    try {
      let cropAspectVal = 1;
      if (aspect === "16:9") cropAspectVal = 16 / 9;
      else if (aspect === "4:3") cropAspectVal = 4 / 3;
      else if (aspect === "3:4") cropAspectVal = 3 / 4;
      else if (aspect === "21:9") cropAspectVal = 21 / 9;
      else if (aspect === "free") cropAspectVal = img.width / img.height;

      const outW = targetWidth || 1200;
      const outH = Math.round(outW / cropAspectVal);

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = outW;
      exportCanvas.height = outH;
      const ctx = exportCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);

        ctx.save();
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const containerW = 440;
        const containerH = 300;
        let guideW = 240;
        let guideH = 240;
        if (aspect === "16:9") { guideW = 340; guideH = 191; }
        else if (aspect === "4:3") { guideW = 300; guideH = 225; }
        else if (aspect === "3:4") { guideW = 195; guideH = 260; }
        else if (aspect === "21:9") { guideW = 360; guideH = 154; }
        else if (aspect === "free") { guideW = 320; guideH = 220; }

        const previewScale = (zoom / 100) * Math.min(containerW / img.width, containerH / img.height);
        const scaleFactor = outW / guideW;

        const drawX = position.x * scaleFactor;
        const drawY = position.y * scaleFactor;
        const drawW = img.width * previewScale * scaleFactor;
        const drawH = img.height * previewScale * scaleFactor;

        ctx.drawImage(img, -drawW / 2 + drawX, -drawH / 2 + drawY, drawW, drawH);
        ctx.restore();

        const croppedDataUrl = exportCanvas.toDataURL("image/jpeg", 0.88);

        try {
          const res = await fetch(croppedDataUrl);
          const blob = await res.blob();
          const fileName = `crops/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`;
          const { error } = await supabase.storage.from("site-assets").upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
          if (!error) {
            const { data: publicUrlData } = supabase.storage.from("site-assets").getPublicUrl(fileName);
            if (publicUrlData?.publicUrl) {
              onSave(publicUrlData.publicUrl);
              onClose();
              return;
            }
          }
        } catch (e) {
          console.warn("Storage upload fallback:", e);
        }

        onSave(croppedDataUrl);
        onClose();
      }
    } catch (err) {
      console.error("Crop save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-lime-500/10 p-2 text-lime-400">
              <Crop size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Crop & Resize Image</h3>
              <p className="text-xs text-slate-400">Drag image to adjust framing and select output resolution</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close crop dialog"
            className="editor-interactive grid size-10 place-items-center rounded-[var(--radius-control)] text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 cursor-grab active:cursor-grabbing shadow-inner">
            {loading ? (
              <div className="grid h-[300px] w-[440px] place-items-center text-slate-400">
                <Loader2 size={24} className="animate-spin text-lime-400" />
              </div>
            ) : imageError ? (
              <div className="grid h-[300px] w-[440px] place-items-center text-rose-400 text-xs font-semibold">
                Failed to load image for cropping
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="block select-none"
              />
            )}
            <div className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-slate-300 backdrop-blur">
              ↔ Drag to Reposition
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-300">
              Aspect Ratio
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "1:1", label: "1:1 Square" },
                { id: "16:9", label: "16:9 Landscape" },
                { id: "4:3", label: "4:3 Standard" },
                { id: "3:4", label: "3:4 Portrait" },
                { id: "21:9", label: "21:9 Ultrawide" },
                { id: "circle", label: "Circle" },
                { id: "free", label: "Freeform" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAspect(item.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    aspect === item.id
                      ? "bg-lime-500 text-slate-950 shadow"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <div className="mb-1 flex justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1"><ZoomIn size={12} /> Zoom Scale</span>
                <span className="text-lime-400">{zoom}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />
            </div>

            <div>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-300">
                Export Resolution
              </span>
              <select
                value={targetWidth}
                onChange={(e) => setTargetWidth(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-200 outline-none focus:border-lime-500"
              >
                <option value={1920}>Full HD (1920px width)</option>
                <option value={1200}>Standard Web (1200px width)</option>
                <option value={800}>Medium (800px width)</option>
                <option value={400}>Thumbnail (400px width)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setRotation((prev) => (prev + 90) % 360);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              <RotateCw size={14} />
              <span>Rotate 90°</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || loading || imageError}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lime-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-lime-400 disabled:opacity-50 transition shadow-lg shadow-lime-500/20"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Crop…</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save Cropped Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MiniField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  allowUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  allowUpload?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const shouldShowUpload =
    allowUpload ?? /url|image|photo|avatar|logo|src/i.test(label);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (error) {
        console.warn("Supabase storage bucket upload notice:", error.message);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string);
            setStatusMessage("Uploaded locally");
            setTimeout(() => setStatusMessage(null), 3000);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
        setStatusMessage("Uploaded to Supabase");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage("Upload error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const className =
    "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium leading-5 outline-none transition focus:border-lime-500 focus:ring-3 focus:ring-lime-100";

  return (
    <label className="mt-3 block first:mt-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="block text-xs font-medium text-slate-600">
          {label}
        </span>
        {shouldShowUpload && (
          <div className="flex items-center gap-1.5">
            {statusMessage && (
              <span className="text-xs font-medium text-lime-700">
                {statusMessage}
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {value && (
              <button
                type="button"
                onClick={() => setShowCropModal(true)}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
                title="Crop & Resize Image"
              >
                <Crop size={10} className="text-slate-600" />
                <span>Crop</span>
              </button>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-1 rounded border border-lime-200 bg-lime-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-lime-700 transition hover:border-lime-300 hover:bg-lime-100 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={10} className="animate-spin text-lime-700" />
                  <span>Uploading…</span>
                </>
              ) : (
                <>
                  <UploadCloud size={10} className="text-lime-700" />
                  <span>Upload Image</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${className} min-h-16 resize-y`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}

      {showCropModal && (
        <ImageCropModal
          imageUrl={value}
          onSave={(newUrl) => {
            onChange(newUrl);
            setStatusMessage("Cropped");
            setTimeout(() => setStatusMessage(null), 3000);
          }}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </label>
  );
}

// Describes what the layout variant shows — uses type+variantId compound keys to avoid duplicates
