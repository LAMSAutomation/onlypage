import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export interface UiverseLeadFormProps {
  title?: string;
  description?: string;
  submitText?: string;
  styles?: any;
  block?: any;
}

export const UiverseLeadForm: React.FC<UiverseLeadFormProps> = ({
  title,
  description,
  submitText,
  styles = {},
  block
}) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative overflow-hidden text-white">
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}33` : 'rgba(79, 70, 229, 0.2)' }} />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: styles.buttonBgColor ? `${styles.buttonBgColor}26` : 'rgba(217, 70, 239, 0.15)' }} />

      <div className="relative mx-auto max-w-xl px-4 @sm:px-6">
        <div className="rounded-[1.75rem] border p-8 shadow-2xl backdrop-blur-xl @sm:p-10"
          style={{
            backgroundColor: styles.cardBgColor || 'rgba(255, 255, 255, 0.04)',
            borderColor: styles.cardBorderColor || 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>{title || 'Tell us about your project.'}</h2>
            <p className="text-sm font-medium leading-relaxed mt-3" style={{ color: styles.subtitleColor || '#94a3b8' }}>{description || 'Drop your details — we reply within one business day.'}</p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 size={44} style={{ color: styles.accentColor || '#34d399' }} />
              <p className="text-base @sm:text-lg font-medium leading-relaxed" style={{ color: styles.textColor || '#ffffff' }}>Message sent!</p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: styles.subtitleColor || '#94a3b8' }}>We will get back to you shortly.</p>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid gap-5 @sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: styles.subtitleColor || '#94a3b8' }}>Name</span>
                  <input
                    required
                    placeholder="Your name"
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                    style={{
                      backgroundColor: styles.inputBgColor || 'rgba(255, 255, 255, 0.05)',
                      borderColor: styles.inputBorderColor || 'rgba(255, 255, 255, 0.1)',
                      color: styles.inputTextColor || '#ffffff'
                    }}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: styles.subtitleColor || '#94a3b8' }}>Email</span>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                    style={{
                      backgroundColor: styles.inputBgColor || 'rgba(255, 255, 255, 0.05)',
                      borderColor: styles.inputBorderColor || 'rgba(255, 255, 255, 0.1)',
                      color: styles.inputTextColor || '#ffffff'
                    }}
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: styles.subtitleColor || '#94a3b8' }}>Message</span>
                <textarea
                  required
                  rows={4}
                  placeholder="What are you building?"
                  className="w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: styles.inputBgColor || 'rgba(255, 255, 255, 0.05)',
                    borderColor: styles.inputBorderColor || 'rgba(255, 255, 255, 0.1)',
                    color: styles.inputTextColor || '#ffffff'
                  }}
                />
              </label>
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{
                  background: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #4f46e5)` : 'linear-gradient(to right, #d946ef, #6366f1)',
                  color: '#ffffff'
                }}
              >
                {submitText || block?.btnText || 'Send Message'}
                <Send size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
