import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';

export default function OfflineBanner() {
  const { isError, isFetched } = useQuery({
    queryKey: ['health'],
    queryFn: api.health,
    retry: 1,
    refetchInterval: 30000,
  });

  if (!isFetched || !isError) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-[#F59E0B]/15 border-b border-[#F59E0B]/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <AlertTriangle size={14} className="text-[#F59E0B] flex-shrink-0" />
        <p className="text-sm text-[#F59E0B] font-medium">
          Sheria API is offline. Results unavailable.
        </p>
      </div>
    </div>
  );
}
