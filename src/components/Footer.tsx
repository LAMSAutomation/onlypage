/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
}

export default function Footer({ onScrollTo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
                <div className="w-4 h-4 bg-white rounded-xs"></div>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">OnlyPage</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              The premier single-page application builder for creators, freelancers, and hyper-local businesses. Design, persist, capture, and convert.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Globe size={14} />
              <span>Served worldwide from high-speed edge containers</span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {['ai-demo', 'editor', 'dashboard', 'whatsapp'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => onScrollTo(id)}
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left capitalize"
                  >
                    {id.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Use Cases</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {['Salon & Spa', 'Dental Clinic', 'Developer Portfolio', 'Creator Brand', 'Consulting Advisory', 'Real Estate'].map((label) => (
                <li key={label}>
                  <button
                    onClick={() => onScrollTo('everyone')}
                    className="hover:text-indigo-600 transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Trust & Security</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-1">
                <span>99.99% Uptime</span>
                <ArrowUpRight size={12} className="text-slate-300" />
              </li>
              <li className="flex items-center gap-1">
                <span>SSL Encryption</span>
                <ArrowUpRight size={12} className="text-slate-300" />
              </li>
              <li className="flex items-center gap-1">
                <span>GDPR Compliant</span>
                <ArrowUpRight size={12} className="text-slate-300" />
              </li>
              <li className="flex items-center gap-1">
                <span>No-Code CMS</span>
                <ArrowUpRight size={12} className="text-slate-300" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {currentYear} OnlyPage Inc. All rights reserved. Registered trademark of OnlyPage Labs.
          </p>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <span>Built with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse-subtle" />
            <span>for small businesses and independent minds.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
