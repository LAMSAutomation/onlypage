/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, MessageSquare, CalendarRange, TrendingUp,
  Inbox, Search, Filter, Mail, Check, Phone, FileSpreadsheet
} from 'lucide-react';

interface DashboardSectionProps {
  businessName: string;
}

export default function DashboardSection({ businessName }: DashboardSectionProps) {
  const [activeTab, setActiveTab] = useState<'visitors' | 'leads' | 'messages' | 'bookings' | 'analytics'>('visitors');
  const [leadFilter, setLeadFilter] = useState<'all' | 'new' | 'contacted'>('all');

  // Static/Dynamic Mock Data
  const stats = [
    { label: 'Uniques Today', value: '412', change: '+12.4%', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'New Leads', value: '18', change: '+32.1%', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Bookings Done', value: '6', change: '+50.0%', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Conv. Rate', value: '4.3%', change: '+1.2%', color: 'text-pink-600 bg-pink-50' },
  ];

  const leadsList = [
    { id: 'l-1', name: 'Nisha Pillai', email: 'nisha@yahoo.com', phone: '+91 99123 45678', status: 'new', date: 'Just now', note: 'Wants hair spa package' },
    { id: 'l-2', name: 'Kabir Mehta', email: 'kmehta@outlook.com', phone: '+91 98224 11335', status: 'contacted', date: '3h ago', note: 'Real estate site valuation' },
    { id: 'l-3', name: 'Sanjana Sen', email: 'sanjana@gmail.com', phone: '+91 91100 84729', status: 'new', date: '5h ago', note: 'Consultation appointment' },
    { id: 'l-4', name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phone: '+91 88574 91928', status: 'contacted', date: '1d ago', note: 'Corporate event package query' },
  ];

  const messagesList = [
    { sender: 'Nisha Pillai', msg: 'Hi! Do you have slots available on Sunday around 2 PM for haircut?', status: 'unread', time: 'Just now' },
    { sender: 'Kabir Mehta', msg: 'Please send across the commercial property brochure to my email.', status: 'read', time: '3h ago' },
    { sender: 'Gautam Das', msg: 'Are there any discounts for senior citizens on dental checkups?', status: 'read', time: '1d ago' },
  ];

  const bookingsList = [
    { client: 'Nisha Pillai', service: 'Signature Haircut', slot: 'Sunday, July 12 • 2:00 PM', state: 'pending' },
    { client: 'Sanjana Sen', service: 'Teeth Alignment Consultation', slot: 'Monday, July 13 • 10:30 AM', state: 'confirmed' },
    { client: 'Rajesh Kumar', service: 'CFO Portfolio Review', slot: 'Wednesday, July 15 • 4:00 PM', state: 'confirmed' },
  ];

  const filteredLeads = leadsList.filter(l => {
    if (leadFilter === 'all') return true;
    return l.status === leadFilter;
  });

  return (
    <section id="dashboard" className="py-24 bg-slate-50 relative border-b border-slate-100 overflow-hidden">
      {/* Background radial pattern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Unified Hub
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Your Entire Business on a Single Screen
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed font-sans">
            Forget jumping between multiple subscriptions. View page traffic, gather client records, read contact forms, accept bookings, and see analytics right here.
          </p>
        </div>

        {/* High-Fidelity App Mockup Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden text-left flex flex-col md:flex-row min-h-[600px]">
          
          {/* Dashboard Left Navigation Rail (Desktop) */}
          <div className="w-full md:w-60 bg-slate-50/50 border-r border-slate-200/80 p-4 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Brand Header */}
              <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">OP</div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">OnlyPage Hub</h4>
                  <p className="text-[9px] font-mono text-slate-400 font-semibold">{businessName || 'yourname'}.onlypage.in</p>
                </div>
              </div>

              {/* Nav buttons */}
              <div className="space-y-1">
                {[
                  { id: 'visitors', label: 'Visitors & Traffic', icon: TrendingUp },
                  { id: 'leads', label: 'CRM Leads', icon: Users, badge: 'New' },
                  { id: 'messages', label: 'Inbox Messages', icon: MessageSquare, count: 2 },
                  { id: 'bookings', label: 'Appointments', icon: CalendarRange },
                  { id: 'analytics', label: 'Funnel Insights', icon: BarChart3 }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        isActive
                          ? 'bg-white text-indigo-600 shadow-3xs border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[8px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                      )}
                      {item.count && (
                        <span className="text-[9px] bg-rose-500 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom info banner */}
            <div className="hidden md:block p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">SYSTEM ONLINE</span>
              <p className="text-[9px] text-slate-500 mt-1">SSL active, 100% database synced.</p>
            </div>
          </div>

          {/* Dashboard Main Panel Workspace (Right) */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Stats Top Summary Panel */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                    <div className="flex items-baseline space-x-1.5 mt-1.5">
                      <span className="text-xl font-extrabold text-slate-900">{s.value}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Workspace based on Active Tab */}
              <div className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  
                  {/* --- TAB: VISITORS (Traffic graphs) --- */}
                  {activeTab === 'visitors' && (
                    <motion.div
                      key="visitors"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Traffic Breakdown (Last 7 Days)</h3>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">Active Session Tracker</span>
                      </div>
                      
                      {/* Interactive visual SVG plot */}
                      <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl h-44 relative flex items-end">
                        <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0,35 Q 15,20 30,28 T 60,10 T 90,15 L 100,5 L 100,40 L 0,40 Z"
                            fill="url(#gradient-area)"
                          />
                          <path
                            d="M 0,35 Q 15,20 30,28 T 60,10 T 90,15 L 100,5"
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        {/* Days of the week indicators */}
                        <div className="w-full flex justify-between px-2 text-[9px] text-slate-400 font-semibold font-mono relative z-10">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- TAB: LEADS (CRM table) --- */}
                  {activeTab === 'leads' && (
                    <motion.div
                      key="leads"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Active Contacts & Leads</h3>
                        
                        {/* Filters list */}
                        <div className="flex space-x-1.5 text-[10px]">
                          {['all', 'new', 'contacted'].map((filt) => (
                            <button
                              key={filt}
                              onClick={() => setLeadFilter(filt as any)}
                              className={`px-2 py-0.5 rounded-md font-semibold capitalize cursor-pointer ${
                                leadFilter === filt
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {filt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Leads List Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-slate-600">
                          <thead>
                            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                              <th className="py-2 text-left">Client Name</th>
                              <th className="py-2 text-left">Contact Info</th>
                              <th className="py-2 text-left">Status</th>
                              <th className="py-2 text-right">Inquired</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLeads.map((lead) => (
                              <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 font-semibold text-slate-800">
                                  {lead.name}
                                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">{lead.note}</p>
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-col text-[10px]">
                                    <span className="font-mono">{lead.email}</span>
                                    <span className="text-slate-400">{lead.phone}</span>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                    lead.status === 'new'
                                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                      : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                  }`}>
                                    {lead.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right text-[10px] text-slate-400">{lead.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* --- TAB: MESSAGES (Form Inbox) --- */}
                  {activeTab === 'messages' && (
                    <motion.div
                      key="messages"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Inbox Form Submissions</h3>
                        <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          All Safe & SSL secured
                        </span>
                      </div>

                      <div className="space-y-3">
                        {messagesList.map((m, idx) => (
                          <div key={idx} className="p-3 bg-slate-50/80 border border-slate-200/40 rounded-xl relative hover:border-slate-300 transition-all">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs text-slate-800">{m.sender}</span>
                              <span className="text-[10px] text-slate-400">{m.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">"{m.msg}"</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* --- TAB: BOOKINGS (Appointments scheduler) --- */}
                  {activeTab === 'bookings' && (
                    <motion.div
                      key="bookings"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Scheduled Appointments</h3>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Calendar Sync Active</span>
                      </div>

                      <div className="space-y-3">
                        {bookingsList.map((b, i) => (
                          <div key={i} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between bg-white hover:shadow-xs transition-shadow">
                            <div>
                              <p className="font-bold text-xs text-slate-800">{b.client}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{b.service}</p>
                              <p className="text-[10px] font-bold text-indigo-600 mt-1 font-mono">{b.slot}</p>
                            </div>
                            <div>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                                b.state === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700 animate-pulse'
                              }`}>
                                {b.state}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* --- TAB: ANALYTICS (Funnel analysis) --- */}
                  {activeTab === 'analytics' && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Conversion Funnel Insights</h3>
                        <span className="text-[10px] text-slate-400">Real-time data synchronization</span>
                      </div>

                      <div className="space-y-3">
                        {[
                          { step: '1. Total Uniques', count: '4,810 views', percent: 100, color: 'bg-indigo-600' },
                          { step: '2. Form Interactors', count: '1,250 users', percent: 25.9, color: 'bg-indigo-500' },
                          { step: '3. Leads Submitted', count: '185 contacts', percent: 3.8, color: 'bg-indigo-400' },
                          { step: '4. Bookings Completed', count: '32 sales', percent: 0.6, color: 'bg-emerald-500' },
                        ].map((funnel, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{funnel.step}</span>
                              <span className="font-mono">{funnel.count} ({funnel.percent}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${funnel.color}`} style={{ width: `${funnel.percent}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

            {/* Bottom mini panel footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <FileSpreadsheet size={12} className="text-emerald-500" />
                Data sync: 1s ago
              </span>
              <button onClick={() => setActiveTab('leads')} className="text-indigo-600 hover:underline">
                Export to CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
