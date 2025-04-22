import React from 'react';
import { BrokerPoints } from '@shared/schema';
import { useLocation } from 'wouter';

interface BrokerCardProps {
  rank: number;
  broker: BrokerPoints;
}

export function BrokerCard({ rank, broker }: BrokerCardProps) {
  const [, navigate] = useLocation();
  
  // Verificar se há alertas baseados nos dados do broker
  const hasWarnings = (broker.leads_sem_interacao_24h || 0) > 0 || 
                     (broker.leads_respondidos_apos_18h || 0) > 0 || 
                     (broker.leads_5_dias_sem_mudanca || 0) > 0;

  const handleClick = () => {
    navigate(`/broker/${broker.id}`);
  };

  return (
    <div 
      className="bg-card rounded-xl shadow overflow-hidden animate-slide-up hover:shadow-md transition-shadow duration-300 cursor-pointer border border-border"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Indicador de ranking e borda accent à esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
        
        {/* Conteúdo principal do card */}
        <div className="p-4">
          {/* Cabeçalho com rank, nome e pontuação */}
          <div className="flex justify-between mb-4">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
                {rank}
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{broker.nome}</h3>
                {hasWarnings && (
                  <div className="flex items-center text-xs text-destructive mt-1">
                    <span className="mr-1">⚠</span>
                    <span>Precisa Atenção</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">PONTOS</div>
              <div className={`font-bold ${(broker.pontos ?? 0) >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                {broker.pontos ?? 0}
              </div>
            </div>
          </div>
          
          {/* Linha de métricas (leads, propostas, vendas) */}
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div className="bg-muted py-2 px-3 rounded">
              <div className="text-xs text-muted-foreground">Leads</div>
              <div className="font-semibold text-card-foreground">{broker.leads_respondidos_1h ?? 0}</div>
            </div>
            <div className="bg-muted py-2 px-3 rounded">
              <div className="text-xs text-muted-foreground">Propostas</div>
              <div className="font-semibold text-card-foreground">{broker.propostas_enviadas ?? 0}</div>
            </div>
            <div className="bg-muted py-2 px-3 rounded">
              <div className="text-xs text-muted-foreground">Vendas</div>
              <div className="font-semibold text-card-foreground">{broker.vendas_realizadas ?? 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}