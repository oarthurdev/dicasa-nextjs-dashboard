import React from "react";
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { BrokerCard } from "@/components/dashboard/BrokerCard";
import { MetricSummaryCards } from "@/components/dashboard/MetricSummaryCards";
import { getBrokerRankings, getDashboardMetrics } from "@/lib/api";
import { Medal } from "lucide-react";

export function RankingPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const {
    data: brokers,
    isLoading: isLoadingBrokers,
    error: brokersError,
  } = useQuery({
    queryKey: ["brokerRankings", companyId],
    queryFn: () => getBrokerRankings(companyId),
    enabled: !!companyId,
  });

  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsError,
  } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: getDashboardMetrics,
  });

  const isLoading = isLoadingBrokers || isLoadingMetrics;
  const error = brokersError || metricsError;

  const maxPoints = brokers?.length
    ? Math.max(...brokers.map((b) => b.pontos))
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-4">
        <Medal className="text-primary w-6 h-6" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Ranking de Corretores
          </h1>
          <p className="text-muted-foreground text-sm">
            Classificação baseada na pontuação por produtividade
          </p>
        </div>
      </div>

      {/* Métricas resumidas */}
      <MetricSummaryCards
        totalLeads={metrics?.totalLeads || 0}
        activeBrokers={metrics?.activeBrokers || 0}
        averagePoints={metrics?.maxPoints || 0}
        totalSales={metrics?.totalSales || 0}
        isLoading={isLoadingMetrics}
      />

      {/* Ranking */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 mt-6 rounded-lg border border-destructive/30 text-sm">
          <strong>Erro:</strong> Não foi possível carregar os dados. Verifique
          sua conexão ou tente novamente mais tarde.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {brokers.map((broker, index) => (
            <BrokerCard key={broker.id} rank={index + 1} broker={broker} />
          ))}
        </div>
      )}
    </div>
  );
}
