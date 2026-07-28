import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash, Play, Pause, CheckCircle2, Clock, Users, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface EmailDripProps {
  siteId: string;
  businessName: string;
  onToast: (msg: string) => void;
}

interface SequenceStep {
  id: string;
  delayDays: number;
  subject: string;
  body: string;
  enabled: boolean;
}

interface Sequence {
  id: string;
  name: string;
  target: 'all_free' | 'trial_ending' | 'new_signup';
  steps: SequenceStep[];
  active: boolean;
}

const DEFAULT_SEQUENCES: Sequence[] = [
  {
    id: 'welcome',
    name: 'Welcome & Onboarding',
    target: 'new_signup',
    active: true,
    steps: [
      { id: 'w1', delayDays: 0, subject: 'Welcome to {{business}}! 🎉 Here\'s your next step', enabled: true,
        body: 'Hi there,\n\nWelcome to {{business}}! Your page is live at {{site_url}}.\n\nHere are 3 things to do next:\n1. Add your services/products\n2. Share your page on WhatsApp\n3. Set up your booking form\n\nNeed help? Just reply to this email!\n\n— The OnlyPage Team' },
      { id: 'w2', delayDays: 2, subject: 'See who\'s viewing your page 📊', enabled: true,
        body: 'Hi,\n\nQuick tip: Did you know you can see how many people visit your page?\n\nCheck the Analytics tab in your dashboard to see:\n• Total visitors\n• Lead captures\n• Popular pages\n\nUpgrade to Starter (₹399/mo) to unlock full analytics with visitor details.\n\n— The OnlyPage Team' },
      { id: 'w3', delayDays: 5, subject: 'Your free trial is halfway! Don\'t lose your progress ⏰', enabled: true,
        body: 'Hi,\n\nYou\'re halfway through your free trial! Here\'s what you\'ll lose when it ends:\n• Extra pages (only 1 stays)\n• Lead details (become locked)\n• WhatsApp button\n• Custom domain\n\nKeep everything by subscribing at just ₹399/mo.\n\n👉 [Upgrade now]({{upgrade_url}})\n\n— The OnlyPage Team' },
    ],
  },
  {
    id: 'trial_end',
    name: 'Trial Ending Soon',
    target: 'trial_ending',
    active: true,
    steps: [
      { id: 't1', delayDays: -3, subject: '3 days left in your trial! ⏳', enabled: true,
        body: 'Hi,\n\nYour free trial ends in 3 days. After that:\n❌ Extra pages become hidden\n❌ Lead details are locked\n❌ WhatsApp button stops working\n\nSubscribe now to keep everything:\n👉 [Keep my features]({{upgrade_url}})\n\n— The OnlyPage Team' },
      { id: 't2', delayDays: 0, subject: 'Your trial has ended — but it\'s not too late 🔄', enabled: true,
        body: 'Hi,\n\nYour free trial has ended. You\'re now on the Free plan with limited features.\n\nWant full access back? Upgrade to Starter (₹399/mo) and unlock:\n✓ Unlimited pages\n✓ Full lead view\n✓ WhatsApp & booking\n✓ Custom domain\n\n👉 [Reactivate now]({{upgrade_url}})\n\n— The OnlyPage Team' },
    ],
  },
  {
    id: 'downgrade',
    name: 'Post-Downgrade Recovery',
    target: 'all_free',
    active: true,
    steps: [
      { id: 'd1', delayDays: 0, subject: 'You\'re now on Free — here\'s what changed', enabled: true,
        body: 'Hi,\n\nYour plan has been updated to Free. Here\'s what changed:\n• Only 1 page remains active\n• Lead details are now locked\n• WhatsApp & booking are disabled\n\nReady to unlock everything again?\n👉 [Upgrade to Starter — ₹399/mo]({{upgrade_url}})\n\n— The OnlyPage Team' },
      { id: 'd2', delayDays: 7, subject: 'Don\'t leave your growth behind! 🚀', enabled: true,
        body: 'Hi,\n\nIt\'s been a week since you downgraded. Your page is still live, but you\'re missing out on:\n• New leads coming in (you can\'t see them!)\n• WhatsApp enquiries going unanswered\n• Booking requests piling up\n\nUpgrade now and get back to growing your business:\n👉 [Upgrade now]({{upgrade_url}})\n\n— The OnlyPage Team' },
    ],
  },
];

export function EmailDrip({ siteId, businessName, onToast }: EmailDripProps) {
  const [sequences, setSequences] = useState<Sequence[]>(() => {
    const saved = localStorage.getItem(`onlypage_drip_${siteId}`);
    return saved ? JSON.parse(saved) : DEFAULT_SEQUENCES;
  });
  const [expandedSequence, setExpandedSequence] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<{ seqId: string; stepId: string } | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  useEffect(() => {
    localStorage.setItem(`onlypage_drip_${siteId}`, JSON.stringify(sequences));
  }, [sequences, siteId]);

  const toggleSequence = (seqId: string) => {
    setSequences(prev => prev.map(s => s.id === seqId ? { ...s, active: !s.active } : s));
    const seq = sequences.find(s => s.id === seqId);
    onToast(seq?.active ? `Paused "${seq.name}" sequence` : `Activated "${seq?.name}" sequence`);
  };

  const toggleStep = (seqId: string, stepId: string) => {
    setSequences(prev => prev.map(s => ({
      ...s,
      steps: s.steps.map(st => st.id === stepId ? { ...st, enabled: !st.enabled } : st),
    })));
  };

  const startEditStep = (seqId: string, stepId: string) => {
    const seq = sequences.find(s => s.id === seqId);
    const step = seq?.steps.find(s => s.id === stepId);
    if (step) {
      setEditingStep({ seqId, stepId });
      setEditSubject(step.subject);
      setEditBody(step.body);
    }
  };

  const saveEditStep = () => {
    if (!editingStep) return;
    setSequences(prev => prev.map(s => ({
      ...s,
      steps: s.steps.map(st => st.id === editingStep.stepId ? {
        ...st,
        subject: editSubject,
        body: editBody,
      } : st),
    })));
    setEditingStep(null);
    onToast('Email step updated!');
  };

  const addStep = (seqId: string) => {
    setSequences(prev => prev.map(s => {
      if (s.id !== seqId) return s;
      const newStep: SequenceStep = {
        id: `step_${Date.now()}`,
        delayDays: s.steps.length > 0 ? s.steps[s.steps.length - 1].delayDays + 3 : 0,
        subject: 'Follow-up from {{business}}',
        body: 'Hi,\n\nJust checking in! Your page is live and growing.\n\nNeed any help setting things up?\n\n— The OnlyPage Team',
        enabled: true,
      };
      return { ...s, steps: [...s.steps, newStep] };
    }));
    onToast('New email step added!');
  };

  const removeStep = (seqId: string, stepId: string) => {
    setSequences(prev => prev.map(s => ({
      ...s,
      steps: s.steps.filter(st => st.id !== stepId),
    })));
  };

  const resetToDefault = () => {
    setSequences(DEFAULT_SEQUENCES);
    localStorage.setItem(`onlypage_drip_${siteId}`, JSON.stringify(DEFAULT_SEQUENCES));
    onToast('Reset to default email sequences!');
  };

  const delayLabel = (days: number) => {
    if (days === 0) return 'Immediate';
    if (days < 0) return `${Math.abs(days)} days before`;
    return `${days} days after`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Mail size={16} className="text-indigo-500" />
            Onboarding Email Sequences
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Automated emails to convert free users to paid subscribers
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-[10px] font-extrabold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
        >
          Reset to default
        </button>
      </div>

      <div className="space-y-4">
        {sequences.map(seq => (
          <div key={seq.id} className="rounded-2xl border border-slate-200 overflow-hidden">
            {/* Sequence header */}
            <div
              className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 cursor-pointer transition-colors"
              onClick={() => setExpandedSequence(expandedSequence === seq.id ? null : seq.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  seq.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {seq.target === 'new_signup' ? <Sparkles size={16} /> : 
                   seq.target === 'trial_ending' ? <Clock size={16} /> : <Users size={16} />}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">{seq.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {seq.steps.filter(s => s.enabled).length} active emails · Triggers on <strong className="text-slate-600">{seq.target.replace('_', ' ')}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSequence(seq.id); }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                    seq.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {seq.active ? <><Play size={10} /> Active</> : <><Pause size={10} /> Paused</>}
                </button>
              </div>
            </div>

            {/* Expanded steps */}
            {expandedSequence === seq.id && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
                {seq.steps.map((step, idx) => (
                  <div key={step.id} className="bg-white rounded-xl border border-slate-200 p-3">
                    {editingStep?.seqId === seq.id && editingStep?.stepId === step.id ? (
                      /* Edit mode */
                      <div className="space-y-2">
                        <input
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                        <textarea
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          rows={4}
                          className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={saveEditStep} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-extrabold cursor-pointer">Save</button>
                          <button onClick={() => setEditingStep(null)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-500 cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              Step {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {delayLabel(step.delayDays)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[200px]">
                              {step.subject}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleStep(seq.id, step.id)}
                              className={`p-1.5 rounded-lg ${step.enabled ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'} cursor-pointer`}
                            >
                              {step.enabled ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            </button>
                            <button
                              onClick={() => startEditStep(seq.id, step.id)}
                              className="p-1.5 rounded-lg text-indigo-600 bg-indigo-50 cursor-pointer hover:bg-indigo-100"
                            >
                              <Mail size={12} />
                            </button>
                            {seq.steps.length > 1 && (
                              <button
                                onClick={() => removeStep(seq.id, step.id)}
                                className="p-1.5 rounded-lg text-rose-500 bg-rose-50 cursor-pointer hover:bg-rose-100"
                              >
                                <Trash size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addStep(seq.id)}
                  className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-extrabold text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={12} />
                  Add email step
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
        <p className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
          <Zap size={12} className="text-indigo-500" />
          Email automation
        </p>
        <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
          These sequences run automatically. Emails are sent from the platform using your business name. Customize the subject and body for each step. Steps marked with <CheckCircle2 size={9} className="inline text-emerald-500" /> are active.
        </p>
      </div>
    </div>
  );
}

export default EmailDrip;
