import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BrokerCard } from "@/components/dashboard/BrokerCard";
import { MetricSummaryCards } from "@/components/dashboard/MetricSummaryCards";
import { getBrokerRankings, getDashboardMetrics } from "@/lib/api";
import { Medal } from "lucide-react";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

export function RankingPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [topBrokerIds, setTopBrokerIds] = useState<number[]>([]);
  const [resetProgress, setResetProgress] = useState(0);

  const { data: brokers, isLoading: isLoadingBrokers } = useQuery({
    queryKey: ["brokerRankings"],
    queryFn: getBrokerRankings,
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: getDashboardMetrics,
  });

  useEffect(() => {
    if (brokers && brokers.length >= 3) {
      setTopBrokerIds(brokers.slice(0, 3).map((broker) => broker.id));
    }
  }, [brokers]);

  const rotatePage = () => {
    setCurrentPage((prev) => (prev + 1) % (topBrokerIds.length + 1));
    setResetProgress((prev) => prev + 1);
  };

  const isLoading = isLoadingBrokers || isLoadingMetrics;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Medal className="text-yellow-500 w-8 h-8" />
          <div>
            <h1 className="text-4xl font-bold">Ranking de Corretores</h1>
            <p className="text-gray-400">
              Classificação baseada na produtividade
            </p>
          </div>
        </div>

        <MetricSummaryCards
          totalLeads={metrics?.totalLeads || 0}
          activeBrokers={metrics?.activeBrokers || 0}
          averagePoints={metrics?.maxPoints || 0}
          totalSales={metrics?.totalSales || 0}
          isLoading={isLoadingMetrics}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-800/50 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {brokers?.map((broker, index) => (
              <BrokerCard key={broker.id} rank={index + 1} broker={broker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
