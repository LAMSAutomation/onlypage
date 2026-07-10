import React, { useState, useEffect } from 'react';
import { 
  Home, Layers, Files, Database, ClipboardList, Inbox as InboxIcon, Users, MessageSquare, 
  Calendar as CalendarIcon, BarChart3, Search, Megaphone, Sparkles, Cpu, Folder, Star, Plug, 
  Settings as SettingsIcon, CreditCard, Plus, ArrowRight, ArrowUpRight, Zap, CheckCircle2, 
  Bot, Clock, Phone, Mail, User, ShieldAlert, Send, PlusCircle, Trash, Play, HelpCircle, 
  RefreshCw, Check, Code, MapPin, Smile, Globe, Scissors, Paperclip, CheckSquare, Eye, X, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, LineChart, Line, Cell 
} from 'recharts';
import { DashboardMode } from './app-shell';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  dashboardMode: DashboardMode;
}

export function Dashboard({ activeTab, setActiveTab, dashboardMode }: DashboardProps) {
  // --- STATE FOR GLOBAL DYNAMIC SESSIONS ---
  const [toast, setToast] = useState<string | null>(null);

  // Trigger global notifications
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Home Command Center State
  const [websiteLive, setWebsiteLive] = useState(true);

  // 2. Website Manager Pages
  const [pagesList, setPagesList] = useState([
    { name: 'Home', path: '/', status: 'Published', views: '1,450', lastEdit: '2 hours ago' },
    { name: 'About Us', path: '/about', status: 'Published', views: '290', lastEdit: '1 day ago' },
    { name: 'Services Menu', path: '/services', status: 'Published', views: '800', lastEdit: '3 days ago' },
    { name: 'Contact & Inquiry', path: '/contact', status: 'Published', views: '120', lastEdit: 'Just now' },
    { name: 'Holiday Special Ofer', path: '/holiday-offer', status: 'Draft', views: '0', lastEdit: '5 mins ago' }
  ]);
  const [newPageName, setNewPageName] = useState('');
  const [newPagePath, setNewPagePath] = useState('');

  // 3. Visual Website Builder state
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [blocksInUse, setBlocksInUse] = useState([
    { id: 'b1', type: 'Hero', title: 'Luxury Hair Styling & Premium Salon Care', desc: 'Book your hair transformations and experience rejuvenation.' },
    { id: 'b2', type: 'Services', title: 'Our Premium Offerings', services: ['Haircut & Treatment', 'Organic Face Therapy', 'Nail Artistry'] },
    { id: 'b3', type: 'Pricing', title: 'Transparent Pricing Plans', price: '₹499 — ₹2,000' },
    { id: 'b4', type: 'Reviews', title: 'Loved by 4,800+ locals', rating: '4.8 Stars' }
  ]);
  const [editText, setEditText] = useState('');

  // 4. CMS Collections state
  const [cmsCollection, setCmsCollection] = useState<'services' | 'products' | 'blogs'>('services');
  const [servicesCms, setServicesCms] = useState([
    { name: 'Haircut & Styling', price: '₹500', category: 'Hair' },
    { name: 'Premium Hair Spa & Steam', price: '₹1500', category: 'Therapy' },
    { name: 'Organic Hydrating Facial', price: '₹2000', category: 'Facial' }
  ]);
  const [newCmsName, setNewCmsName] = useState('');
  const [newCmsPrice, setNewCmsPrice] = useState('');

  // 5. Forms Center submissions and builder
  const [formSubmissions, setFormSubmissions] = useState([
    { formName: 'Appointment Form', email: 'ravikumar@gmail.com', date: 'Jul 10, 10:20 AM', data: 'Requested Haircut on July 11th' },
    { formName: 'Contact Form', email: 'priya_sharma@yahoo.com', date: 'Jul 09, 06:15 PM', data: 'Inquiry regarding bridal package pricing' },
    { formName: 'Appointment Form', email: 'arun_raj@gmail.com', date: 'Jul 09, 11:30 AM', data: 'Requested Facial Spa on July 14th' }
  ]);
  const [formFields, setFormFields] = useState([
    { id: 'f1', label: 'Full Name', type: 'Text', required: true },
    { id: 'f2', label: 'Phone Number', type: 'Phone', required: true },
    { id: 'f3', label: 'Preferred Booking Slot', type: 'Date picker', required: true }
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('Text');

  // 6. Unified Inbox chats
  const [inboxTab, setInboxTab] = useState<'whatsapp' | 'email' | 'forms'>('whatsapp');
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [whatsappChats, setWhatsappChats] = useState([
    { name: 'Ravi Kumar', lastMsg: 'Interested in Hair Spa pricing', time: '10:42 AM', source: 'Website', aiSummary: 'Hot customer. Asked pricing twice.', messages: [
      { sender: 'user', text: 'Hi, is there any discount for hair spa package?', time: '10:40 AM' },
      { sender: 'bot', text: 'Hello! Our Premium Hair Spa & Steam is priced at ₹1,500. I can block an appointment slot for you!', time: '10:41 AM' },
      { sender: 'user', text: 'Okay, block a slot for Saturday evening please.', time: '10:42 AM' }
    ]},
    { name: 'Priya Sharma', lastMsg: 'When is the doctor available?', time: 'Yesterday', source: 'WhatsApp', aiSummary: 'Frequent client, looking for quick consultation.', messages: [
      { sender: 'user', text: 'Hi, when is Dr. Rathnavel available for consultation?', time: 'Yesterday' },
      { sender: 'bot', text: 'Good morning! Dr. Rathnavel is available Monday to Saturday 10 AM to 5 PM.', time: 'Yesterday' }
    ]}
  ]);
  const [replyText, setReplyText] = useState('');

  // 7. CRM mini HubSpot
  const [crmFilter, setCrmFilter] = useState<'all' | 'hot' | 'customer' | 'follow'>('all');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Ravi Kumar', email: 'ravikumar@gmail.com', phone: '+91 98765 43210', status: 'Hot Lead 🔥', amount: '₹1,500', timeline: [
      { event: 'Visited website studio46.onlypage.in', time: 'Jul 10, 10:05 AM' },
      { event: 'Filled Booking Form', time: 'Jul 10, 10:20 AM' },
      { event: 'WhatsApp Bot Auto-replied with pricing info', time: 'Jul 10, 10:21 AM' },
      { event: 'Assigned status to Hot Lead', time: 'Jul 10, 10:25 AM' }
    ]},
    { id: 'c2', name: 'Priya Sharma', email: 'priya_sharma@yahoo.com', phone: '+91 98123 45678', status: 'Customer', amount: '₹3,500', timeline: [
      { event: 'First booking completed', time: 'Jun 28, 04:00 PM' },
      { event: 'Added 5-star review on Google', time: 'Jul 01, 10:00 AM' }
    ]},
    { id: 'c3', name: 'Arun Raj', email: 'arun_raj@gmail.com', phone: '+91 99001 12233', status: 'Follow Up', amount: '₹0', timeline: [
      { event: 'Abandoned Booking form at email field', time: 'Jul 09, 11:28 AM' },
      { event: 'Auto recovery Email sent', time: 'Jul 09, 01:00 PM' }
    ]}
  ]);

  // 8. WhatsApp Center configuration and testing
  const [botEnabled, setBotEnabled] = useState(true);
  const [botWelcomeMessage, setBotWelcomeMessage] = useState('Hello there! 👋 Welcome to our smart business assistant. Select an option:\n1. Services\n2. Pricing\n3. Location\n4. Book Appointment');
  const [wsTestQuery, setWsTestQuery] = useState('');
  const [wsTestLogs, setWsTestLogs] = useState<string[]>(['[System]: WhatsApp gateway running on Evolution API.']);

  // 9. Booking calendar state
  const [bookingsList, setBookingsList] = useState([
    { id: 'b1', name: 'Ravi Kumar', service: 'Haircut & Treatment', time: '10:00 AM', date: 'Today', staff: 'Rathnavel K', status: 'Confirmed' },
    { id: 'b2', name: 'Priya Sharma', service: 'Organic Hydrating Facial', time: '12:30 PM', date: 'Today', staff: 'Sneha R', status: 'Confirmed' },
    { id: 'b3', name: 'Arun Raj', service: 'Nail Grooming Spa', time: '03:15 PM', date: 'Tomorrow', staff: 'Vikram S', status: 'Pending' }
  ]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [newBookService, setNewBookService] = useState('Haircut & Treatment');
  const [newBookTime, setNewBookTime] = useState('11:30 AM');

  // 10. Analytics dataset
  const visitorsData = [
    { day: 'Mon', Visitors: 1200, Conversion: 340 },
    { day: 'Tue', Visitors: 1540, Conversion: 410 },
    { day: 'Wed', Visitors: 1890, Conversion: 480 },
    { day: 'Thu', Visitors: 2430, Conversion: 560 },
    { day: 'Fri', Visitors: 2100, Conversion: 490 },
    { day: 'Sat', Visitors: 2850, Conversion: 680 },
    { day: 'Sun', Visitors: 2450, Conversion: 580 }
  ];

  // 11. SEO Manager state
  const [seoScore, setSeoScore] = useState(87);
  const [seoChecklist, setSeoChecklist] = useState([
    { id: 'seo1', text: 'Configure custom domains correctly', status: true },
    { id: 'seo2', text: 'Verify sitemap.xml is submitted to Google', status: true },
    { id: 'seo3', text: 'Generate automatic JSON-LD rich schema structured data', status: true },
    { id: 'seo4', text: 'Missing meta viewport viewport scale limits', status: false },
    { id: 'seo5', text: 'Generate meta alt text tag summaries for images', status: false }
  ]);
  const [fixingSeo, setFixingSeo] = useState(false);

  // 12. Marketing campaigns state
  const [campaigns, setCampaigns] = useState([
    { title: 'Diwali Festive Sparkle', channel: 'WhatsApp', sentTo: '450 Customers', status: 'Completed', conversion: '12%' },
    { title: 'Weekend Grooming Spa special', channel: 'Email', sentTo: '1,200 leads', status: 'Scheduled', conversion: '--' }
  ]);
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [campaignChannel, setCampaignChannel] = useState('WhatsApp');

  // 13. AI Assistant chatbot state
  const [aiChatLogs, setAiChatLogs] = useState([
    { sender: 'ai', text: 'Hello Rathnavel! I am your OnlyPage AI growth copilot. You can tell me instructions like "Draft a Christmas coupon code of 25%" or "Generate meta SEO descriptions for my hair care business."' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // 14. Automation Builder state
  const [automations, setAutomations] = useState([
    { trigger: 'New Form Submission', action: 'Send automated WhatsApp welcome message', status: true },
    { trigger: 'Booking Scheduled', action: 'Add CRM customer status log & send SMS details', status: true },
    { trigger: 'CRM Contact Status: Hot Lead 🔥', action: 'Send 10% coupon code via Email campaign', status: false }
  ]);

  // 15. File Manager categories
  const [files, setFiles] = useState([
    { name: 'logo-transparent.png', type: 'Logos', size: '142 KB', date: 'July 10, 2026' },
    { name: 'salon-interior.jpg', type: 'Images', size: '2.4 MB', date: 'July 08, 2026' },
    { name: 'booking-invoice-template.pdf', type: 'Documents', size: '412 KB', date: 'July 05, 2026' }
  ]);
  const [activeFileCategory, setActiveFileCategory] = useState('All');

  // 16. Reviews Manager reviews and replies
  const [reviewsList, setReviewsList] = useState([
    { author: 'Vikrant Roy', rating: 5, date: 'Jul 10, 2026', comment: 'Rathnavel is an exceptional hair stylist! The salon environment was absolutely clean and elite. Standard pricing is incredible.', aiReplied: false, draftedReply: '' },
    { author: 'Meera Deshmukh', rating: 4.8, date: 'Jul 08, 2026', comment: 'Loved their organic facials, scheduling on WhatsApp bot was extremely friction-free. Will definitely visit again!', aiReplied: true, draftedReply: 'Thank you Meera for sharing your gorgeous review. We are delighted to host you back for organic therapy soon!' }
  ]);

  // 17. Marketplace integrations state
  const [integrationsList, setIntegrationsList] = useState([
    { name: 'Google Analytics', desc: 'Track comprehensive real-time conversions.', installed: true, icon: Globe },
    { name: 'Razorpay Gateway', desc: 'Accept credit cards, UPI, net banking.', installed: true, icon: CreditCard },
    { name: 'Calendly Schedule Sync', desc: 'Map bookings directly to external calendar accounts.', installed: false, icon: CalendarIcon },
    { name: 'Facebook Ads Pixel', desc: 'Optimize Facebook retargeting campaigns.', installed: false, icon: BarChart3 }
  ]);

  // 18. Settings
  const [businessName, setBusinessName] = useState('Salon Studio 46');
  const [businessPhone, setBusinessPhone] = useState('+91 98765 43210');
  const [themeColor, setThemeColor] = useState('#6366f1');

  // 19. Billing usage data
  const [billingPlan, setBillingPlan] = useState('Pro Growth Plan');
  const [usagePercent, setUsagePercent] = useState({ pages: 60, storage: 40, sms: 75, ai: 25 });

  // Handle Action Trigger: AI Suggestion Fix
  const handleApplyAiSuggestion = () => {
    // Add pricing section or apply block change
    const newBlock = { id: 'b_ai', type: 'Pricing', title: 'Special Discount Offer Block', price: '₹299 onwards' };
    setBlocksInUse([...blocksInUse, newBlock]);
    showToast('AI suggestion applied! Added Pricing Discount Block to Website Visual Builder.');
  };

  // Handle SEO auto fix simulation
  const handleSeoFix = () => {
    setFixingSeo(true);
    setTimeout(() => {
      setSeoScore(100);
      setSeoChecklist(seoChecklist.map(item => ({ ...item, status: true })));
      setFixingSeo(false);
      showToast('AI SEO Copilot successfully corrected structural errors! SEO score raised to 100/100.');
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast alert system */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl z-55 flex items-center gap-2"
          >
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC DASHBOARD SWITCHER HEADER BAR */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800 select-none">
        {/* Backdrop visual glow overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wide uppercase text-indigo-300">
              <Sparkles size={11} />
              <span>Workspace Active: {dashboardMode.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight">
              Good morning, Rathnavel 👋
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
              {dashboardMode === 'student' && "Welcome to your digital folio! Monitor your latest resume views, portfolio engagements, and direct employer contacts easily."}
              {dashboardMode === 'salon' && "Your appointment calendar is filled! Leverage automated WhatsApp triggers, monitor local review aggregates, and capture leads instantly."}
              {dashboardMode === 'creator' && "Monetize your creative assets! Setup product cards, review landing page analytics, and deploy dynamic newsletter forms in seconds."}
              {dashboardMode === 'business' && "Optimize and automate your client acquisition funnels. Build SEO authority, launch email marketing campaigns, and configure Zapier triggers."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('builder');
                showToast('Launching Website Editor...');
              }}
              className="px-5 py-2.5 bg-white text-indigo-950 hover:bg-slate-100 active:scale-98 transition-all rounded-full text-xs font-black shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <Code size={14} />
              <span>Edit Live Site</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('ai');
                showToast('Asking OnlyPage growth assistant...');
              }}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-98 border border-white/10 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-indigo-300" />
              <span>growth.ai</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- DASHBOARD SCREENS CONTAINER --- */}
      <div className="min-h-[500px]">
        {/* =========================================
            1. HOME COMMAND CENTER 
            ========================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Grid Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Visitors', val: '2,430', change: '+24%', color: 'from-indigo-50 to-indigo-100/30' },
                { label: 'New Lead Captures', val: '56', change: '+18%', color: 'from-blue-50 to-blue-100/30' },
                { label: 'WhatsApp Chats', val: '120', change: '+8%', color: 'from-emerald-50 to-emerald-100/30' },
                { label: 'Active Bookings', val: '14', change: '+42%', color: 'from-purple-50 to-purple-100/30' }
              ].map((m, idx) => (
                <div key={idx} className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-3xs flex flex-col justify-between hover:shadow-xs transition-shadow`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{m.label}</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5">{m.change}</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-slate-900">{m.val}</h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">Real-time daily telemetry</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Split layout: Analytics chart + Actions & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Analytics graph block */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-3xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-800">Traffic Engagement Timeline</h2>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Subdomain conversions of the past 7 days</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Full Analytics</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitorsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Area type="monotone" dataKey="Visitors" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#visitorsGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions & AI suggestion block */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs select-none">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5 mb-4">Quick Command Actions</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: 'Edit Website', icon: Layers, tab: 'builder' },
                      { label: 'Create Page', icon: Files, tab: 'pages' },
                      { label: 'Add CMS Item', icon: Database, tab: 'cms' },
                      { label: 'Send Offer', icon: Megaphone, tab: 'marketing' },
                    ].map((act, idx) => {
                      const Icon = act.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveTab(act.tab);
                            showToast(`Navigated to ${act.label}`);
                          }}
                          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200/80 transition-all cursor-pointer text-slate-600 gap-2"
                        >
                          <Icon size={18} className="shrink-0" />
                          <span className="text-[10px] font-bold text-center leading-tight">{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Insights Suggestion */}
                <div className="bg-gradient-to-br from-indigo-500/5 to-pink-500/5 border border-indigo-100 rounded-3xl p-6 shadow-3xs relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                  </div>
                  <h3 className="text-xs font-black text-indigo-950 flex items-center gap-1.5 uppercase tracking-wide">
                    OnlyPage Assistant ✨
                  </h3>
                  <div className="mt-3 space-y-3">
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      Your services page got <span className="font-bold text-indigo-600">800 visits</span> this week, but only generated <span className="font-bold text-indigo-600">12 enquiries</span>.
                    </p>
                    <div className="bg-white border border-indigo-100/80 p-3 rounded-xl">
                      <p className="text-[10px] text-indigo-900 font-extrabold">Recommended Fix:</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">Append a transparent pricing plan block or discount card above the fold to drive immediate inquiry conversions.</p>
                    </div>
                    <button
                      onClick={handleApplyAiSuggestion}
                      className="w-full h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Zap size={11} className="fill-white" />
                      <span>Apply Fix automatically</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            2. VISUAL WEBSITE BUILDER
            ========================================= */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column: Blocks available */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-4">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">Available Sections</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Click to append block to preview</p>
              </div>

              <div className="space-y-2">
                {[
                  { type: 'Hero', desc: 'Title, intro description & booking CTA button' },
                  { type: 'Services', desc: 'Visual structured matrix of offerings' },
                  { type: 'Pricing', desc: 'Simple plan comparisons with checkout CTAs' },
                  { type: 'Gallery', desc: 'Grid display of portfolio/interior photos' },
                  { type: 'Forms', desc: 'Lead capture form with validation' },
                  { type: 'Reviews', desc: 'Google rating aggregate block' }
                ].map((b) => (
                  <button
                    key={b.type}
                    onClick={() => {
                      const newB = { id: 'b_' + Date.now(), type: b.type, title: `Custom ${b.type} Section`, desc: `Sample editable description text...`, services: ['Service Alpha', 'Service Beta'], price: '₹499 onwards', rating: '4.9 Stars' };
                      setBlocksInUse([...blocksInUse, newB]);
                      showToast(`Appended ${b.type} block to visual canvas!`);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-950 border border-slate-200/60 hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-black block text-slate-700 group-hover:text-indigo-900">{b.type} block</span>
                    <span className="text-[9px] text-slate-400 group-hover:text-slate-500 font-medium block mt-0.5 leading-tight">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Column: Live Website Preview */}
            <div className="xl:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-xl flex flex-col h-[520px] overflow-hidden">
              <div className="flex items-center justify-between bg-slate-950/80 rounded-t-2xl px-4 py-2 border-b border-slate-850">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="px-3 py-1 bg-slate-900 rounded-md text-[9px] text-slate-400 font-semibold border border-slate-800 select-none">
                  studio46.onlypage.in
                </div>
                <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Preview</span>
                </span>
              </div>

              {/* Interactive Inner preview sandbox simulation */}
              <div className="flex-1 bg-white overflow-y-auto p-6 space-y-6 scrollbar-thin text-left">
                {blocksInUse.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => {
                      setSelectedBlock(block.id);
                      setEditText(block.title);
                      showToast(`Selected ${block.type} block for editing`);
                    }}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer group ${
                      selectedBlock === block.id 
                        ? 'border-indigo-500 bg-indigo-50/10 ring-2 ring-indigo-50'
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/40'
                    }`}
                  >
                    {/* Floating delete block indicator */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlocksInUse(blocksInUse.filter(b => b.id !== block.id));
                        if (selectedBlock === block.id) setSelectedBlock(null);
                        showToast('Removed section block.');
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-md transition-opacity cursor-pointer"
                    >
                      <Trash size={12} />
                    </button>

                    <div className="inline-block text-[8px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1">
                      {block.type}
                    </div>

                    {block.type === 'Hero' && (
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{block.title}</h3>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{block.desc}</p>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-bold">
                          Book Appointment slot
                        </button>
                      </div>
                    )}

                    {block.type === 'Services' && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-extrabold text-slate-900">{block.title}</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {block.services?.map((serv, idx) => (
                            <div key={idx} className="p-2 border border-slate-100 rounded-xl bg-slate-50">
                              <p className="text-[8px] font-bold text-slate-800">{serv}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === 'Pricing' && (
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-extrabold text-slate-900">{block.title}</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Price range: {block.price}</p>
                        <div className="p-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-center">
                          <p className="text-[9px] font-extrabold text-indigo-950">Book Online & Save 10%</p>
                        </div>
                      </div>
                    )}

                    {block.type === 'Reviews' && (
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-extrabold text-slate-900">{block.title}</h3>
                        <div className="flex items-center gap-1 text-amber-500 text-[10px]">
                          <span>★ ★ ★ ★ ★</span>
                          <span className="font-extrabold text-slate-700 text-[9px] ml-1">{block.rating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Properties editor panel */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-5">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">Section Properties</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Select any preview block to customize values</p>
              </div>

              {selectedBlock ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Block Title</label>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => {
                        setEditText(e.target.value);
                        setBlocksInUse(blocksInUse.map(b => b.id === selectedBlock ? { ...b, title: e.target.value } : b));
                      }}
                      className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Color Palette</label>
                    <div className="flex gap-2">
                      {['#6366f1', '#ec4899', '#14b8a6', '#0f172a'].map((col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setThemeColor(col);
                            showToast(`Palette theme synced successfully.`);
                          }}
                          className="w-6 h-6 rounded-full border border-slate-200 transition-transform active:scale-90 cursor-pointer"
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Section Spacing</label>
                    <input type="range" min="10" max="100" defaultValue="40" className="w-full accent-indigo-600" />
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedBlock(null);
                        showToast('Section properties deployed to staging subdomain!');
                      }}
                      className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check size={14} />
                      <span>Save and Update</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Layers size={24} className="mx-auto opacity-40 text-slate-400" />
                  <p className="text-[10px] font-semibold">Select any layout section inside the middle preview viewport to open customization fields.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            3. PAGES MANAGER
            ========================================= */}
        {activeTab === 'pages' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Pages Manager</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage sub-routes on studio46.onlypage.in</p>
              </div>

              {/* Add New Page Block Form */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Page Name (e.g. Portfolio)"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="text-xs font-semibold px-3 h-9 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="text"
                  placeholder="Route (e.g. /portfolio)"
                  value={newPagePath}
                  onChange={(e) => setNewPagePath(e.target.value)}
                  className="text-xs font-semibold px-3 h-9 border border-slate-200 rounded-xl outline-none"
                />
                <button
                  onClick={() => {
                    if (!newPageName.trim()) return;
                    const path = newPagePath.trim() || `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
                    setPagesList([...pagesList, { name: newPageName, path, status: 'Draft', views: '0', lastEdit: 'Just now' }]);
                    setNewPageName('');
                    setNewPagePath('');
                    showToast(`Created Page Draft: ${newPageName}!`);
                  }}
                  className="px-4 h-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Plus size={14} />
                  <span>Create Page</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto select-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-black text-[9px] tracking-wider">
                    <th className="pb-3 pl-3">Page Name</th>
                    <th className="pb-3">URL Route Path</th>
                    <th className="pb-3">Publish Status</th>
                    <th className="pb-3">Estimated Views</th>
                    <th className="pb-3">Last Edit Date</th>
                    <th className="pb-3 text-right pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {pagesList.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pl-3 font-bold text-slate-800">{p.name}</td>
                      <td className="py-3.5 text-indigo-600 font-mono text-[10px]">{p.path}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          p.status === 'Published' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${p.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span>{p.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600">{p.views}</td>
                      <td className="py-3.5 text-slate-400">{p.lastEdit}</td>
                      <td className="py-3.5 text-right pr-3 space-x-2">
                        {p.status === 'Draft' ? (
                          <button
                            onClick={() => {
                              setPagesList(pagesList.map((item, i) => i === idx ? { ...item, status: 'Published' } : item));
                              showToast(`Published page: ${p.name}`);
                            }}
                            className="text-[10px] font-extrabold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setPagesList(pagesList.map((item, i) => i === idx ? { ...item, status: 'Draft' } : item));
                              showToast(`Reverted ${p.name} back to Draft`);
                            }}
                            className="text-[10px] font-extrabold text-slate-500 hover:underline cursor-pointer"
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setPagesList(pagesList.filter((_, i) => i !== idx));
                            showToast('Deleted sub-route page');
                          }}
                          className="text-[10px] font-extrabold text-rose-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================
            4. CMS DASHBOARD
            ========================================= */}
        {activeTab === 'cms' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Dynamic CMS Collections</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Database parameters that dynamically populate the website blocks</p>
              </div>

              {/* Collections tabs switch */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 select-none">
                {[
                  { id: 'services', label: '💇‍♀️ Services' },
                  { id: 'products', label: '🛍️ Products' },
                  { id: 'blogs', label: '📝 Blog Articles' }
                ].map(col => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setCmsCollection(col.id as any);
                      showToast(`Opened collection: ${col.label}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      cmsCollection === col.id ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CMS Inner details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Creator Box */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Add Item to {cmsCollection.toUpperCase()}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Item Title Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Keratin Therapy Treatment"
                      value={newCmsName}
                      onChange={(e) => setNewCmsName(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 bg-white rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Price / Value Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹1800"
                      value={newCmsPrice}
                      onChange={(e) => setNewCmsPrice(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 bg-white rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newCmsName.trim() || !newCmsPrice.trim()) return;
                      setServicesCms([...servicesCms, { name: newCmsName, price: newCmsPrice, category: 'Hair Treatment' }]);
                      setNewCmsName('');
                      setNewCmsPrice('');
                      showToast('Successfully appended dynamic record to active CMS schema!');
                    }}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Save CMS Record</span>
                  </button>
                </div>
              </div>

              {/* Items List View */}
              <div className="lg:col-span-2 space-y-3 select-none">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide">Active Records ({servicesCms.length})</h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden">
                  {servicesCms.map((serv, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-slate-800">{serv.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{serv.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-900 bg-indigo-50/70 border border-indigo-100 rounded-md px-2.5 py-1">
                          {serv.price}
                        </span>
                        <button
                          onClick={() => {
                            setServicesCms(servicesCms.filter((_, i) => i !== idx));
                            showToast('Deleted CMS record');
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            5. FORMS CENTER
            ========================================= */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form visual builder list */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Form Field Builder</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Add inputs to customer-facing capturing widgets</p>
                </div>

                <div className="space-y-2 border-b border-slate-100 pb-4">
                  {formFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-2.5 border border-slate-200/70 bg-slate-50/55 rounded-xl text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                          {field.type}
                        </span>
                        <span className="text-slate-800 font-bold">{field.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          setFormFields(formFields.filter(f => f.id !== field.id));
                          showToast('Removed field from schema');
                        }}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add dynamic field form */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Field Name Label (e.g. Age)"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="w-full text-xs font-semibold px-3 h-10 border border-slate-200 rounded-xl outline-none"
                  />
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="w-full text-xs font-semibold px-3 h-10 border border-slate-200 rounded-xl outline-none bg-white"
                  >
                    {['Text', 'Phone', 'Email', 'Upload', 'Dropdown', 'Payment', 'Date picker'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!newFieldLabel.trim()) return;
                      setFormFields([...formFields, { id: 'f_' + Date.now(), label: newFieldLabel, type: newFieldType, required: true }]);
                      setNewFieldLabel('');
                      showToast(`Appended ${newFieldType} input component!`);
                    }}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle size={14} />
                    <span>Add Form Field</span>
                  </button>
                </div>
              </div>

              {/* Form responses table submissions */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Captured Submissions</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Google Forms/Typeform replacement system</p>
                </div>

                <div className="space-y-3 select-none">
                  {formSubmissions.map((sub, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 bg-white hover:border-slate-350 transition-colors rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-full border border-indigo-100">
                            {sub.formName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">{sub.date}</span>
                        </div>
                        <p className="text-xs font-extrabold text-slate-700">{sub.email}</p>
                        <p className="text-xs text-slate-500 font-medium">{sub.data}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('crm');
                            showToast('Opened profile inside CRM database.');
                          }}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 cursor-pointer"
                        >
                          View in CRM
                        </button>
                        <button
                          onClick={() => {
                            setFormSubmissions(formSubmissions.filter((_, i) => i !== idx));
                            showToast('Deleted submission entry');
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            6. UNIFIED INBOX (WHATSAPP, EMAIL, FORMS)
            ========================================= */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-3xs flex flex-col md:flex-row h-[550px]">
            {/* Left Column: Thread Lists */}
            <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between select-none">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Unified Inbox</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  {['whatsapp', 'email'].map(t => (
                    <button
                      key={t}
                      onClick={() => setInboxTab(t as any)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer ${
                        inboxTab === t ? 'bg-white text-indigo-600' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active list threads */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 select-none">
                {whatsappChats.map((chat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChatIndex(idx)}
                    className={`w-full text-left p-4 transition-colors flex flex-col gap-1 cursor-pointer ${
                      activeChatIndex === idx ? 'bg-indigo-50/20 text-slate-900 border-l-4 border-indigo-600 pl-3' : 'hover:bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">{chat.name}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{chat.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 truncate leading-tight">{chat.lastMsg}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        via {chat.source}
                      </span>
                      <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full uppercase scale-90">
                        Hot Lead 🔥
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Active chat thread sandbox window */}
            <div className="flex-1 flex flex-col bg-slate-50/25 h-full">
              {/* Chat profile bar */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 border border-indigo-200">
                    {whatsappChats[activeChatIndex]?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{whatsappChats[activeChatIndex]?.name}</h4>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span>Online via WhatsApp</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-2.5 py-1">
                    Evolution Gateway Online
                  </span>
                </div>
              </div>

              {/* Chat log timeline sandbox */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col">
                {/* Dynamic AI Summary popup */}
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl">
                  <p className="text-[10px] font-black text-amber-800 flex items-center gap-1 uppercase tracking-wide">
                    <Sparkles size={11} className="text-amber-600 animate-pulse" />
                    <span>AI Conversation Copilot Insight</span>
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5 font-bold">
                    {whatsappChats[activeChatIndex]?.aiSummary}
                  </p>
                </div>

                {whatsappChats[activeChatIndex]?.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[70%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed relative ${
                      m.sender === 'user'
                        ? 'bg-white text-slate-800 border border-slate-200 align-self-start mr-auto'
                        : 'bg-indigo-600 text-white align-self-end ml-auto'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className={`text-[8px] font-semibold mt-1 block text-right ${
                      m.sender === 'user' ? 'text-slate-400' : 'text-indigo-200'
                    }`}>
                      {m.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reply inputs */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!replyText.trim()) return;
                  const chatCopy = [...whatsappChats];
                  chatCopy[activeChatIndex].messages.push({
                    sender: 'bot',
                    text: replyText,
                    time: 'Just now'
                  });
                  chatCopy[activeChatIndex].lastMsg = replyText;
                  chatCopy[activeChatIndex].time = 'Just now';
                  setWhatsappChats(chatCopy);
                  setReplyText('');
                  showToast('Message sent successfully!');
                }}
                className="p-4 border-t border-slate-200 bg-white flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Type secure manual response message here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs font-semibold px-4 h-11 border border-slate-200 rounded-full bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-sm shadow-indigo-100"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================
            7. CONTACTS CRM (MINI HUBSPOT)
            ========================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800">Mini HubSpot CRM Hub</h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage customer life cycle funnels</p>
                </div>

                {/* Status filters */}
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 select-none">
                  {(['all', 'hot', 'customer', 'follow'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => {
                        setCrmFilter(f);
                        showToast(`Filtered CRM list: ${f.toUpperCase()}`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        crmFilter === f ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contacts List Grid */}
                <div className="lg:col-span-2 space-y-2.5 select-none">
                  {contacts
                    .filter(c => {
                      if (crmFilter === 'all') return true;
                      if (crmFilter === 'hot') return c.status.includes('Hot');
                      if (crmFilter === 'customer') return c.status === 'Customer';
                      if (crmFilter === 'follow') return c.status.includes('Follow');
                      return true;
                    })
                    .map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          setSelectedContact(contact);
                          showToast(`Opened timeline for ${contact.name}`);
                        }}
                        className={`w-full text-left p-4 border rounded-2xl bg-white hover:border-indigo-300 hover:shadow-3xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          selectedContact?.id === contact.id ? 'border-indigo-500 ring-2 ring-indigo-50 bg-indigo-50/5' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-800">{contact.name}</span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              contact.status.includes('Hot') 
                                ? 'bg-orange-50 text-orange-700 border border-orange-100'
                                : contact.status === 'Customer'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-50 text-slate-500 border border-slate-100'
                            }`}>
                              {contact.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold">{contact.email}  •  {contact.phone}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900">{contact.amount}</p>
                          <p className="text-[8px] font-bold text-slate-400 mt-0.5">Value Segment</p>
                        </div>
                      </button>
                    ))}
                </div>

                {/* Sidebar Detail Timeline Viewer panel */}
                <div className="bg-slate-50/65 rounded-3xl border border-slate-200/60 p-6 space-y-5">
                  {selectedContact ? (
                    <div className="space-y-6 text-left">
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50/80 border border-indigo-100 px-2 py-0.5 rounded-md">
                          Account Profile Timeline
                        </span>
                        <h3 className="text-sm font-black text-slate-800 mt-2">{selectedContact.name}</h3>
                        <p className="text-[10px] text-slate-500 font-medium">{selectedContact.email}</p>
                      </div>

                      {/* Vertically elegant visual Timeline */}
                      <div className="space-y-4 relative pl-4 border-l border-slate-200/80 select-none">
                        {selectedContact.timeline.map((t: any, idx: number) => (
                          <div key={idx} className="relative">
                            {/* Dot indicator */}
                            <span className="absolute -left-[20.5px] top-1 w-3 h-3 bg-indigo-600 border-2 border-white rounded-full ring-2 ring-indigo-50" />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-700 leading-tight">{t.event}</p>
                              <span className="text-[9px] font-semibold text-slate-400 block">{t.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('inbox');
                            showToast(`Navigated to active messages with ${selectedContact.name}`);
                          }}
                          className="flex-1 h-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <InboxIcon size={12} />
                          <span>Send Message</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContact(null);
                            showToast('Cleared active profile viewer');
                          }}
                          className="px-3 h-9 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-400 space-y-2">
                      <Users size={28} className="mx-auto opacity-35 text-slate-400" />
                      <p className="text-[10px] font-bold leading-normal max-w-[200px] mx-auto">Select any contact profile from the list to preview visual timeline logs.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            8. WHATSAPP CENTER & AUTOMATED BOT BUILDER
            ========================================= */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bot builder options settings */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Bot welcome setup</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Automated prompt responses</p>
                  </div>
                  <button
                    onClick={() => {
                      setBotEnabled(!botEnabled);
                      showToast(`WhatsApp Bot ${!botEnabled ? 'Enabled' : 'Disabled'}`);
                    }}
                    className={`px-3 py-1 text-[10px] font-black rounded-full uppercase cursor-pointer ${
                      botEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {botEnabled ? '● Bot Active' : '● Inactive'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Bot welcome prompt menu message</label>
                    <textarea
                      rows={4}
                      value={botWelcomeMessage}
                      onChange={(e) => setBotWelcomeMessage(e.target.value)}
                      className="w-full text-xs font-semibold p-3.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50/50 resize-none font-sans"
                    />
                  </div>

                  {/* Options schema display */}
                  <div className="space-y-1.5 select-none">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Automatic Trigger mappings</p>
                    {[
                      { key: '1', val: 'Query CMS Services block & render catalog list' },
                      { key: '2', val: 'Display current price configurations' },
                      { key: '3', val: 'Output map directions / Plot 24, Indiranagar Bengaluru' },
                      { key: '4', val: 'Instantly block pending slots in Bookings page' }
                    ].map(opt => (
                      <div key={opt.key} className="flex gap-2 p-2 bg-slate-50 border border-slate-200/50 rounded-xl text-[10px] font-bold">
                        <span className="text-indigo-600 font-black">Option {opt.key}:</span>
                        <span className="text-slate-500 font-semibold">{opt.val}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      showToast('Saved WhatsApp Bot configuration!');
                    }}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                  >
                    Save Mappings
                  </button>
                </div>
              </div>

              {/* Bot Interactive Tester Simulation */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs flex flex-col justify-between h-[480px]">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Evolution AI Bot Simulator</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Test how the automated bot interacts with your customer queries</p>
                </div>

                {/* Simulated chat timeline logs */}
                <div className="flex-1 my-4 overflow-y-auto border border-slate-100 bg-slate-50 rounded-2xl p-4 space-y-2 font-mono text-[10px] text-slate-600 leading-relaxed scrollbar-thin">
                  {wsTestLogs.map((log, i) => (
                    <p key={i}>{log}</p>
                  ))}
                </div>

                {/* Prompt query triggers */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!wsTestQuery.trim()) return;
                    const query = wsTestQuery;
                    const logAppend = [
                      ...wsTestLogs,
                      `[User]: "${query}"`,
                      `[Bot Processing]: Executing Option maps match algorithms...`
                    ];
                    setWsTestLogs(logAppend);
                    setWsTestQuery('');

                    // Delayed simulated reply
                    setTimeout(() => {
                      let reply = `[Bot]: "Thank you for query! I did not match specific numeric values. Please select Option 1, 2, 3 or 4."`;
                      const q = query.toLowerCase();
                      if (q.includes('1') || q.includes('service') || q.includes('catalog')) {
                        reply = `[Bot]: "Offering Haircut (₹500), Hair Spa (₹1,500), Facial (₹2,000). Apply booking triggers now?"`;
                      } else if (q.includes('2') || q.includes('price') || q.includes('cost')) {
                        reply = `[Bot]: "Offer prices starting ₹499. No hidden tax rates."`;
                      } else if (q.includes('3') || q.includes('where') || q.includes('location')) {
                        reply = `[Bot]: "Plot 24, 100 Feet Road, Indiranagar, Bengaluru. Map link: map.onlypage.in"`;
                      } else if (q.includes('4') || q.includes('book') || q.includes('appointment')) {
                        reply = `[Bot]: "Booking slot blocked on July 11th. Confirm name details to validate."`;
                      }
                      setWsTestLogs(prev => [...prev, reply]);
                    }, 1000);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type e.g. '1', 'pricing', 'where is the salon?' to test..."
                    value={wsTestQuery}
                    onChange={(e) => setWsTestQuery(e.target.value)}
                    className="flex-1 text-xs font-semibold px-4 h-11 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-5 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                  >
                    Test Query
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            9. BOOKINGS CALENDAR
            ========================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs select-none">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Booking Calendar Engine</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Schedule slots for local Doctors, Salons, Consultants</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setBookingModalOpen(true);
                    showToast('Opening quick book scheduler...');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Plus size={14} />
                  <span>Reserve Booking Slot</span>
                </button>
              </div>
            </div>

            {/* Quick schedule block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily calendar slots view list */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-4">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide">Today's Appointment Schedule</h3>
                </div>

                <div className="space-y-2.5">
                  {bookingsList.map((b, idx) => (
                    <div key={idx} className="p-4 border border-slate-200/80 bg-white hover:border-slate-350 transition-colors rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs flex flex-col items-center justify-center border border-indigo-100 shrink-0">
                          <Clock size={12} />
                          <span className="text-[8px] mt-0.5">{b.time}</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-extrabold text-slate-800">{b.name}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{b.service}  •  Staff: <span className="font-bold text-slate-700">{b.staff}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-amber-50 text-amber-700 border border-amber-150'
                        }`}>
                          {b.status}
                        </span>
                        <button
                          onClick={() => {
                            setBookingsList(bookingsList.filter(item => item.id !== b.id));
                            showToast('Cancelled appointment schedule slot');
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Hours configuration settings */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-5 select-none text-left">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide mb-1">Calendar configuration</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Set availability and working margins</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">Weekly timings</label>
                    <div className="flex items-center justify-between p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-xs font-semibold text-slate-700">
                      <span>Mon — Sat</span>
                      <span className="font-bold text-indigo-600">10:00 AM — 08:00 PM</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">Consultation Buffer limits</label>
                    <select className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 rounded-xl bg-white outline-none">
                      <option>15 Minutes interval</option>
                      <option>30 Minutes interval</option>
                      <option>60 Minutes interval</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reserve Modal */}
            <AnimatePresence>
              {bookingModalOpen && (
                <>
                  <div className="fixed inset-0 bg-slate-950/40 z-50 backdrop-blur-3xs" onClick={() => setBookingModalOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-55 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <h3 className="text-sm font-extrabold text-slate-800">Add Schedule Reservation</h3>
                      <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-slate-850 cursor-pointer">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Customer Full Name</label>
                        <input
                          type="text"
                          placeholder="Ravi Kumar"
                          value={newBookName}
                          onChange={(e) => setNewBookName(e.target.value)}
                          className="w-full text-xs font-semibold px-3 h-10 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Select Service</label>
                        <select
                          value={newBookService}
                          onChange={(e) => setNewBookService(e.target.value)}
                          className="w-full text-xs font-semibold px-3 h-10 border border-slate-200 bg-white rounded-xl outline-none"
                        >
                          <option>Haircut & Treatment</option>
                          <option>Organic Hydrating Facial</option>
                          <option>Nail Grooming Spa</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          if (!newBookName.trim()) return;
                          setBookingsList([...bookingsList, { id: 'b_' + Date.now(), name: newBookName, service: newBookService, time: newBookTime, date: 'Today', staff: 'Rathnavel K', status: 'Confirmed' }]);
                          setNewBookName('');
                          setBookingModalOpen(false);
                          showToast('Blocked slot inside active Booking calendar!');
                        }}
                        className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                      >
                        Create Appointment
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================
            10. ANALYTICS (VISITOR CONVERSION FUNNELS)
            ========================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Timeline Conversion Area */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Visitors Timeline engagement</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Comparing unique site visits to final form inquiries</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visitorsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="Visitors" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Conversion" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion Funnel display bar */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-5 select-none text-left">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide mb-1">Conversion Funnel</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Track drop-off leaks inside conversion points</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: '1,000 Visitors', percent: '100%', subtitle: 'Organic search, referrals, socials' },
                    { label: '200 Services Page', percent: '20%', subtitle: 'Interested in offerings list' },
                    { label: '50 Lead Captures', percent: '5%', subtitle: 'Submitted Booking forms' },
                    { label: '20 Active Customers', percent: '2%', subtitle: 'Checked out or visited site' }
                  ].map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-between mb-1 text-xs font-bold text-slate-700">
                        <span>{step.label}</span>
                        <span className="text-indigo-600 font-black">{step.percent}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: step.percent }} />
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{step.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            11. SEO MANAGER (DYNAMIC RING)
            ========================================= */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Score Display Circle */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Visual simulated circle indicator svg */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                    <circle cx="72" cy="72" r="60" stroke="#6366f1" strokeWidth="12" fill="transparent"
                      strokeDasharray="377"
                      strokeDashoffset={377 - (377 * seoScore) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-900 leading-none">{seoScore}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-wider">SEO Score</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold text-slate-800">Automatic schema tags working</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Subdomain optimization indices are perfectly robust</p>
                </div>

                {seoScore < 100 && (
                  <button
                    onClick={handleSeoFix}
                    disabled={fixingSeo}
                    className="px-5 h-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    {fixingSeo ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Applying AI fixes...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-indigo-300" />
                        <span>Fix with AI Copilot</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Score detailed checklist items */}
              <div className="lg:col-span-2 space-y-4 text-left select-none">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">SEO Diagnostics Checklist</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">List of verified semantic ranking optimization standards</p>
                </div>

                <div className="space-y-2">
                  {seoChecklist.map((item) => (
                    <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.status ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className="text-xs font-bold text-slate-700">{item.text}</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        item.status ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.status ? '✓ Optimised' : '✗ Correct with AI'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            12. MARKETING CENTER
            ========================================= */}
        {activeTab === 'marketing' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Campaign builder trigger */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Create Promotional Campaign</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Campaign Offer Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Diwali Special 30% Off"
                      value={newCampaignTitle}
                      onChange={(e) => setNewCampaignTitle(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 bg-white rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Target Channel</label>
                    <select
                      value={campaignChannel}
                      onChange={(e) => setCampaignChannel(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 bg-white rounded-xl outline-none"
                    >
                      <option>WhatsApp</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (!newCampaignTitle.trim()) return;
                      setCampaigns([...campaigns, { title: newCampaignTitle, channel: campaignChannel, sentTo: '450 Customers', status: 'Completed', conversion: '14%' }]);
                      setNewCampaignTitle('');
                      showToast(`Triggered promo push for ${newCampaignTitle}!`);
                    }}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Megaphone size={14} />
                    <span>Launch Campaign</span>
                  </button>
                </div>
              </div>

              {/* Campaigns tracking status list */}
              <div className="lg:col-span-2 space-y-3 select-none text-left">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide">Active Marketing Records</h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden">
                  {campaigns.map((camp, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-slate-800">{camp.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold">Targeted segment: {camp.sentTo} via <span className="text-indigo-600 font-extrabold">{camp.channel}</span></p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-600 bg-indigo-50/70 border border-indigo-150 rounded-md px-2.5 py-1">
                          Conv: {camp.conversion}
                        </span>
                        <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          camp.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            13. AI COPILOT GROWTH ASSISTANT
            ========================================= */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs flex flex-col justify-between h-[485px]">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">OnlyPage AI growth.ai copilot</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Type guidelines to construct promotional landing offers, coupons or schemas instantly</p>
            </div>

            {/* AI conversational sandbox logs */}
            <div className="flex-1 my-4 overflow-y-auto border border-slate-100 bg-slate-50/70 rounded-2xl p-4 space-y-3.5 scrollbar-thin flex flex-col">
              {aiChatLogs.map((log, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed relative ${
                    log.sender === 'user'
                      ? 'bg-indigo-600 text-white ml-auto align-self-end shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 mr-auto align-self-start shadow-3xs'
                  }`}
                >
                  <p>{log.text}</p>
                  {log.sender === 'ai' && i > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => {
                          const newBlock = { id: 'b_christmas', type: 'Hero', title: '🎄 Holiday Grand Christmas special', desc: 'Book online today and claim instant flat 25% off vouchers on hair treatments!' };
                          setBlocksInUse([...blocksInUse, newBlock]);
                          showToast('AI Landing block compiled & injected!');
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-black cursor-pointer transition-colors"
                      >
                        Deploy Landing Block
                      </button>
                      <button
                        onClick={() => {
                          setCampaigns([...campaigns, { title: 'Holiday Christmas 25% OFF', channel: 'WhatsApp', sentTo: '450 Customers', status: 'Scheduled', conversion: '--' }]);
                          showToast('Created WhatsApp campaign template.');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold cursor-pointer"
                      >
                        Create WhatsApp Campaign
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input prompts */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!aiInput.trim()) return;
                const prompt = aiInput;
                setAiChatLogs(prev => [...prev, { sender: 'user', text: prompt }]);
                setAiInput('');
                setAiLoading(true);

                setTimeout(() => {
                  setAiLoading(false);
                  let botText = `I have successfully compiled your instructions! Here is your generated Holiday template which you can deploy instantly:`;
                  if (prompt.toLowerCase().includes('seo')) {
                    botText = `Understood! I have computed meta descriptions & alt tags for your Hair therapy. Ready to push alt tags directly to visual SEO checklist parameters?`;
                  }
                  setAiChatLogs(prev => [...prev, { sender: 'ai', text: botText }]);
                }, 1500);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask Growth Copilot e.g. 'Make a Christmas offer of 25%'..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 text-xs font-semibold px-4 h-11 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="px-5 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {aiLoading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="text-indigo-300 fill-white/10" />
                    <span>Execute</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* =========================================
            14. AUTOMATION BUILDER (ZAPIER SIMPLE)
            ========================================= */}
        {activeTab === 'automations' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Visual Automation Workflows</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Simple Zapier/Make flow controllers to map triggers to events</p>
            </div>

            <div className="space-y-4">
              {automations.map((aut, idx) => (
                <div key={idx} className="p-4 border border-slate-200 bg-slate-50/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Mapping flowchart visualization items */}
                  <div className="flex flex-wrap items-center gap-2 font-bold text-xs">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                      WHEN
                    </span>
                    <span className="text-slate-800 font-black">{aut.trigger}</span>
                    <span className="text-slate-400 font-extrabold mx-1">→</span>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                      DO
                    </span>
                    <span className="text-slate-600 font-bold">{aut.action}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setAutomations(automations.map((item, i) => i === idx ? { ...item, status: !item.status } : item));
                        showToast(`Automation trigger ${!aut.status ? 'activated' : 'paused'}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-colors cursor-pointer ${
                        aut.status 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {aut.status ? '● Running' : '● Paused'}
                    </button>
                    <button
                      onClick={() => {
                        setAutomations(automations.filter((_, i) => i !== idx));
                        showToast('Removed automation flow template');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            15. FILE MANAGER
            ========================================= */}
        {activeTab === 'files' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Media & File Manager</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Asset manager that handles logos, PDF menus and portfolios</p>
              </div>

              {/* Upload simulation file trigger */}
              <button
                onClick={() => {
                  setFiles([...files, { name: 'new-uploaded-asset.png', type: 'Images', size: '180 KB', date: 'Just now' }]);
                  showToast('Successfully uploaded logo-asset to file catalog!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Plus size={14} />
                <span>Upload Media Asset</span>
              </button>
            </div>

            {/* Catalog list grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
              {files.map((file, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-indigo-300 transition-colors flex flex-col justify-between h-36">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 uppercase">
                      {file.type}
                    </span>
                    <button
                      onClick={() => {
                        setFiles(files.filter((_, i) => i !== idx));
                        showToast('Deleted file asset');
                      }}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-black text-slate-800 truncate leading-tight">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{file.size}  •  {file.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            16. REVIEWS MANAGER (GOOGLE REVIEWS)
            ========================================= */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Reviews & Local aggregate</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Track, monitor, and auto-reply to Google Review aggregates</p>
              </div>

              <div className="flex items-center gap-1.5 text-amber-500 text-sm font-extrabold bg-amber-50/60 px-4 py-1.5 rounded-full border border-amber-100 select-none">
                <span>★ 4.8 Stars Aggregate</span>
              </div>
            </div>

            <div className="space-y-4 select-none text-left">
              {reviewsList.map((rev, idx) => (
                <div key={idx} className="p-4 border border-slate-200 bg-slate-50/20 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-800">{rev.author}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{rev.date}</p>
                    </div>
                    <div className="text-amber-500 text-xs">
                      {'★'.repeat(Math.floor(rev.rating))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-bold leading-relaxed">{rev.comment}</p>

                  {/* AI drafting replies buttons */}
                  {rev.aiReplied ? (
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                      <p className="text-[9px] font-black text-indigo-900 uppercase">AI Copilot Draft Reply sent:</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-medium leading-relaxed">{rev.draftedReply}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updated = [...reviewsList];
                          updated[idx].aiReplied = true;
                          updated[idx].draftedReply = `Thank you ${rev.author} for sharing your precious experience! We appreciate your loyalty.`;
                          setReviewsList(updated);
                          showToast('AI reply drafted and sent to Google Maps API!');
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-black cursor-pointer transition-colors"
                      >
                        Suggest & Send AI response reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            17. APP MARKETPLACE INTEGRATIONS
            ========================================= */}
        {activeTab === 'integrations' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">OnlyPage App Marketplace</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Connect third party platforms directly to your subdomain presence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
              {integrationsList.map((app, idx) => {
                const Icon = app.icon;
                return (
                  <div key={idx} className="p-4 border border-slate-200 hover:border-slate-300 transition-colors rounded-2xl flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 shrink-0">
                        <Icon size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-slate-800">{app.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">{app.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const updated = [...integrationsList];
                        updated[idx].installed = !app.installed;
                        setIntegrationsList(updated);
                        showToast(`Successfully ${!app.installed ? 'installed' : 'uninstalled'} ${app.name}!`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase cursor-pointer transition-colors ${
                        app.installed 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {app.installed ? 'Installed' : 'Install App'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================
            18. SETTINGS
            ========================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Business settings</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage domain connectivity configurations and credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Business Registered Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 bg-slate-50/30 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Primary Support Hotline</label>
                  <input
                    type="text"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 h-10 border border-slate-200 bg-slate-50/30 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide block mb-1">Linked Subdomain Prefix</label>
                  <input
                    type="text"
                    disabled
                    value="studio46.onlypage.in"
                    className="w-full text-xs font-bold px-3.5 h-10 border border-slate-200 bg-slate-100 rounded-xl outline-none cursor-not-allowed text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-4 select-none">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="text-xs font-black text-slate-800">DNS CNAME Records</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Map custom domains easily from any DNS provider (GoDaddy, Cloudflare):</p>
                  <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl font-mono text-[9px] text-slate-600 space-y-1">
                    <p><span className="font-extrabold text-indigo-600">Type:</span> CNAME</p>
                    <p><span className="font-extrabold text-indigo-600">Name:</span> @</p>
                    <p><span className="font-extrabold text-indigo-600">Value:</span> host.onlypage.in</p>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Configurations saved successfully!')}
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-colors shadow-sm"
                >
                  Save Settings Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            19. BILLING SUBSCRIPTION
            ========================================= */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Billing Subscriptions</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage invoices, plan limits and subscription cycles</p>
              </div>

              <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-150 px-3.5 py-1.5 rounded-full select-none">
                Active Tier: {billingPlan}
              </span>
            </div>

            {/* Inner progress bars for limits usage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4 select-none">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide">Usage progress limits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Pages Compiled', val: '6/10 Pages used', percent: 60 },
                    { label: 'Staging Storage', val: '400MB / 1GB used', percent: 40 },
                    { label: 'WhatsApp SMS tokens', val: '750 / 1000 Sent', percent: 75 },
                    { label: 'AI Tokens credits', val: '25k / 100k words', percent: 25 }
                  ].map((lim, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>{lim.label}</span>
                        <span>{lim.val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${lim.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Print Receipt list */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-5 space-y-4 select-none text-left">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Recent Invoices</h3>
                <div className="divide-y divide-slate-200/80 text-[10px] font-bold">
                  {[
                    { ref: 'INV-2026-004', amount: '₹1,499', date: 'July 01, 2026' },
                    { ref: 'INV-2026-003', amount: '₹1,499', date: 'June 01, 2026' },
                    { ref: 'INV-2026-002', amount: '₹1,499', date: 'May 01, 2026' }
                  ].map((inv, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-slate-700 font-extrabold">{inv.ref}</p>
                        <p className="text-slate-400 font-medium">{inv.date}</p>
                      </div>
                      <button
                        onClick={() => showToast(`Printing receipt record ${inv.ref}`)}
                        className="text-indigo-600 hover:underline cursor-pointer"
                      >
                        Print Receipt {inv.amount}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
