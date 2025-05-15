import { useLocation } from 'wouter';
import type { BrokerPoints } from '@shared/schema';
import { formatCurrency } from '@/lib/utils';

interface BrokerCardProps {
  rank: number;
  broker: BrokerPoints;
}

export function BrokerCard({ rank, broker }: BrokerCardProps) {
  const [, navigate] = useLocation();

  const hasWarnings =
    (broker.leads_sem_interacao_24h || 0) > 0 ||
    (broker.leads_respondidos_apos_18h || 0) > 0 ||
    (broker.leads_5_dias_sem_mudanca || 0) > 0;

  const handleClick = () => {
    navigate(`/broker/${broker.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer border border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={broker.foto_url || `https://ui-avatars.com/api/?name=${broker.nome}`}
              alt={broker.nome}
              className="w-16 h-16 rounded-full object-cover"
            />
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
              #{rank}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-xl">{broker.nome}</h3>
            <p className="text-gray-400 text-sm">{broker.cargo || 'Corretor'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-gray-400 text-sm">Pontuação</p>
          <p className="text-2xl font-bold text-yellow-500">{broker.pontos || 0}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Vendas</p>
          <p className="text-2xl font-bold text-green-500">
            {broker.vendas_realizadas || 0}
          </p>
        </div>
      </div>

      {hasWarnings && (
        <div className="mt-4 bg-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm">
          Alertas pendentes
        </div>
      )}
    </div>
  );
}