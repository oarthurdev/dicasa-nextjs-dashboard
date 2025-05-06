import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { AlertList } from "@/components/dashboard/AlertList";
import { ConversionFunnel } from "@/components/dashboard/ConversionFunnel";
import { PointsBreakdown } from "@/components/dashboard/PointsBreakdown";
import {
  getBrokerById,
  getBrokerPoints,
  getActivityHeatmap,
  getBrokerAlerts,
  getBrokerRankPosition,
} from "@/lib/supabase";

interface BrokerPerformance {
  monthlyData: {
    month: string;
    salesAmount: number;
    propertiesSold: number;
    points: number;
  }[];
  propertyTypes: {
    type: string;
    percentage: number;
    count: number;
  }[];
}

interface HeatMapData {
  dias: string[];
  horarios: string[];
  dados: number[][];
}

interface BrokerAlert {
  tipo: string;
  mensagem: string;
  quantidade: number;
}

interface PointCategory {
  categoria: string;
  quantidade: number;
  pontos: number;
  tipo: "Positivo" | "Negativo";
}

export function BrokerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const brokerId = parseInt(id);

  // Estado para armazenar os dados formatados para o detalhamento de pontos
  const [pointsData, setPointsData] = useState<PointCategory[]>([]);
  // Estado para armazenar os dados formatados para o funil de conversão
  const [funnelData, setFunnelData] = useState<
    { name: string; value: number; color: string }[]
  >([]);

  // Consultas para buscar os dados do corretor usando Supabase diretamente
  const { data: broker, isLoading: isLoadingBroker, error } = useQuery({
    queryKey: ["broker", brokerId],
    queryFn: () => getBrokerById(brokerId),
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (error?.message === "Corretor inativo ou não encontrado") {
      navigate("/");
    }
  }, [error, navigate]);

  if (error) return null;

  const { data: brokerPoints, isLoading: isLoadingPoints } = useQuery({
    queryKey: ["brokerPoints", brokerId],
    queryFn: () => getBrokerPoints(brokerId),
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: heatmapData, isLoading: isLoadingHeatmap } =
    useQuery<HeatMapData>({
      queryKey: ["brokerHeatmap", brokerId],
      queryFn: () => getActivityHeatmap(brokerId),
      enabled: !!brokerId && !isNaN(brokerId),
    });

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery<BrokerAlert[]>({
    queryKey: ["brokerAlerts", brokerId],
    queryFn: () => getBrokerAlerts(brokerId),
    enabled: !!brokerId && !isNaN(brokerId),
  });

  // Consulta para buscar a posição do broker no ranking
  const { data: rankPosition, isLoading: isLoadingRankPosition } =
    useQuery<number>({
      queryKey: ["brokerRankPosition", brokerId],
      queryFn: () => getBrokerRankPosition(brokerId),
      enabled: !!brokerId && !isNaN(brokerId),
    });

  // Efeito para processar os dados de pontuação para o componente PointsBreakdown
  useEffect(() => {
    if (brokerPoints) {
      const points: PointCategory[] = [];

      // Regras positivas
      if (brokerPoints.leads_respondidos_1h > 0) {
        points.push({
          categoria: "Leads respondidos em 1 hora",
          quantidade: brokerPoints.leads_respondidos_1h,
          pontos: brokerPoints.leads_respondidos_1h * 2,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.leads_visitados > 0) {
        points.push({
          categoria: "Leads visitados",
          quantidade: brokerPoints.leads_visitados,
          pontos: brokerPoints.leads_visitados * 5,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.propostas_enviadas > 0) {
        points.push({
          categoria: "Propostas enviadas",
          quantidade: brokerPoints.propostas_enviadas,
          pontos: brokerPoints.propostas_enviadas * 8,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.vendas_realizadas > 0) {
        points.push({
          categoria: "Vendas realizadas",
          quantidade: brokerPoints.vendas_realizadas,
          pontos: brokerPoints.vendas_realizadas * 15,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.leads_atualizados_mesmo_dia > 0) {
        points.push({
          categoria: "Leads atualizados no mesmo dia",
          quantidade: brokerPoints.leads_atualizados_mesmo_dia,
          pontos: brokerPoints.leads_atualizados_mesmo_dia * 2,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.feedbacks_positivos > 0) {
        points.push({
          categoria: "Feedbacks positivos",
          quantidade: brokerPoints.feedbacks_positivos,
          pontos: brokerPoints.feedbacks_positivos * 3,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.resposta_rapida_3h > 0) {
        points.push({
          categoria: "Resposta rápida (3h)",
          quantidade: brokerPoints.resposta_rapida_3h,
          pontos: brokerPoints.resposta_rapida_3h * 4,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.todos_leads_respondidos > 0) {
        points.push({
          categoria: "Todos leads respondidos",
          quantidade: brokerPoints.todos_leads_respondidos,
          pontos: brokerPoints.todos_leads_respondidos * 5,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.cadastro_completo > 0) {
        points.push({
          categoria: "Cadastro completo",
          quantidade: brokerPoints.cadastro_completo,
          pontos: brokerPoints.cadastro_completo * 3,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.acompanhamento_pos_venda > 0) {
        points.push({
          categoria: "Acompanhamento pós-venda",
          quantidade: brokerPoints.acompanhamento_pos_venda,
          pontos: brokerPoints.acompanhamento_pos_venda * 10,
          tipo: "Positivo",
        });
      }

      if (brokerPoints.leads_perdidos > 0) {
        points.push({
          categoria: "Leads perdidos",
          quantidade: brokerPoints.leads_perdidos,
          pontos: brokerPoints.leads_perdidos * -1,
          tipo: "Negativo",
        });
      }

      // Set the processed points data
      setPointsData(points);

      // Criar dados do funil de conversão
      setFunnelData([
        {
          name: "Leads Respondidos em 1h",
          value: brokerPoints.leads_respondidos_1h || 0,
          color: "#3B82F6", // azul
        },
        {
          name: "Leads Visitados",
          value: brokerPoints.leads_visitados || 0,
          color: "#10B981", // verde
        },
        {
          name: "Propostas Enviadas",
          value: brokerPoints.propostas_enviadas || 0,
          color: "#F59E0B", // amarelo
        },
        {
          name: "Vendas Realizadas",
          value: brokerPoints.vendas_realizadas || 0,
          color: "#8B5CF6", // roxo
        },
      ]);
    }
  }, [brokerPoints]);

  // Verificar se está carregando
  const isLoading =
    isLoadingBroker ||
    isLoadingPoints ||
    isLoadingHeatmap ||
    isLoadingAlerts ||
    isLoadingRankPosition;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Carregando dados do corretor...</p>
        </div>
      </div>
    );
  }

  if (!broker || !brokerPoints) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Corretor não encontrado ou dados incompletos.
          <div className="mt-4">
            <Link href="/" className="text-blue-500 hover:underline">
              Voltar para o ranking
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Cabeçalho com navegação */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/"
            className="text-primary hover:text-primary/90 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar para Ranking
          </Link>

          <h1 className="text-2xl font-bold text-foreground mt-2">
            {broker.nome}
          </h1>
          <div className="flex items-center mt-1">
            <span className="text-muted-foreground text-sm">Ranking</span>
            <span className="mx-2 font-bold text-primary">#{rankPosition}</span>
            <span className="text-muted-foreground text-sm">Pontuação</span>
            <span
              className={`mx-2 font-bold ${(brokerPoints.pontos ?? 0) >= 0 ? "text-secondary" : "text-destructive"}`}
            >
              {brokerPoints.pontos ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Leads Respondidos em 1h"
          value={brokerPoints.leads_respondidos_1h || 0}
        />
        <MetricCard
          title="Leads Visitados"
          De
          value={brokerPoints.leads_visitados || 0}
        />
        <MetricCard
          title="Propostas Enviadas"
          value={brokerPoints.propostas_enviadas || 0}
        />
        <MetricCard
          title="Vendas Realizadas"
          value={brokerPoints.vendas_realizadas || 0}
        />
      </div>

      {/* Funnel, Alerts, Heatmap e Detalhamento de Pontos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-6">
          <ConversionFunnel stages={funnelData} />
          {pointsData.length > 0 && <PointsBreakdown data={pointsData} />}
        </div>
        <div className="space-y-6">
          {heatmapData && <HeatMap data={heatmapData} />}
          {alerts && <AlertList alerts={alerts} />}
        </div>
      </div>
    </div>
  );
}
