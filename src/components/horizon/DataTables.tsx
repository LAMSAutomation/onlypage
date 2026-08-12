import React from 'react';
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react';

export interface HorizonTableProps {
  title?: string;
  subtitle?: string;
  styles?: any;
  block?: any;
}

interface Row {
  name: string;
  email: string;
  status: 'Completed' | 'In Progress' | 'Rejected';
  date: string;
  amount: string;
  trend: 'up' | 'down';
}

const DEFAULT_ROWS: Row[] = [
  { name: 'Horizon UI PRO', email: 'michael@horizon.com', status: 'Completed', date: 'Nov 23', amount: '+$345', trend: 'up' },
  { name: 'VueJS Templates', email: 'lana@vue.com', status: 'In Progress', date: 'Nov 22', amount: '+$112', trend: 'up' },
  { name: 'React Native UI', email: 'phoenix@react.com', status: 'Rejected', date: 'Nov 21', amount: '-$48', trend: 'down' },
  { name: 'Horizon UI Tailwind', email: 'olivia@tailwind.com', status: 'Completed', date: 'Nov 20', amount: '+$270', trend: 'up' },
  { name: 'OnlyPage Components', email: 'aisha@onlypage.com', status: 'Completed', date: 'Nov 19', amount: '+$199', trend: 'up' },
];

const STATUS_STYLES: Record<Row['status'], string> = {
  Completed: 'bg-emerald-500/15 text-emerald-400',
  'In Progress': 'bg-amber-500/15 text-amber-400',
  Rejected: 'bg-rose-500/15 text-rose-400',
};

export const HorizonTable: React.FC<HorizonTableProps> = ({
  title,
  subtitle,
  styles = {},
  block
}) => {
  const rows = block?.rows?.length ? block.rows : DEFAULT_ROWS;

  return (
    <section>
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl p-8 shadow-2xl"
          style={{ backgroundColor: styles.cardBgColor || '#111C44', boxShadow: styles.cardBorderColor ? `inset 0 0 0 1px ${styles.cardBorderColor}` : '0 25px 50px -12px rgba(11,20,55,0.4)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>{title || 'Check Table'}</h2>
              <p className="text-sm font-medium leading-relaxed mt-1" style={{ color: styles.subtitleColor || '#94a3b8' }}>{subtitle || 'Weekly activity overview'}</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: styles.accentColor || '#7551FF', color: '#ffffff' }}
            >
              {block?.btnText || 'View All'}
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: styles.cardBorderColor || 'rgba(255,255,255,0.1)' }}>
                  <th className="pb-4 pr-4 text-xs font-semibold uppercase tracking-wider" style={{ color: styles.subtitleColor || '#94a3b8' }}>{block?.col1 || 'Name'}</th>
                  <th className="pb-4 pr-4 text-xs font-semibold uppercase tracking-wider" style={{ color: styles.subtitleColor || '#94a3b8' }}>{block?.col2 || 'Status'}</th>
                  <th className="pb-4 pr-4 text-xs font-semibold uppercase tracking-wider" style={{ color: styles.subtitleColor || '#94a3b8' }}>{block?.col3 || 'Date'}</th>
                  <th className="pb-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: styles.subtitleColor || '#94a3b8' }}>{block?.col4 || 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any, idx: number) => {
                  const sStyle = STATUS_STYLES[row.status as keyof typeof STATUS_STYLES] || STATUS_STYLES.Completed;
                  return (
                    <tr key={row.email || row.id || idx} className="border-b transition-colors last:border-0 hover:bg-white/[0.03]" style={{ borderColor: styles.cardBorderColor || 'rgba(255,255,255,0.05)' }}>
                      <td className="py-4 pr-4">
                        <div className="text-sm font-medium" style={{ color: styles.textColor || '#ffffff' }}>{row.name}</div>
                        <div className="text-xs" style={{ color: styles.subtitleColor || '#64748b' }}>{row.email || row.desc}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${sStyle}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-sm" style={{ color: styles.subtitleColor || '#94a3b8' }}>{row.date}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm font-bold ${row.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {row.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {row.amount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
