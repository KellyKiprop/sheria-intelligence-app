import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, BarChart2, Briefcase, MapPin, Building2, ChevronRight, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AnimatedCounter from '../components/AnimatedCounter';
import CoatOfArms from '../components/CoatOfArms';
import { api } from '../lib/api';

const TYPING_PHRASES = [
  'Know Your Rights.',
  'Understand Your Laws.',
  'See Where the Money Goes.',
];

function TypingText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIndex];
    const speed = isDeleting ? 40 : 70;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayed.length < phrase.length) {
        setDisplayed(phrase.slice(0, displayed.length + 1));
      } else if (!isDeleting && displayed.length === phrase.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayed.length > 0) {
        setDisplayed(phrase.slice(0, displayed.length - 1));
      } else if (isDeleting && displayed.length === 0) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % TYPING_PHRASES.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIndex]);

  return (
    <span className="text-white">
      {displayed}
      <span className="animate-pulse text-[#D4A017]">|</span>
    </span>
  );
}

const DOMAIN_CARDS = [
  {
    id: 'employment',
    icon: Briefcase,
    name: 'Employment Law',
    description: 'Labour relations, contracts, termination rights, workplace protections under Kenyan law.',
    color: '#22C55E',
  },
  {
    id: 'land',
    icon: MapPin,
    name: 'Land Law',
    description: 'Land tenure, title disputes, community land rights, conveyancing and NLC processes.',
    color: '#D4A017',
  },
  {
    id: 'business',
    icon: Building2,
    name: 'Business Law',
    description: 'Company formation, contracts, insolvency, competition law, and regulatory compliance.',
    color: '#3B82F6',
  },
];

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: api.stats,
    retry: false,
  });

  const actsIndexed = stats?.acts_indexed ?? 6;
  const provisions = stats?.legal_provisions ?? 1937;
  const flaggedBillions = stats?.funds_flagged_kes_billions ?? 92.56;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#0D1F17] grain-texture flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#1B4332]/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#D4A017]/5 blur-2xl" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <CoatOfArms size={96} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gradient-gold mb-3"
          >
            Sheria Intelligence Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#6B8F7A] text-sm sm:text-base tracking-widest uppercase mb-8 font-body"
          >
            AI-Powered Kenyan Legal Research &amp; Public Finance Intelligence
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl lg:text-3xl font-display font-medium mb-12 h-10"
          >
            <TypingText />
          </motion.div>

          {/* CTA Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            <Link
              to="/legal"
              className="group relative glass-card p-6 border border-[#2D6A4F] hover:border-[#22C55E] transition-all duration-300 hover:glow-green"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1B4332] border border-[#2D6A4F] flex items-center justify-center group-hover:border-[#22C55E] transition-colors">
                  <Scale className="text-[#22C55E]" size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-white text-lg font-semibold">Legal Research</h3>
                  <p className="text-[#6B8F7A] text-sm">AI-powered law analysis</p>
                </div>
              </div>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D6A4F] group-hover:text-[#22C55E] transition-colors" />
            </Link>

            <Link
              to="/finance"
              className="group relative glass-card p-6 border border-[#5C4A00] hover:border-[#D4A017] transition-all duration-300 hover:glow-gold"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2A1F00] border border-[#5C4A00] flex items-center justify-center group-hover:border-[#D4A017] transition-colors">
                  <BarChart2 className="text-[#D4A017]" size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-white text-lg font-semibold">Finance Audit</h3>
                  <p className="text-[#A08040] text-sm">Public funds intelligence</p>
                </div>
              </div>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C4A00] group-hover:text-[#D4A017] transition-colors" />
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="relative z-10 mt-16 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#D4A017]/20 border border-[#D4A017]/20 rounded-xl overflow-hidden"
        >
          {[
            { label: 'Acts Indexed', value: actsIndexed, suffix: ' Acts', decimals: 0 },
            { label: 'Legal Provisions', value: provisions, suffix: '', decimals: 0 },
            { label: 'KES Flagged', value: flaggedBillions, prefix: 'KES ', suffix: 'B', decimals: 2 },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0D1F17] p-6 text-center">
              <div className="font-code text-3xl sm:text-4xl font-bold text-white mb-1">
                <AnimatedCounter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  duration={2000}
                />
              </div>
              <div className="text-[#6B8F7A] text-xs uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 border border-[#D4A017]/40 rounded-full flex items-start justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-[#D4A017]/60 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Domain Cards Section */}
      <section className="bg-[#F9F7F4] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="gold-divider max-w-xs mx-auto mb-6" />
            <h2 className="font-display text-3xl sm:text-4xl text-[#1B4332] font-bold mb-3">
              Legal Knowledge Base
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Comprehensive coverage of Kenya's key legal domains, drawn from primary legislation and legal precedent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DOMAIN_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-6 border border-[#E8E4DE] hover:border-current transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg"
                style={{ '--hover-border': card.color } as React.CSSProperties}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30` }}
                >
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#1B4332] transition-colors">
                  {card.name}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{card.description}</p>
                <div
                  className="mt-4 flex items-center gap-1 text-xs font-medium transition-opacity"
                  style={{ color: card.color }}
                >
                  Explore domain <ArrowRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform pillars */}
      <section className="bg-[#0D1F17] grain-texture py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 border border-[#2D6A4F]/40"
            >
              <Scale className="text-[#22C55E] mb-4" size={32} />
              <h3 className="font-display text-2xl text-white font-bold mb-3">Legal Research Engine</h3>
              <p className="text-[#A8C4B4] leading-relaxed mb-4">
                Ask complex legal questions in plain language. Sheria retrieves and synthesizes relevant provisions from Kenyan legislation, providing structured responses across Employment, Land, and Business law domains.
              </p>
              <Link
                to="/legal"
                className="inline-flex items-center gap-2 text-[#22C55E] text-sm font-medium hover:gap-3 transition-all"
              >
                Start researching <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 border border-[#5C4A00]/40"
            >
              <BarChart2 className="text-[#D4A017] mb-4" size={32} />
              <h3 className="font-display text-2xl text-white font-bold mb-3">Public Finance Audit</h3>
              <p className="text-[#C8A84A] leading-relaxed mb-4">
                Track and analyze public finance audit findings from the Auditor General and Controller of Budget. Visualize flagged funds by ministry, county, and finding type — making accountability data accessible.
              </p>
              <Link
                to="/finance"
                className="inline-flex items-center gap-2 text-[#D4A017] text-sm font-medium hover:gap-3 transition-all"
              >
                View audit data <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
