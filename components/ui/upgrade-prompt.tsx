import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, ArrowRight, Crown } from 'lucide-react';

interface UpgradePromptProps {
  /** The feature the user is trying to access */
  feature: string;
  /** Suggested plan to upgrade to ('Starter' or 'Business') */
  suggestedPlan?: string;
  /** Price display */
  price?: string;
  /** Action when user clicks upgrade */
  onUpgrade: () => void;
  /** Optional children to render behind the blur */
  children?: React.ReactNode;
  /** Whether to show children blurred behind the overlay */
  showBlurredPreview?: boolean;
}

export default function UpgradePrompt({
  feature,
  suggestedPlan = 'Starter',
  price = '₹399/mo',
  onUpgrade,
  children,
  showBlurredPreview = true,
}: UpgradePromptProps) {
  return (
    <div className="relative">
      {/* Blurred preview behind the paywall */}
      {showBlurredPreview && children && (
        <div className="pointer-events-none select-none blur-sm opacity-40">
          {children}
        </div>
      )}

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="bg-white/95 backdrop-blur-sm border border-indigo-100 rounded-2xl p-5 sm:p-6 text-center shadow-xl max-w-xs mx-auto"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-200">
            <Lock size={16} />
          </div>

          <h3 className="text-sm font-extrabold text-slate-900 mt-3">
            {feature}
          </h3>

          <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
            This feature is available on the <span className="font-extrabold text-indigo-600">{suggestedPlan}</span> plan and above.
          </p>

          <div className="mt-3 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            <Crown size={12} className="text-emerald-600" />
            <span className="text-[10px] font-extrabold text-emerald-700">
              From {price}
            </span>
          </div>

          <button
            onClick={onUpgrade}
            className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={12} />
            <span>Upgrade to {suggestedPlan}</span>
            <ArrowRight size={12} />
          </button>

          <p className="mt-2 text-[9px] text-slate-400 font-medium">
            No commitment. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Wraps content in a blur overlay if the plan doesn't include the feature.
 * Usage:
 *   <PlanGate feature="crm" onUpgrade={handleUpgrade}>
 *     <YourContent />
 *   </PlanGate>
 */
export function PlanGate({
  feature,
  onUpgrade,
  suggestedPlan,
  children,
}: {
  feature: string;
  onUpgrade: () => void;
  suggestedPlan?: string;
  children: React.ReactNode;
}) {
  return (
    <UpgradePrompt
      feature={feature}
      onUpgrade={onUpgrade}
      suggestedPlan={suggestedPlan}
    >
      {children}
    </UpgradePrompt>
  );
}
