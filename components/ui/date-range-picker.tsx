import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: boolean;
}

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'This month', days: 0, custom: true },
  { label: 'Last month', days: -1, custom: true },
];

export function DateRangePicker({ value, onChange, presets = true }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const applyPreset = (days: number) => {
    const to = new Date();
    let from: Date;
    if (days === 0) {
      from = new Date(to.getFullYear(), to.getMonth(), 1);
    } else if (days === -1) {
      from = new Date(to.getFullYear(), to.getMonth() - 1, 1);
      to.setDate(0); // Last day of previous month
    } else {
      from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    }
    onChange({ from, to });
    setOpen(false);
  };

  const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-indigo-300 transition-all cursor-pointer"
      >
        <Calendar size={14} className="text-slate-400" />
        <span>{formatDate(value.from)} — {formatDate(value.to)}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-20 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-72">
            {presets && (
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.days)}
                    className="px-3 py-2 rounded-xl text-[10px] font-extrabold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer border border-slate-100"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Custom range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={value.from.toISOString().split('T')[0]}
                  onChange={(e) => onChange({ ...value, from: new Date(e.target.value + 'T00:00:00') })}
                  className="flex-1 text-[10px] font-semibold px-2.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
                <span className="text-slate-300 self-center">—</span>
                <input
                  type="date"
                  value={value.to.toISOString().split('T')[0]}
                  onChange={(e) => onChange({ ...value, to: new Date(e.target.value + 'T23:59:59') })}
                  className="flex-1 text-[10px] font-semibold px-2.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-extrabold cursor-pointer mt-1"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DateRangePicker;
