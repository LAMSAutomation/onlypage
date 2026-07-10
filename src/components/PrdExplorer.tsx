/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldCheck, Database, Layers, ArrowRight, Sparkles, 
  Settings, Users, Globe, FileText, CheckCircle2, Cpu, 
  Smartphone, Zap, Server, Code2, Play, Search, HelpCircle, 
  Workflow, Check, MessageSquareCode, Key, Coins, BarChart3, HelpCircle as HelpIcon,
  ChevronRight
} from 'lucide-react';

type TabType = 'blueprint' | 'architecture' | 'schema' | 'comparison';

export default function PrdExplorer() {
  const [activeTab, setActiveTab] = useState<TabType>('blueprint');
  const [selectedTable, setSelectedTable] = useState<string>('websites');
  const [searchQuery, setSearchQuery] = useState('');
  
  // WHEN/DO preview state
  const [automationWhen, setAutomationWhen] = useState('Form submitted');
  const [automationDo, setAutomationDo] = useState('Send WhatsApp message');

  // ER Database Schema Data from PRD section 23
  const schemaTables = [
    {
      name: 'users',
      desc: 'Stores core account owners, billing status, and profile information.',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'email', type: 'varchar(255)', desc: 'User email (Unique)' },
        { name: 'full_name', type: 'varchar(100)', desc: 'Full display name' },
        { name: 'role', type: 'enum', desc: 'Owner, Admin, Editor, Viewer' },
        { name: 'created_at', type: 'timestamp', desc: 'Creation date' }
      ],
      relations: ['Has many Workspaces', 'Has one Subscription']
    },
    {
      name: 'workspaces',
      desc: 'Represents multi-user workspaces or organizations containing multiple websites.',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'name', type: 'varchar(100)', desc: 'Workspace workspace title' },
        { name: 'owner_id', type: 'uuid', desc: 'Foreign key -> users.id' },
        { name: 'created_at', type: 'timestamp', desc: 'Record timestamp' }
      ],
      relations: ['Belongs to User', 'Has many Websites', 'Has many Members']
    },
    {
      name: 'websites',
      desc: 'Root metadata for specific web platforms, mapped to custom subdomains.',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'workspace_id', type: 'uuid', desc: 'Foreign key -> workspaces.id' },
        { name: 'subdomain', type: 'varchar(63)', desc: 'e.g. "studio46" for studio46.onlypage.in (Unique)' },
        { name: 'custom_domain', type: 'varchar(253)', desc: 'Optional custom premium domain e.g. "studio46.com"' },
        { name: 'seo_title', type: 'varchar(120)', desc: 'Root site SEO meta title' },
        { name: 'seo_desc', type: 'text', desc: 'Root site SEO meta description' },
        { name: 'is_published', type: 'boolean', desc: 'Live visibility flag' }
      ],
      relations: ['Belongs to Workspace', 'Has many Pages', 'Has many Contacts', 'Has many CMS Collections']
    },
    {
      name: 'pages',
      desc: 'The hierarchical structural layouts within a specific website.',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'website_id', type: 'uuid', desc: 'Foreign key -> websites.id' },
        { name: 'slug', type: 'varchar(100)', desc: 'URL path slug (e.g. "about", "portfolio")' },
        { name: 'title', type: 'varchar(100)', desc: 'Page navigation title' },
        { name: 'order', type: 'integer', desc: 'Sequence weight for routing' }
      ],
      relations: ['Belongs to Website', 'Has many Blocks']
    },
    {
      name: 'blocks',
      desc: 'Block-based layout fragments (Hero, Services, CTA) forming the pages.',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'page_id', type: 'uuid', desc: 'Foreign key -> pages.id' },
        { name: 'type', type: 'varchar(50)', desc: 'Hero, Service, Forms, Gallery, Testimonial' },
        { name: 'layout_config', type: 'jsonb', desc: 'Styling parameters, alignments & colors' },
        { name: 'content_data', type: 'jsonb', desc: 'CMS bindings, custom texts, images' },
        { name: 'order', type: 'integer', desc: 'Render sequencing order' }
      ],
      relations: ['Belongs to Page']
    },
    {
      name: 'cms_collections',
      desc: 'Dynamic databases created by users (e.g. Products, Properties, Blogs).',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'website_id', type: 'uuid', desc: 'Foreign key -> websites.id' },
        { name: 'name', type: 'varchar(100)', desc: 'e.g. "Properties" or "Services" (Unique per site)' },
        { name: 'fields_schema', type: 'jsonb', desc: 'Specifies column definitions (Name, Price, Location, Image)' }
      ],
      relations: ['Belongs to Website', 'Has many CMS Items']
    },
    {
      name: 'cms_items',
      desc: 'Specific records inside collections (e.g. Velvet Salon service: "Signature Haircut").',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'collection_id', type: 'uuid', desc: 'Foreign key -> cms_collections.id' },
        { name: 'attributes', type: 'jsonb', desc: 'Dynamic column data values map' },
        { name: 'created_at', type: 'timestamp', desc: 'Record timestamp' }
      ],
      relations: ['Belongs to CMS Collection']
    },
    {
      name: 'contacts',
      desc: 'Unified CRM leads generated via website forms or interactive WhatsApp chats.',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'website_id', type: 'uuid', desc: 'Foreign key -> websites.id' },
        { name: 'name', type: 'varchar(100)', desc: 'Lead full name' },
        { name: 'phone', type: 'varchar(20)', desc: 'Lead contact number' },
        { name: 'email', type: 'varchar(255)', desc: 'Lead email address' },
        { name: 'status', type: 'enum', desc: 'New, Contacted, Interested, Customer, Lost' },
        { name: 'notes', type: 'text', desc: 'Staff observation logs' }
      ],
      relations: ['Belongs to Website', 'Has many Messages', 'Has many Bookings']
    },
    {
      name: 'bookings',
      desc: 'Scheduled consultations, haircut slots, or dentist slots.',
      fields: [
        { name: 'id', type: 'uuid', desc: 'Primary key' },
        { name: 'website_id', type: 'uuid', desc: 'Foreign key -> websites.id' },
        { name: 'contact_id', type: 'uuid', desc: 'Foreign key -> contacts.id' },
        { name: 'service_name', type: 'varchar(255)', desc: 'Service e.g. "Root Canal Therapy"' },
        { name: 'slot_time', type: 'timestamp', desc: 'Date and exact time slot booked' },
        { name: 'status', type: 'varchar(50)', desc: 'Pending, Confirmed, Completed, Cancelled' }
      ],
      relations: ['Belongs to Website', 'Belongs to Contact']
    }
  ];

  const filteredTables = schemaTables.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTableData = schemaTables.find(t => t.name === selectedTable) || schemaTables[0];

  return (
    <section id="spec-explorer" className="py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-950">
      {/* Premium ambient decorative elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative ultra-fine code terminal grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-400">
            <Terminal size={12} />
            <span>Interactive PRD & System Architecture</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent leading-tight font-sans">
            OnlyPage Technical Specs
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto">
            Explore our architectural blueprint, dynamic database relational tables, and how OnlyPage consolidates 8 distinct platforms into a unified system.
          </p>
        </div>

        {/* Outer Spec Glass Canvas Container */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Glass Header Navigation Tabs */}
          <div className="flex flex-wrap border-b border-slate-800/80 bg-slate-900/40 p-2 gap-1">
            {[
              { id: 'blueprint', label: '1. Vision & Core concept', icon: FileText },
              { id: 'architecture', label: '2. Dynamic Systems Flow', icon: Workflow },
              { id: 'schema', label: '3. DB Relational Schema', icon: Database },
              { id: 'comparison', label: '4. Wix vs OnlyPage', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Canvas */}
          <div className="p-6 md:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: PRODUCT VISION & SPEC BLUEPRINT */}
              {activeTab === 'blueprint' && (
                <motion.div
                  key="blueprint"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Vision core card */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Section 1. Vision Statement</span>
                        <h3 className="text-2xl font-bold text-white font-sans">
                          "OnlyPage is not a website builder. It is the easiest way for anyone to manage their online presence."
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          By uniting CMS database entries, responsive landing pages, Google forms capability, simple lead pipelines, calendar booking, traffic analytics, and an Evolution API-backed WhatsApp automated auto-responder under a unified schema, we save operators from gluing 8 tools with Zapier.
                        </p>
                      </div>

                      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                        <span className="text-[10px] text-emerald-400 font-bold tracking-widest block">⚡️ REPLACES 8 DISJOINTED PLATFORMS</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                          {[
                            { name: 'Wix / Webflow', for: 'Website Builders' },
                            { name: 'WordPress / Strapi', for: 'CMS Databases' },
                            { name: 'Google Forms', for: 'Leads Capture' },
                            { name: 'HubSpot / Notion', for: 'Basic CRMs' },
                            { name: 'Calendly / Acuity', for: 'Bookings Done' },
                            { name: 'Google Analytics', for: 'Traffic Tracker' },
                            { name: 'ManyChat / Bot', for: 'WhatsApp Auto' },
                            { name: 'Linktree / Bio.fm', for: 'Mini-Portfolios' }
                          ].map((rep, i) => (
                            <div key={i} className="p-2.5 bg-slate-950/50 border border-slate-800/50 rounded-xl space-y-1">
                              <p className="text-xs font-bold text-slate-100">{rep.name}</p>
                              <p className="text-[10px] text-slate-500 font-semibold">{rep.for}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Core flow card */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="p-6 bg-indigo-950/30 border border-indigo-900/50 rounded-2xl relative overflow-hidden space-y-4">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                          <Cpu size={14} />
                          Section 3. Live 6-Step Core Flow
                        </h4>
                        
                        <div className="space-y-3">
                          {[
                            { step: '01', title: 'Create Unified Profile', desc: 'Secure custom subdomains e.g. "clinic.onlypage.in"' },
                            { step: '02', title: 'Purpose Segmentation', desc: 'Choose Doctor, Creator, Real Estate, Salon or Portfolio presets' },
                            { step: '03', title: 'System Initialization', desc: 'Input basic services schema, logo details & visual theme mapping' },
                            { step: '04', title: 'Dynamic Generation', desc: 'Platform auto-compiles CRM, Forms, SEO schema & WhatsApp vectors' },
                            { step: '05', title: 'Live Blocks Sandbox', desc: 'Configure blocks,CMS collections, FAQs, and pricing sliders' },
                            { step: '06', title: 'Propagated Publishing', desc: 'SSL provisioned instantly. Live on subdomain' }
                          ].map((f, i) => (
                            <div key={i} className="flex gap-3 text-left">
                              <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-950/60 px-2 py-0.5 rounded h-max">{f.step}</span>
                              <div>
                                <h5 className="text-xs font-bold text-slate-200">{f.title}</h5>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{f.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Personas Visual Index (PRD section 2) */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Section 2. Dynamic Target Personas Mappings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { name: '1. Small Businesses', desc: 'Salons, cafes, boutiques, shops, training hubs.', needs: ['Responsive Page', 'CRM Leads Pipeline', 'Custom Forms', 'WhatsApp CMS Integration'] },
                        { name: '2. Doctors & Clinics', desc: 'Dental care, pediatric, private general clinics.', needs: ['Doctor Profile', 'Acuity Appointment slots', 'Patient pre-forms', 'Location Map'] },
                        { name: '3. Students', desc: 'Developers, designers, researchers.', needs: ['Sleek Mini-Portfolio', 'Live Web Resume', 'Projects lists Showcase', 'Unified Contact'] },
                        { name: '4. Creators', desc: 'Writers, artists, streamers, podcasters.', needs: ['Linktree Bio blocks', 'Newsletter form', 'Direct Products lists', 'Social Hub'] },
                        { name: '5. Real Estate', desc: 'Brokers, agents, property developers.', needs: ['Rich Property lists CMS', 'Location Gallery grid', 'WhatsApp Enquiries', 'Filter widgets'] }
                      ].map((per, idx) => (
                        <div key={idx} className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl space-y-3">
                          <div>
                            <h5 className="text-xs font-bold text-white">{per.name}</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">{per.desc}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Required Specs</p>
                            <div className="flex flex-wrap gap-1">
                              {per.needs.map((nd, i) => (
                                <span key={i} className="text-[8px] bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded font-medium">{nd}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: DYNAMIC SYSTEMS ARCHITECTURE */}
              {activeTab === 'architecture' && (
                <motion.div
                  key="architecture"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: AI Vector Database responding flow */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Section 11. WhatsApp AI System Flow</span>
                        <h4 className="text-lg font-bold text-white font-sans">Evolution API & AI Responder State Routing</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                          When a visitor or prospective client writes to the WhatsApp bot, our Evolution API webhook translates the incoming payload, runs a semantic vector lookup against the user's CMS collections (e.g., Services, timings, location), and feeds it to Gemini to output a natural, accurate response.
                        </p>
                      </div>

                      {/* Visual flow graph */}
                      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl relative font-mono text-xs text-slate-400">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="w-full sm:w-1/4 p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-white uppercase block">1. Customer Text</span>
                            <span className="text-[9px] text-slate-500 mt-1 block">"Sunday haircut slot?"</span>
                          </div>
                          <div className="text-slate-500 text-center">➔</div>
                          <div className="w-full sm:w-1/4 p-3 bg-indigo-950 border border-indigo-800 rounded-xl text-center relative">
                            <div className="absolute -top-1.5 right-2 px-1.5 py-0.5 bg-indigo-500 text-white text-[7px] font-bold rounded">CRM</div>
                            <span className="text-[10px] font-bold text-indigo-300 uppercase block">2. DB Vector Scan</span>
                            <span className="text-[9px] text-indigo-400 mt-1 block">Query CMS Services</span>
                          </div>
                          <div className="text-slate-500 text-center">➔</div>
                          <div className="w-full sm:w-1/4 p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-emerald-300 uppercase block">3. Gemini Gen</span>
                            <span className="text-[9px] text-emerald-500 mt-1 block">Inject guidelines context</span>
                          </div>
                        </div>

                        <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active WhatsApp Mode</span>
                          <div className="flex gap-2">
                            <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded font-bold uppercase">AI Premium Bot</span>
                            <span className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-bold uppercase">Basic Menu Flow</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: WHEN/DO Trigger automation visualizer */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">Section 12. Automation Engine Builder</span>
                        
                        <div className="space-y-4">
                          <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            Simulate the logical automated pipeline. Select a trigger event to see what action fires instantly.
                          </p>

                          <div className="space-y-2.5">
                            <div>
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">WHEN (Trigger Event)</label>
                              <div className="grid grid-cols-2 gap-1.5">
                                {['Form submitted', 'Appointment booked', 'Review submitted'].map(t => (
                                  <button
                                    key={t}
                                    onClick={() => setAutomationWhen(t)}
                                    className={`text-[10px] py-2 rounded-lg border font-bold transition-all text-left px-3 cursor-pointer ${
                                      automationWhen === t
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-center text-slate-600 font-bold py-1">⬇</div>

                            <div>
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">DO (Automated Action)</label>
                              <div className="grid grid-cols-2 gap-1.5">
                                {['Send WhatsApp message', 'Create CRM lead', 'Google Calendar Sync', 'Push Webhook'].map(a => (
                                  <button
                                    key={a}
                                    onClick={() => setAutomationDo(a)}
                                    className={`text-[10px] py-2 rounded-lg border font-bold transition-all text-left px-3 cursor-pointer ${
                                      automationDo === a
                                        ? 'bg-emerald-600 border-emerald-500 text-white'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {a}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Generated Automation Logic:</span>
                            <p className="text-xs font-semibold text-slate-200">
                              WHEN <span className="text-indigo-400 font-bold font-mono">"{automationWhen}"</span> THEN trigger <span className="text-emerald-400 font-bold font-mono">"{automationDo}"</span> immediately.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: INTERACTIVE DATABASE SCHEMA EXPLORER */}
              {activeTab === 'schema' && (
                <motion.div
                  key="schema"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Database Sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-4">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search tables..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                        {filteredTables.map((t) => (
                          <button
                            key={t.name}
                            onClick={() => setSelectedTable(t.name)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              selectedTable === t.name
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/80'
                            }`}
                          >
                            <span className="font-mono flex items-center gap-1.5">
                              <Database size={10} className="opacity-70" />
                              {t.name}
                            </span>
                            <ChevronRight size={12} className="opacity-50" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Database Schema Detail Screen */}
                    <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
                      <div className="space-y-1 pb-4 border-b border-slate-800">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono">
                          TABLE SPECIFICATION
                        </span>
                        <h4 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                          <Database size={18} className="text-indigo-500" />
                          {selectedTableData.name}
                        </h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                          {selectedTableData.desc}
                        </p>
                      </div>

                      {/* Fields Table */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Columns Definition</h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-bold">
                                <th className="pb-2 font-semibold">Column Name</th>
                                <th className="pb-2 font-semibold">Data Type</th>
                                <th className="pb-2 font-semibold">Attributes / Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                              {selectedTableData.fields.map((f) => (
                                <tr key={f.name} className="hover:bg-slate-850/50">
                                  <td className="py-2.5 font-bold text-slate-100">{f.name}</td>
                                  <td className="py-2.5 text-indigo-400 font-semibold">{f.type}</td>
                                  <td className="py-2.5 text-slate-400 font-medium font-sans">{f.desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Relations Card */}
                      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Relational Bounds</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedTableData.relations.map((rel, i) => (
                              <span key={i} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                {rel}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950/60 border border-slate-800/40 rounded-xl shrink-0">
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Durable Cloud Engine</span>
                          <span className="text-xs text-indigo-300 font-bold font-mono">PostgreSQL (Prisma)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Wix / WordPress comparison */}
              {activeTab === 'comparison' && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Section 25. Strategic Differentiation Goal</span>
                    <h4 className="text-lg font-bold text-white font-sans">"Easier than Wix, more useful than Linktree, simpler than WordPress."</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">
                      OnlyPage completely eliminates the "builder stress" of pixel-dragging while offering a native CMS, CRM, auto-running WhatsApp client, and form generators out-of-the-box.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* OnlyPage Column */}
                    <div className="p-5 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded uppercase font-mono">Platform Goal</span>
                        <h5 className="text-base font-bold text-white">OnlyPage</h5>
                        <p className="text-[10px] text-indigo-300 font-semibold">Everything integrated in 2 minutes</p>
                      </div>
                      <div className="space-y-2 text-xs font-medium">
                        <p className="text-emerald-400 flex items-center gap-1.5">✓ Zero pixel-dragging stress</p>
                        <p className="text-emerald-400 flex items-center gap-1.5">✓ Built-in CMS collection database</p>
                        <p className="text-emerald-400 flex items-center gap-1.5">✓ Direct Google Sheets & CRM sync</p>
                        <p className="text-emerald-400 flex items-center gap-1.5">✓ Native WhatsApp Auto AI response</p>
                        <p className="text-emerald-400 flex items-center gap-1.5">✓ Absolute setup in 120s</p>
                      </div>
                    </div>

                    {/* Wix Column */}
                    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl opacity-75 hover:opacity-100 transition-opacity space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase block">Legacy Builder</span>
                        <h5 className="text-sm font-bold text-slate-300">Wix / Squarespace</h5>
                        <p className="text-[10px] text-slate-500 font-semibold">General drag-and-drop</p>
                      </div>
                      <div className="space-y-2 text-xs font-semibold text-slate-400">
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Highly tedious pixel positioning</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Requires separate form builders</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ No WhatsApp auto-responder</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Complex billing integrations</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Extreme performance bloat</p>
                      </div>
                    </div>

                    {/* Linktree Column */}
                    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl opacity-75 hover:opacity-100 transition-opacity space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase block">Bio Tool</span>
                        <h5 className="text-sm font-bold text-slate-300">Linktree / Bio.fm</h5>
                        <p className="text-[10px] text-slate-500 font-semibold">Simple static link lists</p>
                      </div>
                      <div className="space-y-2 text-xs font-semibold text-slate-400">
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Zero SEO search custom metadata</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ No real multi-page hierarchy</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ No custom services CMS schema</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ No interactive client booking slots</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Looks generic & unbranded</p>
                      </div>
                    </div>

                    {/* WordPress Column */}
                    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl opacity-75 hover:opacity-100 transition-opacity space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase block">CMS platform</span>
                        <h5 className="text-sm font-bold text-slate-300">WordPress</h5>
                        <p className="text-[10px] text-slate-500 font-semibold">Highly complex software</p>
                      </div>
                      <div className="space-y-2 text-xs font-semibold text-slate-400">
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Extreme security vulnerability</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Tedious plug-in updates & crashes</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Hard to link forms with WhatsApp</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Requires separate hosting bills</p>
                        <p className="text-rose-400 flex items-center gap-1.5">✗ Extreme development cost</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Bottom stats banner of PRD */}
          <div className="border-t border-slate-800 bg-slate-950 p-4 px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5 text-indigo-400">
              <ShieldCheck size={14} className="text-indigo-400 shrink-0" />
              Section 24 MVP specifications validated against container ingress
            </span>
            <span className="font-mono mt-2 sm:mt-0 bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded">
              v1.0 Production Target
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
