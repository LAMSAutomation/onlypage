/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Send, CheckCheck, ShieldAlert, Sparkles, 
  CornerDownRight, Check, HelpCircle, PhoneCall
} from 'lucide-react';

interface WhatsAppSectionProps {
  businessName: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function WhatsAppSection({ businessName }: WhatsAppSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: `Hello! Welcome to our automated assistant channel. How can I help you today? You can ask me about our services, timings, location, or request a booking slot!`,
      timestamp: '10:42 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formattedName = businessName 
    ? businessName.charAt(0).toUpperCase() + businessName.slice(1) 
    : 'Our Studio';

  const SUGGESTED_QUERIES = [
    { label: 'Timings & Sunday hours?', q: 'What are your working hours? Are you open on Sunday?' },
    { label: 'Available services?', q: 'What services do you offer and what are the starting prices?' },
    { label: 'Book an appointment?', q: 'I would like to book an appointment for tomorrow afternoon.' },
    { label: 'Where are you located?', q: 'What is your address and how can I navigate there?' }
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateBotResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    
    if (q.includes('hour') || q.includes('time') || q.includes('sunday') || q.includes('open')) {
      return `Operating Hours for ${formattedName}: \n\n• Monday to Saturday: 10:00 AM — 8:00 PM\n• Sunday: 11:00 AM — 5:00 PM\n\nWould you like me to reserve a booking slot for this Sunday?`;
    }
    if (q.includes('service') || q.includes('price') || q.includes('offer') || q.includes('cost')) {
      return `Our premium offerings:\n\n1. Hair Styling & Treatments (Starting ₹499)\n2. Face Therapy & Organic Rejuvenation (Starting ₹899)\n3. Custom Nails & Artistry (Starting ₹299)\n\nLet me know which service interests you, and I can schedule it right away!`;
    }
    if (q.includes('book') || q.includes('appointment') || q.includes('reserve') || q.includes('slot')) {
      return `Sure! I can block a slot for you. Could you please share:\n\n1. Your preferred date/time\n2. Your full name\n\nOnce shared, I will instantly populate this in the ${formattedName} owner CRM.`;
    }
    if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('map')) {
      return `Address for ${formattedName}:\n\nWe are located at Plot 24, 100 Feet Road, Indiranagar, Bengaluru (Opposite Metro Pillar 140).\n\nLet me know if you need driving directions!`;
    }
    
    // Default reply
    return `Thank you for your message! \n\nAs the AI Assistant for ${formattedName}, I have matched your query against our official website parameters. \n\nCould you please clarify if you'd like to check services, timings, or book an appointment?`;
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg: ChatMessage = {
      id: 'user-' + Math.random(),
      sender: 'user',
      text: textToSend,
      timestamp: timeString,
      status: 'read'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate natural typing delay
    setTimeout(() => {
      const botReplyText = generateBotResponse(textToSend);
      const botMsg: ChatMessage = {
        id: 'bot-' + Math.random(),
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <section id="whatsapp" className="py-24 bg-white relative border-b border-slate-100 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-emerald-100/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Explanatory copy (5 Cols) */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
              Automated Operations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              An AI Assistant that works 24/7 on WhatsApp
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed font-sans">
              Connect your WhatsApp Business number in one click. Our system ingests your page copy, catalogs, and bookings to answer client queries, collect names/phone numbers, and push leads directly to your CRM automatically.
            </p>

            {/* Feature Checkmarks */}
            <div className="space-y-3 pt-2">
              {[
                { title: 'Zero setup required', desc: 'No coding, API tokens, or complex flowcharts.' },
                { title: 'Always in sync', desc: 'Modifying services in your builder updates your bot instantly.' },
                { title: 'Direct lead generation', desc: 'Saves names, phone numbers, and timings straight to database.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-600 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{item.title}:</span>{' '}
                    <span>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: High-Fidelity Phone Chat Mockup (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Phone Case Frame */}
            <div className="w-full max-w-sm bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800/80 aspect-[9/18] relative overflow-hidden flex flex-col">
              
              {/* Phone Camera Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-10"></div>
                <div className="w-8 h-1 bg-slate-800 rounded-full ml-2"></div>
              </div>

              {/* Phone Screen Container */}
              <div className="w-full h-full bg-slate-100 rounded-[30px] overflow-hidden flex flex-col justify-between pt-6 relative">
                
                {/* WhatsApp Chat Header */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between relative z-20 shadow-md">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white select-none shadow-xs">
                      <Sparkles size={14} className="fill-white/20 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-100 truncate max-w-[130px]">
                        {formattedName} Assistant
                      </h4>
                      <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        online
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-300">
                    <PhoneCall size={14} className="hover:text-white cursor-pointer" />
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">AI</div>
                  </div>
                </div>

                {/* WhatsApp Chat Body Wallpaper Pattern */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col bg-[#e5ddd5] grid-pattern-subtle relative z-10 max-h-[380px]">
                  
                  {/* Encryption Badge banner */}
                  <div className="mx-auto bg-amber-50/90 text-amber-900 border border-amber-100 p-1.5 rounded-lg text-[9px] text-center max-w-[90%] font-semibold shadow-3xs">
                    🔒 Messages and calls are end-to-end encrypted. No third-party can read them.
                  </div>

                  {messages.map((m) => {
                    const isBot = m.sender === 'bot';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[85%] ${
                          isBot ? 'self-start' : 'self-end'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl text-xs font-semibold relative shadow-3xs leading-relaxed whitespace-pre-wrap ${
                            isBot
                              ? 'bg-white text-slate-800 rounded-tl-none'
                              : 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                          }`}
                        >
                          {m.text}
                          
                          {/* Message Time and Status indicators inside bubble */}
                          <div className="mt-1 flex items-center justify-end space-x-1 text-[8px] text-slate-400 font-mono font-medium select-none">
                            <span>{m.timestamp}</span>
                            {!isBot && (
                              <CheckCheck size={11} className="text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator Bubble */}
                  {isTyping && (
                    <div className="self-start bg-white p-2.5 rounded-xl rounded-tl-none shadow-3xs flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips (Toggles within device screen bottom) */}
                <div className="bg-slate-100/90 border-t border-slate-200 p-2 space-y-1.5 relative z-20">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left">Quick Enquiries:</p>
                  <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {SUGGESTED_QUERIES.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(chip.q)}
                        className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-full px-2.5 py-1 text-[9px] font-bold text-slate-600 shrink-0 shadow-3xs cursor-pointer active:scale-95 transition-transform"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Message Input Bar */}
                <div className="bg-slate-100 p-2 border-t border-slate-200 flex items-center gap-1.5 relative z-20 rounded-b-[24px]">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                    placeholder="Type your question..."
                    className="flex-1 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-300 focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleSend(inputText)}
                    className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
                  >
                    <Send size={12} className="ml-0.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* Verification prompt */}
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles size={12} className="text-emerald-500" />
              <span>Click any suggested chip above to test bot answers live!</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
