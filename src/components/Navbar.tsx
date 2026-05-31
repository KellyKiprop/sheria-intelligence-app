import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CoatOfArms from './CoatOfArms';
import { api } from '../lib/api';

interface NavbarProps {
  tier: 'public' | 'professional';
  onTierChange: (tier: 'public' | 'professional') => void;
}

export default function Navbar({ tier, onTierChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { data: healthData, isError } = useQuery({
    queryKey: ['health'],
    queryFn: api.health,
    retry: 1,
    refetchInterval: 30000,
  });

  const isApiOnline = !!healthData && !isError;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/legal', label: 'Legal Research' },
    { to: '/finance', label: 'Finance Audit' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D1F17]/95 backdrop-blur-md border-b border-[#D4A017]/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <CoatOfArms size={36} className="transition-transform group-hover:scale-105" />
            <div>
              <span className="font-display text-[#D4A017] text-lg font-semibold leading-none block">
                Sheria
              </span>
              <span className="text-[#6B8F7A] text-xs tracking-widest uppercase font-body">
                Intelligence
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 font-body ${
                    isActive
                      ? 'text-[#D4A017] bg-[#D4A017]/10'
                      : 'text-[#A8C4B4] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: tier + API status */}
          <div className="flex items-center gap-3">
            {/* API Status */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isApiOnline ? 'bg-[#22C55E] pulse-dot' : 'bg-[#EF4444]'
                }`}
              />
              <span className="text-xs text-[#6B7280] hidden sm:block font-code">
                {isApiOnline ? 'API Online' : 'API Offline'}
              </span>
            </div>

            {/* Tier toggle */}
            <div className="flex items-center bg-[#0D1F17] border border-[#2D6A4F]/60 rounded-full p-0.5">
              <button
                onClick={() => onTierChange('public')}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
                  tier === 'public'
                    ? 'bg-[#1B4332] text-[#D4A017] shadow-sm'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => onTierChange('professional')}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
                  tier === 'professional'
                    ? 'bg-[#1B4332] text-[#D4A017] shadow-sm'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                Professional
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
