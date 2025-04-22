import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Broker, BrokerPoints } from '@shared/schema';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { HeatMap } from '@/components/dashboard/HeatMap';
import { AlertList } from '@/components/dashboard/AlertList';
import { ConversionFunnel } from '@/components/dashboard/ConversionFunnel';
import { PointsBreakdown } from '@/components/dashboard/PointsBreakdown';

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
  tipo: 'Positivo' | 'Negativo';
}

export function BrokerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const brokerId = parseInt(id);
  
  // Estado para armazenar os dados formatados para o detalhamento de pontos
  const [pointsData, setPointsData] = useState<PointCategory[]>([]);
  // Estado para armazenar os dados formatados para o funil de conversão
  const [funnelData, setFunnelData] = useState<{ name: string; value: number; color: string }[]>([]);

  // Consultas para buscar os dados do corretor
  const { data: broker, isLoading: isLoadingBroker } = useQuery<Broker>({
    queryKey: [`/api/brokers/${brokerId}`],
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: brokerPoints, isLoading: isLoadingPoints } = useQuery<BrokerPoints>({
    queryKey: [`/api/brokers/${brokerId}/points`],
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: heatmapData, isLoading: isLoadingHeatmap } = useQuery<HeatMapData>({
    queryKey: [`/api/brokers/${brokerId}/heatmap`],
    enabled: !!brokerId && !isNaN(brokerId),
  });

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery<BrokerAlert[]>({
    queryKey: [`/api/brokers/${brokerId}/alerts`],
    enabled: !!brokerId && !isNaN(brokerId),
  });

  // Efeito para processar os dados de pontuação para o componente PointsBreakdown
  useEffect(() => {
    if (brokerPoints) {
      const points: PointCategory[] = [];
      
      // Adicionar pontos positivos se houver
      const leadsRespondidos = brokerPoints.leads_respondidos_1h ?? 0;
      if (leadsRespondidos > 0) {
        points.push({
          categoria: 'Leads respondidos em 1h',
          quantidade: leadsRespondidos,
          pontos: leadsRespondidos * 2, // 2 pts por lead
          tipo: 'Positivo'
        });
      }
      
      const leadsVisitados = brokerPoints.leads_visitados ?? 0;
      if (leadsVisitados > 0) {
        points.push({
          categoria: 'Leads visitados',
          quantidade: leadsVisitados,
          pontos: leadsVisitados * 5, // 5 pts por visita
          tipo: 'Positivo'
        });
      }
      
      const propostasEnviadas = brokerPoints.propostas_enviadas ?? 0;
      if (propostasEnviadas > 0) {
        points.push({
          categoria: 'Propostas enviadas',
          quantidade: propostasEnviadas,
          pontos: propostasEnviadas * 8, // 8 pts por proposta
          tipo: 'Positivo'
        });
      }
      
      const vendasRealizadas = brokerPoints.vendas_realizadas ?? 0;
      if (vendasRealizadas > 0) {
        points.push({
          categoria: 'Vendas realizadas',
          quantidade: vendasRealizadas,
          pontos: vendasRealizadas * 15, // 15 pts por venda
          tipo: 'Positivo'
        });
      }
      
      // Adicionar pontos negativos se houver
      const leadsSemInteracao = brokerPoints.leads_sem_interacao_24h ?? 0;
      if (leadsSemInteracao > 0) {
        points.push({
          categoria: 'Leads sem interação 24h',
          quantidade: leadsSemInteracao,
          pontos: -(leadsSemInteracao * 3), // -3 pts por lead
          tipo: 'Negativo'
        });
      }
      
      const leadsRespondidosApos = brokerPoints.leads_respondidos_apos_18h ?? 0;
      if (leadsRespondidosApos > 0) {
        points.push({
          categoria: 'Leads respondidos após 18h',
          quantidade: leadsRespondidosApos,
          pontos: -(leadsRespondidosApos * 2), // -2 pts por lead
          tipo: 'Negativo'
        });
      }
      
      const leadsSemMudanca = brokerPoints.leads_5_dias_sem_mudanca ?? 0;
      if (leadsSemMudanca > 0) {
        points.push({
          categoria: 'Leads 5+ dias sem mudança',
          quantidade: leadsSemMudanca,
          pontos: -(leadsSemMudanca * 4), // -4 pts por lead
          tipo: 'Negativo'
        });
      }
      
      setPointsData(points);
      
      // Criar dados do funil de conversão
      setFunnelData([
        {
          name: 'Leads Respondidos em 1h',
          value: brokerPoints.leads_respondidos_1h || 0,
          color: '#3B82F6' // azul
        },
        {
          name: 'Leads Visitados',
          value: brokerPoints.leads_visitados || 0,
          color: '#10B981' // verde
        },
        {
          name: 'Propostas Enviadas',
          value: brokerPoints.propostas_enviadas || 0,
          color: '#F59E0B' // amarelo
        },
        {
          name: 'Vendas Realizadas',
          value: brokerPoints.vendas_realizadas || 0,
          color: '#8B5CF6' // roxo
        }
      ]);
    }
  }, [brokerPoints]);

  // Verificar se está carregando
  const isLoading = isLoadingBroker || isLoadingPoints || isLoadingHeatmap || isLoadingAlerts;

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
          <Link href="/" className="text-blue-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Ranking
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-800 mt-2">{broker.nome}</h1>
          <div className="flex items-center mt-1">
            <span className="text-gray-500 text-sm">Ranking</span>
            <span className="mx-2 font-bold text-purple-800">#{id}</span>
            <span className="text-gray-500 text-sm">Pontuação</span>
            <span className={`mx-2 font-bold ${(brokerPoints.pontos ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
      
      {/* Funnel e Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <ConversionFunnel stages={funnelData} />
        </div>
        <div>
          {heatmapData && <HeatMap data={heatmapData} />}
        </div>
      </div>
      
      {/* Alertas e Detalhamento de Pontos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {alerts && <AlertList alerts={alerts} />}
        </div>
        <div>
          {pointsData.length > 0 && <PointsBreakdown data={pointsData} />}
        </div>
      </div>
    </div>
  );
}