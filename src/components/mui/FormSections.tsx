import React, { useState } from 'react';
import { Send } from 'lucide-react';

export interface MuiLeadFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
  styles?: any;
  block?: any;
}

export const MuiLeadForm: React.FC<MuiLeadFormProps> = ({
  title,
  description,
  buttonText,
  styles = {},
  block
}) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section>
      <div className="mx-auto max-w-3xl px-4 @sm:px-6">
        <div className="rounded-2xl p-8 shadow-xl ring-1 @sm:p-10"
          style={{
            backgroundColor: styles.cardBgColor || '#ffffff',
            borderColor: styles.cardBorderColor || '#f1f5f9',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)'
          }}
        >
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#0f172a' }}>
              {title || 'Get in touch.'}
            </h2>
            <p className="text-sm font-medium leading-relaxed mt-3" style={{ color: styles.subtitleColor || '#475569' }}>
              {description || 'Tell us about your project and our team will get back to you within one business day.'}
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 rounded-xl px-6 py-8 text-center ring-1 ring-inset"
              style={{ backgroundColor: '#ecfdf5', color: '#047857', boxShadow: 'inset 0 0 0 1px #d1fae5' }}
            >
              <div className="text-3xl">🎉</div>
              <h3 className="text-xl font-bold mt-2">Message sent!</h3>
              <p className="text-base @sm:text-lg font-medium leading-relaxed mt-1 opacity-90">We will get back to you within one business day.</p>
            </div>
          ) : (
            <form
              className="mt-8 grid grid-cols-1 gap-4 @sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: styles.subtitleColor || '#64748b' }}>Name</label>
                <input required placeholder="Jane Cooper" className="w-full rounded-lg border-0 px-4 py-3 text-sm ring-1 ring-inset transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: styles.inputBgColor || '#f1f5f9',
                    color: styles.inputTextColor || '#0f172a',
                    boxShadow: styles.inputBorderColor ? `inset 0 0 0 1px ${styles.inputBorderColor}` : 'inset 0 0 0 1px transparent',
                    '--tw-ring-color': styles.accentColor || '#2563eb'
                  } as any}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: styles.subtitleColor || '#64748b' }}>Email</label>
                <input required type="email" placeholder="jane@company.com" className="w-full rounded-lg border-0 px-4 py-3 text-sm ring-1 ring-inset transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: styles.inputBgColor || '#f1f5f9',
                    color: styles.inputTextColor || '#0f172a',
                    boxShadow: styles.inputBorderColor ? `inset 0 0 0 1px ${styles.inputBorderColor}` : 'inset 0 0 0 1px transparent',
                    '--tw-ring-color': styles.accentColor || '#2563eb'
                  } as any}
                />
              </div>
              <div className="@sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: styles.subtitleColor || '#64748b' }}>Message</label>
                <textarea required rows={4} placeholder="Tell us about your project…" className="w-full resize-none rounded-lg border-0 px-4 py-3 text-sm ring-1 ring-inset transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: styles.inputBgColor || '#f1f5f9',
                    color: styles.inputTextColor || '#0f172a',
                    boxShadow: styles.inputBorderColor ? `inset 0 0 0 1px ${styles.inputBorderColor}` : 'inset 0 0 0 1px transparent',
                    '--tw-ring-color': styles.accentColor || '#2563eb'
                  } as any}
                />
              </div>
              <div className="@sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.99] @sm:w-auto"
                  style={{
                    backgroundColor: styles.accentColor || '#2563eb',
                    color: '#ffffff',
                    boxShadow: styles.accentColor ? `0 10px 15px -3px ${styles.accentColor}40` : '0 10px 15px -3px rgba(37,99,235,0.25)'
                  }}
                >
                  <Send size={15} />
                  {buttonText || block?.btnText || 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
