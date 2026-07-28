import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Users, Clock, CheckCircle2, X, Loader2, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BroadcastProps {
  siteId: string;
  onToast: (msg: string) => void;
}

interface Contact {
  id: string;
  name: string | null;
  phone: string | null;
}

interface BroadcastHistory {
  id: string;
  message: string;
  status: string;
  target_count: number;
  sent_count: number;
  created_at: string;
}

export function WhatsAppBroadcast({ siteId, onToast }: BroadcastProps) {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<BroadcastHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Load contacts with valid phones
  useEffect(() => {
    if (!siteId) return;
    (async () => {
      const { data } = await supabase
        .from('leads')
        .select('id, name, phone')
        .eq('site_id', siteId)
        .not('phone', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100);
      setContacts(data || []);
    })();
  }, [siteId]);

  // Load broadcast history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`onlypage_broadcast_${siteId}`);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, [siteId]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(contacts.map(c => c.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleContact = (id: string) => {
    setSelectedContactIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const sendBroadcast = async () => {
    if (!broadcastMessage.trim() || selectedContactIds.length === 0 || sending) return;
    setSending(true);

    const selected = contacts.filter(c => selectedContactIds.includes(c.id));
    let sentCount = 0;

    for (const contact of selected) {
      if (!contact.phone) continue;
      // Store as a pending delivery record
      const { error } = await supabase
        .from('whatsapp_deliveries')
        .insert({
          site_id: siteId,
          lead_id: contact.id,
          phone: contact.phone,
          message: broadcastMessage.trim(),
          trigger: 'broadcast',
          status: 'queued',
          locale: 'English',
        });
      if (!error) sentCount++;
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 100));
    }

    // Save to local history
    const entry: BroadcastHistory = {
      id: Date.now().toString(),
      message: broadcastMessage.trim(),
      status: sentCount === selected.length ? 'completed' : 'partial',
      target_count: selected.length,
      sent_count: sentCount,
      created_at: new Date().toISOString(),
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem(`onlypage_broadcast_${siteId}`, JSON.stringify(updated));

    if (sentCount > 0) {
      onToast(`Broadcast queued for ${sentCount} contact${sentCount === 1 ? '' : 's'}!`);
    } else {
      onToast('No messages could be queued. Check contact numbers.');
    }

    setBroadcastMessage('');
    setSelectedContactIds([]);
    setSelectAll(false);
    setSending(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Send size={16} className="text-emerald-500" />
            WhatsApp Broadcast
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Send a bulk message to selected leads with valid WhatsApp numbers
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
              activeTab === 'compose' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
              activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            History ({history.length})
          </button>
        </div>
      </div>

      {activeTab === 'compose' ? (
        <div className="space-y-4">
          {/* Contact selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Users size={13} />
                Recipients ({selectedContactIds.length} selected)
              </label>
              <button
                onClick={toggleSelectAll}
                className="text-[10px] font-extrabold text-indigo-600 hover:underline"
              >
                {selectAll ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <p className="px-3 py-4 text-[10px] text-slate-400 text-center font-medium">
                  No contacts with phone numbers yet. Capture some leads first!
                </p>
              ) : (
                contacts.map(contact => (
                  <label
                    key={contact.id}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContactIds.includes(contact.id)}
                      onChange={() => toggleContact(contact.id)}
                      className="accent-indigo-600 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {contact.name || 'Unknown'}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">{contact.phone}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Message composer */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              Message
            </label>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type your broadcast message here... Use {{name}} to personalise."
              rows={4}
              maxLength={4096}
              className="w-full text-xs font-medium px-3.5 py-2.5 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 resize-none placeholder:text-slate-300"
            />
            <p className="text-[9px] text-slate-400 mt-1 font-medium">
              {broadcastMessage.length}/4096 characters
            </p>
          </div>

          {/* Send button */}
          <button
            onClick={sendBroadcast}
            disabled={!broadcastMessage.trim() || selectedContactIds.length === 0 || sending}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {sending ? (
              <><Loader2 size={15} className="animate-spin" /> Queuing messages...</>
            ) : (
              <><Send size={15} /> Send to {selectedContactIds.length} contact{selectedContactIds.length === 1 ? '' : 's'}</>
            )}
          </button>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-amber-800">WhatsApp broadcast limits</p>
                <p className="text-[9px] text-amber-700 mt-0.5 leading-tight">
                  Messages are sent one at a time with a small delay. For large broadcasts, connect an Evolution API instance. Message delivery depends on the recipient's WhatsApp settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History tab */
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400 font-medium">
              No broadcasts sent yet.
            </p>
          ) : (
            history.map(entry => (
              <div key={entry.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    entry.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {entry.status === 'completed' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    {entry.status === 'completed' ? 'Completed' : 'Partial'}
                  </span>
                  <span className="text-[9px] text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-[10px] text-slate-600 font-medium line-clamp-2">{entry.message}</p>
                <p className="text-[9px] text-slate-400 mt-1">
                  {entry.sent_count}/{entry.target_count} sent
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default WhatsAppBroadcast;
