import React from 'react';

interface HeatMapProps {
  data: {
    dias: string[];
    horarios: string[];
    dados: number[][];
  };
}

export function HeatMap({ data }: HeatMapProps) {
  // Encontra o valor máximo para normalizar a intensidade das cores
  const maxValue = data.dados.reduce((max, row) => {
    const rowMax = Math.max(...row);
    return rowMax > max ? rowMax : max;
  }, 0);

  // Função para calcular a cor baseada no valor normalizado usando cores do tema dark
  const getColor = (value: number) => {
    if (value === 0) return 'rgba(30, 41, 59, 0.4)'; // Fundo para valor zero
    
    const normalizedValue = value / maxValue;
    
    // Escala de azul para tema dark (do mais escuro ao mais claro/vibrante)
    return `rgba(59, 130, 246, ${0.3 + (normalizedValue * 0.7)})`;
  };

  // Determina se o texto deve ser branco ou preto com base na intensidade da cor de fundo
  const getTextColor = (value: number) => {
    if (value === 0) return 'text-muted-foreground';
    
    const normalizedValue = value / maxValue;
    
    // Texto branco para valores mais altos (células mais escuras)
    if (normalizedValue > 0.4) return 'text-primary-foreground font-semibold';
    
    // Texto mais escuro para valores mais baixos (células mais claras)
    return 'text-foreground font-medium';
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Mapa de Calor - Mensagens Enviadas</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm">
              <th className="font-normal text-muted-foreground"></th>
              {data.dias.map((dia, index) => (
                <th key={index} className="px-2 py-1 font-medium text-foreground">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.horarios.map((horario, horarioIndex) => (
              <tr key={horarioIndex}>
                <td className="text-xs font-medium text-foreground p-1">{horario}</td>
                {data.dias.map((_, diaIndex) => {
                  // Ajuste os índices para corresponder aos dados
                  const value = data.dados[diaIndex][horarioIndex] || 0;
                  return (
                    <td 
                      key={diaIndex} 
                      className="p-1"
                    >
                      <div 
                        className="w-full h-8 rounded shadow-sm"
                        style={{ 
                          backgroundColor: getColor(value),
                          transition: 'background-color 0.3s ease'
                        }}
                        title={`${value} mensagens enviadas`}
                      >
                        {value > 0 && (
                          <div className={`flex items-center justify-center h-full text-xs ${getTextColor(value)}`}>
                            {value}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legenda */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <span className="text-sm font-medium text-foreground">Volume de mensagens:</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500/30 border border-border shadow-sm"></div>
            <span className="ml-1 text-xs font-medium text-foreground">Baixo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500/50 border border-border shadow-sm"></div>
            <span className="ml-1 text-xs font-medium text-foreground">Médio</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500 border border-border shadow-sm"></div>
            <span className="ml-1 text-xs font-medium text-foreground">Alto</span>
          </div>
        </div>
      </div>
    </div>
  );
}