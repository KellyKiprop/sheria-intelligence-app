import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AlertTriangle, TrendingUp, Building, MapPin, FileText, Clock } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import TickerTape from '../components/TickerTape';

const TICKER_ITEMS = [
  'TOTAL PUBLIC FUNDS FLAGGED',
  'KES 92.56 BILLION',
  'USD 717 MILLION',
  '22 AUDIT FINDINGS',
  '47 COUNTIES AFFECTED',
  '79 BUDGET RECORDS',
  'SOURCE: AUDITOR GENERAL 2022/23 – 2023/24',
];

const MINISTRY_DATA = [
  { name: 'Ministry of Health', amount: 18.4, short: 'Health' },
  { name: 'Ministry of Education', amount: 14.2, short: 'Education' },
  { name: 'Ministry of Infrastructure', amount: 12.8, short: 'Infrastructure' },
  { name: 'Ministry of Agriculture', amount: 9.6, short: 'Agriculture' },
  { name: 'Ministry of Finance', amount: 8.1, short: 'Finance' },
  { name: 'Ministry of Interior', amount: 7.3, short: 'Interior' },
  { name: 'Ministry of Energy', amount: 6.9, short: 'Energy' },
];

const COUNTY_DATA = [
  { name: 'Nairobi', amount: 8.2 },
  { name: 'Mombasa', amount: 6.1 },
  { name: 'Kiambu', amount: 5.8 },
  { name: 'Nakuru', amount: 5.2 },
  { name: 'Turkana', amount: 4.9 },
  { name: 'Kisumu', amount: 4.3 },
  { name: 'Machakos', amount: 3.8 },
  { name: 'Kakamega', amount: 3.5 },
  { name: 'Kilifi', amount: 3.1 },
  { name: 'Bungoma', amount: 2.9 },
];

const FINDING_TYPES = [
  { name: 'Unsupported Payments', value: 32, color: '#EF4444' },
  { name: 'Procurement Irregularities', value: 28, color: '#F59E0B' },
  { name: 'Unaccounted Funds', value: 22, color: '#D4A017' },
  { name: 'Budget Overruns', value: 10, color: '#6B7280' },
  { name: 'Other', value: 8, color: '#374151' },
];

const RESOLUTION_STATUS = [
  { name: 'Unresolved', value: 68, color: '#EF4444' },
  { name: 'Partially Resolved', value: 21, color: '#F59E0B' },
  { name: 'Resolved', value: 11, color: '#22C55E' },
];

const ABSORPTION_DATA = [
  { name: 'Health', allocated: 42, absorbed: 38 },
  { name: 'Education', allocated: 58, absorbed: 52 },
  { name: 'Infrastructure', allocated: 35, absorbed: 28 },
  { name: 'Agriculture', allocated: 22, absorbed: 19 },
  { name: 'Energy', allocated: 18, absorbed: 12 },
  { name: 'Interior', allocated: 30, absorbed: 27 },
];

const PROCUREMENT_DATA = [
  { id: 'P-001', entity: 'Ministry of Health', description: 'Medical supplies tender', amount: 4.2, status: 'HIGH', finding: 'Single-sourced without justification' },
  { id: 'P-002', entity: 'Nairobi County', description: 'Road works contract', amount: 3.8, status: 'HIGH', finding: 'Inflated unit rates' },
  { id: 'P-003', entity: 'Ministry of Education', description: 'Textbook procurement', amount: 2.9, status: 'HIGH', finding: 'Payments without delivery confirmation' },
  { id: 'P-004', entity: 'Ministry of Infrastructure', description: 'Consultancy services', amount: 2.1, status: 'MEDIUM', finding: 'Contract awarded to related party' },
  { id: 'P-005', entity: 'Mombasa County', description: 'IT equipment', amount: 1.8, status: 'MEDIUM', finding: 'No competitive tendering' },
  { id: 'P-006', entity: 'Ministry of Agriculture', description: 'Fertilizer subsidy', amount: 1.5, status: 'MEDIUM', finding: 'Beneficiary list unverified' },
  { id: 'P-007', entity: 'Ministry of Energy', description: 'Solar project', amount: 0.9, status: 'LOW', finding: 'Minor documentation gaps' },
];

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0D1F17] border border-[#D4A017]/30 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-[#A8C4B4] text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-code text-sm">
          {p.name ? <span className="text-[#A8C4B4] mr-2">{p.name}:</span> : null}
          KES {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}B
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0D1F17] border border-[#D4A017]/30 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-white font-code text-sm">{payload[0].name}: {payload[0].value}%</p>
    </div>
  );
};

export default function FinanceAudit() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#0D1F17] grain-texture pt-16">
      {/* Ticker tape */}
      <TickerTape items={TICKER_ITEMS} speed={35} />

      {/* Hero counters */}
      <section ref={heroRef} className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4A017]/3 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <AlertTriangle size={14} className="text-[#EF4444]" />
            <span className="text-[#EF4444] text-xs uppercase tracking-widest font-code">
              Live Audit Data
            </span>
          </motion.div>

          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mb-2">
            Kenya Public Finance Audit Dashboard
          </h1>
          <div className="gold-divider max-w-xs mx-auto my-6" />

          {/* Big counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="font-code text-5xl sm:text-6xl font-bold text-gradient-gold mb-2">
                KES <AnimatedCounter target={92.56} decimals={2} duration={2500} />B
              </div>
              <p className="text-[#6B8F7A] text-sm uppercase tracking-widest">Total Flagged Funds</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="text-center"
            >
              <div className="font-code text-5xl sm:text-6xl font-bold text-white mb-2">
                USD <AnimatedCounter target={717} duration={2500} suffix="M" />
              </div>
              <p className="text-[#6B8F7A] text-sm uppercase tracking-widest">USD Equivalent</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="font-code text-5xl sm:text-6xl font-bold text-[#F59E0B] mb-2">
                KSh <AnimatedCounter target={1847} duration={2500} />
              </div>
              <p className="text-[#6B8F7A] text-sm uppercase tracking-widest">Per Kenyan Citizen</p>
            </motion.div>
          </div>

          {/* Source note */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] pulse-dot" />
            <p className="text-[#6B8F7A] text-xs">
              Based on 2022/23 – 2023/24 Auditor General Reports
            </p>
          </div>
        </div>
      </section>

      <div className="gold-divider max-w-4xl mx-auto px-4" />

      {/* Charts grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Ministry flagged funds */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <Building size={16} className="text-[#D4A017]" />
              <h3 className="font-display text-white font-semibold">Top Ministries — Flagged Funds (KES B)</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MINISTRY_DATA} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6B8F7A', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="short" tick={{ fill: '#A8C4B4', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,160,23,0.05)' }} />
                <Bar dataKey="amount" fill="#D4A017" radius={[0, 4, 4, 0]} barSize={22}>
                  {MINISTRY_DATA.map((_, i) => (
                    <Cell key={i} fill={`rgba(212,160,23,${1 - i * 0.1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* County flagged funds */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={16} className="text-[#22C55E]" />
              <h3 className="font-display text-white font-semibold">Top Counties — Flagged Funds (KES B)</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={COUNTY_DATA} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6B8F7A', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#A8C4B4', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34,197,94,0.05)' }} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={18}>
                  {COUNTY_DATA.map((_, i) => (
                    <Cell key={i} fill={`rgba(34,197,94,${1 - i * 0.08})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Finding types donut */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <FileText size={16} className="text-[#F59E0B]" />
              <h3 className="font-display text-white font-semibold">Audit Finding Types</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={FINDING_TYPES}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {FINDING_TYPES.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#A8C4B4', fontSize: 12 }}>{value}</span>}
                  iconSize={10}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Resolution status donut */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={16} className="text-[#EF4444]" />
              <h3 className="font-display text-white font-semibold">Audit Resolution Status</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={RESOLUTION_STATUS}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {RESOLUTION_STATUS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#A8C4B4', fontSize: 12 }}>{value}</span>}
                  iconSize={10}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {RESOLUTION_STATUS.map((s) => (
                <div key={s.name} className="text-center">
                  <div className="font-code text-xl font-bold" style={{ color: s.color }}>{s.value}%</div>
                  <div className="text-[#6B8F7A] text-xs">{s.name}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <div className="gold-divider max-w-4xl mx-auto px-4" />

      {/* Absorption rate */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={16} className="text-[#22C55E]" />
              <h3 className="font-display text-white font-semibold">Budget Absorption Rate by Ministry (KES B)</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ABSORPTION_DATA} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#A8C4B4', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B8F7A', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend
                  formatter={(value) => <span style={{ color: '#A8C4B4', fontSize: 12 }}>{value === 'allocated' ? 'Allocated' : 'Absorbed'}</span>}
                />
                <Bar dataKey="allocated" name="allocated" fill="rgba(212,160,23,0.3)" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="absorbed" name="absorbed" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Procurement table */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle size={16} className="text-[#EF4444]" />
              <h3 className="font-display text-white font-semibold">Procurement Irregularities</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-[#6B8F7A] font-medium text-xs uppercase tracking-wider">Ref</th>
                    <th className="text-left py-2 pr-4 text-[#6B8F7A] font-medium text-xs uppercase tracking-wider">Entity</th>
                    <th className="text-left py-2 pr-4 text-[#6B8F7A] font-medium text-xs uppercase tracking-wider hidden md:table-cell">Description</th>
                    <th className="text-right py-2 pr-4 text-[#6B8F7A] font-medium text-xs uppercase tracking-wider">Amount (B)</th>
                    <th className="text-left py-2 text-[#6B8F7A] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Finding</th>
                    <th className="text-center py-2 text-[#6B8F7A] font-medium text-xs uppercase tracking-wider">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCUREMENT_DATA.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        row.status === 'HIGH' ? 'bg-[#EF4444]/5' : ''
                      }`}
                    >
                      <td className="py-3 pr-4 font-code text-[#6B8F7A] text-xs">{row.id}</td>
                      <td className="py-3 pr-4 text-[#A8C4B4] font-medium">{row.entity}</td>
                      <td className="py-3 pr-4 text-[#6B8F7A] text-xs hidden md:table-cell">{row.description}</td>
                      <td className="py-3 pr-4 text-right font-code text-white font-medium">
                        KES {row.amount.toFixed(1)}B
                      </td>
                      <td className="py-3 pr-4 text-[#6B8F7A] text-xs hidden lg:table-cell">{row.finding}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.status === 'HIGH'
                              ? 'bg-[#EF4444]/20 text-[#EF4444]'
                              : row.status === 'MEDIUM'
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                              : 'bg-[#22C55E]/20 text-[#22C55E]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Disclaimer CTA */}
      <section className="py-12 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="border border-[#D4A017]/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#D4A017]/3" />
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle size={18} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-[#D4A017] font-semibold text-lg mb-2">Data Source Disclaimer</h4>
                  <p className="text-[#A8C4B4] text-sm leading-relaxed">
                    This data is sourced from the Office of the Controller of Budget and the Auditor General of Kenya.
                    All figures are directional and compiled for public intelligence purposes.
                    <strong className="text-[#D4A017]"> Verify against official PDF reports before citation.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
