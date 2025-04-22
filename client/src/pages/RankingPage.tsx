import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BrokerCard } from '@/components/dashboard/BrokerCard';
import { MetricSummaryCards } from '@/components/dashboard/MetricSummaryCards';
import { getBrokerRankings, getDashboardMetrics } from '@/lib/supabase';

export function RankingPage() {
  // Obter rankings dos brokers
  const { 
    data: brokers, 
    isLoading: isLoadingBrokers, 
    error: brokersError 
  } = useQuery({
    queryKey: ['brokerRankings'],
    queryFn: getBrokerRankings
  });

  // Obter métricas do dashboard
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsError
  } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: getDashboardMetrics
  });

  // Estado de carregamento combinado
  const isLoading = isLoadingBrokers || isLoadingMetrics;
  const error = brokersError || metricsError;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Ranking de Corretores</h1>
        <p className="text-muted-foreground text-sm">Classificação baseada em pontos acumulados por produtividade</p>
      </div>

      {/* Cards de métricas resumidas - mostrar estado de loading se necessário */}
      <MetricSummaryCards
        totalLeads={metrics?.totalLeads || 0}
        activeBrokers={metrics?.activeBrokers || 0}
        averagePoints={metrics?.averagePoints || 0}
        totalSales={metrics?.totalSales || 0}
        isLoading={isLoadingMetrics}
      />

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dados...</p>
        </div>
      ) : error ? (
        <div className="bg-card text-destructive p-4 rounded-lg border border-destructive/20">
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