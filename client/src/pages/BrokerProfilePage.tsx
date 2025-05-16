import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { DataChart } from "@/components/dashboard/DataChart";
import {
  getBrokerById,
  getBrokerPoints,
  getBrokerRankPosition,
  getBrokerLeads,
  getKommoConfig,
} from "@/lib/supabase";
import { Card } from "@/components/ui/card";

export function BrokerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const brokerId = parseInt(id);
  const [, navigate] = useLocation();

  const { data: broker, error } = useQuery({
    queryKey: ["broker", brokerId],
    queryFn: () => getBrokerById(brokerId),
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: brokerPoints } = useQuery({
    queryKey: ["brokerPoints", brokerId],
    queryFn: () => getBrokerPoints(brokerId),
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: rankPosition } = useQuery<number>({
    queryKey: ["brokerRankPosition", brokerId],
    queryFn: () => getBrokerRankPosition(brokerId),
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: leads } = useQuery({
    queryKey: ["brokerLeads", brokerId],
    queryFn: () => getBrokerLeads(brokerId),
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: kommoConfig } = useQuery({
    queryKey: ["kommoConfig", broker?.company_id],
    queryFn: () => getKommoConfig(broker?.company_id),
    enabled: !!broker?.company_id,
  });

  useEffect(() => {
    if (error?.message === "Corretor inativo ou não encontrado") {
      navigate("/");
    }
  }, [error, navigate]);

  if (!broker || !brokerPoints || !leads) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Carregando dados do corretor...</p>
        </div>
      </div>
    );
  }

  // Process leads data for funnel chart
  const pipelineLeads = leads.filter(
    (lead) => lead.pipeline_id === kommoConfig?.pipeline_id
  );

  const stageData = pipelineLeads.reduce((acc, lead) => {
    acc[lead.etapa] = (acc[lead.etapa] || 0) + 1;
    return acc;
  }, {});

  const totalLeads = pipelineLeads.length;
  const funnelData = Object.entries(stageData).map(([stage, count]) => ({
    name: stage,
    value: (count as number / totalLeads) * 100,
  }));

  return (
    <div className="min-h-screen bg-blue-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-white hover:text-white/90 hover:underline flex items-center"
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
          <h1 className="text-2xl font-bold text-white mt-2">
            PAINEL DE DESEMPENHO – CORRETOR {broker.nome.toUpperCase()}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="col-span-2 p-6 bg-white shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Funil de Vendas</h2>
            <div className="h-[400px]">
              <DataChart
                title=""
                type="horizontalBar"
                data={funnelData}
                colors={['#6366F1', '#22C55E', '#F59E0B', '#94A3B8']}
              />
              <p className="text-center mt-4 text-gray-600">
                Total de Leads: {totalLeads}
              </p>
            </div>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Tempo médio de resposta</h3>
              <p className="text-2xl font-bold">3h 45m</p>
            </Card>

            <Card className="p-4 bg-white shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Sem interação 24h</h3>
              <p className="text-2xl font-bold">{brokerPoints.leads_sem_interacao_24h}</p>
            </Card>

            <Card className="p-4 bg-white shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Propostas enviadas</h3>
              <p className="text-2xl font-bold">{brokerPoints.propostas_enviadas}</p>
            </Card>

            <Card className="p-4 bg-white shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Leads perdidos</h3>
              <p className="text-2xl font-bold">{brokerPoints.leads_perdidos}</p>
            </Card>

            <Card className="p-4 bg-white shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Ticket médio</h3>
              <p className="text-2xl font-bold">R$ 450.000</p>
            </Card>

            <Card className="p-4 bg-white shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Ranking</h3>
              <p className="text-2xl font-bold">#{rankPosition}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}