import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BrokerCard } from '@/components/dashboard/BrokerCard';
import { getBrokerRankings } from '@/lib/supabase';

export function RankingPage() {
  const { data: brokers, isLoading, error } = useQuery({
    queryKey: ['brokerRankings'],
    queryFn: getBrokerRankings
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Ranking de Corretores</h1>
        <p className="text-gray-500 text-sm">Classificação baseada em pontos acumulados por produtividade</p>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Carregando dados...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Erro ao carregar os dados do ranking. Por favor, tente novamente.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokers && brokers.map((broker, index) => (
            <BrokerCard 
              key={broker.id} 
              rank={index + 1} 
              broker={broker} 
            />
          ))}
        </div>
      )}
    </div>
  );
}