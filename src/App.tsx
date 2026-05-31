import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';
import Home from './pages/Home';
import LegalResearch from './pages/LegalResearch';
import FinanceAudit from './pages/FinanceAudit';
import About from './pages/About';

export default function App() {
  const [tier, setTier] = useState<'public' | 'professional'>('public');

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar tier={tier} onTierChange={setTier} />
          <OfflineBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/legal" element={<LegalResearch tier={tier} onTierChange={setTier} />} />
            <Route path="/finance" element={<FinanceAudit />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
