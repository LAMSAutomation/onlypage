import React, { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle2, Users, Share2, ExternalLink, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReferralProps {
  siteId: string;
  businessName: string;
  onToast: (msg: string) => void;
}

interface ReferralRecord {
  id: string;
  referral_code: string;
  referred_email: string | null;
  status: string;
  reward_months: number;
  reward_given: boolean;
  created_at: string;
}

export function ReferralProgram({ siteId, businessName, onToast }: ReferralProps) {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralEmail, setReferralEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    if (!siteId) return;
    loadReferralData();
  }, [siteId]);

  const loadReferralData = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Load existing referrals
      const { data: refs } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setReferrals(refs || []);

      // Get or create referral code (stored in localStorage as fallback, or we can use user.id)
      let code = localStorage.getItem(`onlypage_refcode_${user.id}`);
      if (!code) {
        code = user.id.slice(0, 8).toUpperCase();
        localStorage.setItem(`onlypage_refcode_${user.id}`, code);
      }
      setReferralCode(code);
    } catch (e) {
      console.error('Failed to load referral data', e);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `https://onlypage.in?ref=${referralCode}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onToast('Referral link copied!');
    } catch {
      onToast('Could not copy. Select the link manually.');
    }
  };

  const sendInvite = async () => {
    if (!referralEmail.trim() || sendingInvite) return;
    setSendingInvite(true);
    try {
      // Save referral record
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not logged in');

      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_email: referralEmail.trim(),
          referral_code: referralCode,
          status: 'pending',
          reward_months: 1,
        });
      if (error) throw error;

      onToast(`Invite sent to ${referralEmail.trim()}! When they sign up, you both get 1 month free.`);
      setReferralEmail('');
      loadReferralData();
    } catch (err: any) {
      onToast('Error: ' + (err.message || 'Please try again'));
    } finally {
      setSendingInvite(false);
    }
  };

  const successCount = referrals.filter(r => r.status === 'converted' || r.status === 'rewarded').length;
  const pendingCount = referrals.filter(r => r.status === 'pending').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <Gift size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">Referral Program</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Invite a business, you both get 1 month free 🎉
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
          <p className="text-lg font-black text-emerald-700">{successCount}</p>
          <p className="text-[9px] font-bold text-emerald-600 mt-0.5">Converted</p>
        </div>
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
          <p className="text-lg font-black text-amber-700">{pendingCount}</p>
          <p className="text-[9px] font-bold text-amber-600 mt-0.5">Pending</p>
        </div>
        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
          <p className="text-lg font-black text-indigo-700">{successCount * 1}</p>
          <p className="text-[9px] font-bold text-indigo-600 mt-0.5">Free months</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
        <label className="text-xs font-bold text-slate-600 block mb-1.5">Your referral link</label>
        <div className="flex gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 text-[10px] font-mono font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-slate-600"
          />
          <button
            onClick={copyReferralLink}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer"
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Invite by email */}
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-600 block mb-1.5">
          Invite a business by email
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={referralEmail}
            onChange={(e) => setReferralEmail(e.target.value)}
            placeholder="friend@business.com"
            className="flex-1 text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
          />
          <button
            onClick={sendInvite}
            disabled={!referralEmail.trim() || sendingInvite}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Share2 size={14} />
            {sendingInvite ? 'Sending...' : 'Send invite'}
          </button>
        </div>
      </div>

      {/* Referral history */}
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
          Recent referrals
        </h4>
        <div className="space-y-1.5">
          {referrals.length === 0 ? (
            <p className="text-[10px] text-slate-400 text-center py-4 font-medium">
              No referrals yet. Share your link to start earning free months!
            </p>
          ) : (
            referrals.slice(0, 5).map(ref => (
              <div key={ref.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-700">
                    {ref.referred_email || 'Direct link'}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    {new Date(ref.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                  ref.status === 'rewarded' ? 'bg-emerald-50 text-emerald-700' :
                  ref.status === 'converted' ? 'bg-indigo-50 text-indigo-700' :
                  ref.status === 'signed_up' ? 'bg-blue-50 text-blue-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {ref.status === 'converted' || ref.status === 'rewarded' ? <CheckCircle2 size={9} /> : null}
                  {ref.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-100">
        <p className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles size={12} className="text-emerald-500" />
          How it works
        </p>
        <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
          Share your referral link. When a referred business signs up for a paid plan, you both get 1 month free on your current plan. No limit on referrals!
        </p>
      </div>
    </div>
  );
}

export default ReferralProgram;
