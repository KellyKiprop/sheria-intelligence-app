import { motion } from 'framer-motion';
import { Scale, BarChart2, Briefcase, MapPin, Building2, ExternalLink, AlertTriangle } from 'lucide-react';
import CoatOfArms from '../components/CoatOfArms';

const ACTS = [
  {
    id: 'employment',
    name: 'Employment Act, 2007',
    domain: 'Employment',
    domainColor: '#22C55E',
    description: 'Governs the employment relationship, including contracts, termination, wages, leave, and disciplinary procedures.',
    url: 'https://kenyalaw.org',
    provisions: 64,
  },
  {
    id: 'labour-relations',
    name: 'Labour Relations Act, 2007',
    domain: 'Employment',
    domainColor: '#22C55E',
    description: 'Regulates trade unions, collective bargaining, labour disputes, and the right to strike in Kenya.',
    url: 'https://kenyalaw.org',
    provisions: 103,
  },
  {
    id: 'land-act',
    name: 'Land Act, 2012',
    domain: 'Land',
    domainColor: '#D4A017',
    description: 'Provides for the management and administration of land in Kenya, including public, community, and private land.',
    url: 'https://kenyalaw.org',
    provisions: 162,
  },
  {
    id: 'land-registration',
    name: 'Land Registration Act, 2012',
    domain: 'Land',
    domainColor: '#D4A017',
    description: 'Governs the registration of land in Kenya, providing certainty of title and protection of registered interests.',
    url: 'https://kenyalaw.org',
    provisions: 85,
  },
  {
    id: 'companies',
    name: 'Companies Act, 2015',
    domain: 'Business',
    domainColor: '#3B82F6',
    description: 'Regulates the formation, management, and dissolution of companies in Kenya, replacing the Companies Act Cap 486.',
    url: 'https://kenyalaw.org',
    provisions: 1020,
  },
  {
    id: 'bba',
    name: 'Business Registration Service Act, 2015',
    domain: 'Business',
    domainColor: '#3B82F6',
    description: 'Establishes the Business Registration Service and regulates business name registration and related matters.',
    url: 'https://kenyalaw.org',
    provisions: 42,
  },
];

const PILLARS = [
  {
    icon: Scale,
    title: 'Legal Research Engine',
    color: '#22C55E',
    description: 'Sheria indexes Kenyan primary legislation across key domains. Using semantic search and AI synthesis, it retrieves and explains relevant provisions in plain language — making the law accessible to every Kenyan, not just advocates.',
  },
  {
    icon: BarChart2,
    title: 'Public Finance Intelligence',
    color: '#D4A017',
    description: 'The Finance Audit module aggregates and visualizes audit findings from the Auditor General and Controller of Budget. It translates dense PDF reports into interactive dashboards, enabling citizens, journalists, and policymakers to track accountability.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#F9F7F4] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#E8E4DE] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CoatOfArms size={72} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1B4332] mb-4">
            About Sheria Intelligence
          </h1>
          <div className="gold-divider max-w-xs mx-auto my-6" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)', height: '1px' }} />
          <p className="text-[#6B7280] text-lg leading-relaxed max-w-2xl mx-auto">
            A public interest platform bridging the gap between Kenyan citizens and the law — and between taxpayers and public finance accountability.
          </p>
        </div>
      </section>

      {/* What is Sheria */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-[#1B4332] mb-2">What is Sheria?</h2>
            <div style={{ background: 'linear-gradient(90deg, #D4A017, transparent)', height: '2px', width: '60px', marginBottom: '16px' }} />
            <p className="text-[#6B7280] max-w-2xl leading-relaxed">
              <em>Sheria</em> is the Swahili word for <em>law</em>. This platform was built on the conviction that legal knowledge and public accountability data should be freely and clearly accessible to every Kenyan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#E8E4DE] p-6 shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${pillar.color}15`, border: `1px solid ${pillar.color}30` }}
                >
                  <pillar.icon size={22} style={{ color: pillar.color }} />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#1A1A1A] mb-3">{pillar.title}</h3>
                <p className="text-[#6B7280] leading-relaxed text-sm">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Acts */}
      <section className="py-16 px-4 bg-white border-t border-[#E8E4DE]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-[#1B4332] mb-2">Legal Knowledge Base</h2>
            <div style={{ background: 'linear-gradient(90deg, #D4A017, transparent)', height: '2px', width: '60px', marginBottom: '16px' }} />
            <p className="text-[#6B7280] max-w-2xl leading-relaxed">
              Six primary Acts currently indexed across three legal domains. All source legislation is publicly available via Kenya Law.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTS.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-[#F9F7F4] rounded-xl p-5 border border-[#E8E4DE] hover:border-[#1B4332]/30 transition-all hover:shadow-sm group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${act.domainColor}15`, color: act.domainColor, border: `1px solid ${act.domainColor}30` }}
                  >
                    {act.domain === 'Employment' ? <Briefcase size={10} /> : act.domain === 'Land' ? <MapPin size={10} /> : <Building2 size={10} />}
                    {act.domain}
                  </span>
                  <span className="text-xs font-code text-[#A8B4AA]">{act.provisions} provisions</span>
                </div>
                <h3 className="font-display text-sm font-semibold text-[#1A1A1A] mb-2 leading-tight group-hover:text-[#1B4332] transition-colors">
                  {act.name}
                </h3>
                <p className="text-[#6B7280] text-xs leading-relaxed mb-3">{act.description}</p>
                <a
                  href={act.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#1B4332] hover:text-[#2D6A4F] font-medium transition-colors"
                >
                  View on Kenya Law <ExternalLink size={10} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-4 border-[#D4A017] bg-white rounded-r-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-xl font-semibold text-[#1A1A1A] mb-3">Legal Disclaimer</h3>
                <div className="space-y-3 text-[#6B7280] text-sm leading-relaxed">
                  <p>
                    The information provided by the Sheria Intelligence Platform constitutes <strong className="text-[#1A1A1A]">legal information</strong>, not legal advice. No attorney-client relationship is created by use of this platform.
                  </p>
                  <p>
                    While Sheria strives to provide accurate and up-to-date information, the law changes frequently. Users are strongly encouraged to verify all legal information with a qualified Kenyan advocate before taking any action based on content retrieved from this platform.
                  </p>
                  <p>
                    Public finance data presented in the Finance Audit module is sourced from official reports of the <strong className="text-[#1A1A1A]">Office of the Auditor General</strong> and the <strong className="text-[#1A1A1A]">Controller of Budget</strong>. All figures are directional. Verify against original PDF reports before citation in any formal or legal context.
                  </p>
                  <p>
                    This platform is provided for public interest purposes and is not affiliated with any government institution, the Kenya Law Reform Commission, or the Office of the Attorney General.
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
