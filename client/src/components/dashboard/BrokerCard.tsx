import React from 'react';
import { BrokerPoints } from '@shared/schema';
import { Link } from 'wouter';

interface BrokerCardProps {
  rank: number;
  broker: BrokerPoints;
}

export function BrokerCard({ rank, broker }: BrokerCardProps) {
  // Verificar se há alertas baseados nos dados do broker
  const hasWarnings = (broker.leads_sem_interacao_24h || 0) > 0 || 
                     (broker.leads_respondidos_apos_18h || 0) > 0 || 
                     (broker.leads_5_dias_sem_mudanca || 0) > 0;

  return (
    <Link href={`/broker/${broker.id}`}>
      <a className="block bg-red-50 rounded-xl shadow overflow-hidden animate-slide-up hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          {/* Indicador de ranking e borda vermelha à esquerda */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
          
          {/* Conteúdo principal do card */}
          <div className="p-4">
            {/* Cabeçalho com rank, nome e pontuação */}
            <div className="flex justify-between mb-4">
              <div className="flex items-start gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-sm font-bold">
                  {rank}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{broker.nome}</h3>
                  {hasWarnings && (
                    <div className="flex items-center text-xs text-red-500 mt-1">
                      <span className="mr-1">⚠</span>
                      <span>Precisa Atenção</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">PONTOS</div>
                <div className="font-bold text-red-500">{broker.pontos ?? 0}</div>
              </div>
            </div>
            
            {/* Linha de métricas (leads, propostas, vendas) */}
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <div className="bg-red-100 py-2 px-3 rounded">
                <div className="text-xs text-gray-500">Leads</div>
                <div className="font-semibold">{broker.leads_respondidos_1h ?? 0}</div>
              </div>
              <div className="bg-red-100 py-2 px-3 rounded">
                <div className="text-xs text-gray-500">Propostas</div>
                <div className="font-semibold">{broker.propostas_enviadas ?? 0}</div>
              </div>
              <div className="bg-red-100 py-2 px-3 rounded">
                <div className="text-xs text-gray-500">Vendas</div>
                <div className="font-semibold">{broker.vendas_realizadas ?? 0}</div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}