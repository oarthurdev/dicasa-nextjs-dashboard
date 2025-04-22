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
    if (value === 0) return 'rgba(30, 41, 59, 0.4)'; // Azul escuro para valor zero
    
    const normalizedValue = value / maxValue;
    
    // Escala de azul para tema dark (do mais escuro ao mais claro/vibrante)
    return `rgba(59, 130, 246, ${0.2 + (normalizedValue * 0.8)})`;
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">Mapa de Calor - Mensagens Enviadas</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-muted-foreground">
              <th className="font-normal"></th>
              {data.dias.map((dia, index) => (
                <th key={index} className="px-2 py-1 font-normal">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.horarios.map((horario, horarioIndex) => (
              <tr key={horarioIndex}>
                <td className="text-xs text-muted-foreground p-1">{horario}</td>
                {data.dias.map((_, diaIndex) => {
                  // Ajuste os índices para corresponder aos dados
                  const value = data.dados[diaIndex][horarioIndex] || 0;
                  return (
                    <td 
                      key={diaIndex} 
                      className="p-1"
                    >
                      <div 
                        className="w-full h-8 rounded"
                        style={{ 
                          backgroundColor: getColor(value),
                          transition: 'background-color 0.3s ease'
                        }}
                        title={`${value} mensagens enviadas`}
                      >
                        {value > 0 && (
                          <div className="flex items-center justify-center h-full text-xs font-medium text-white">
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
      <div className="mt-3 flex items-center justify-end text-xs text-muted-foreground">
        <span className="mr-2">Volume de mensagens:</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded bg-blue-900 opacity-40"></div>
          <span>Baixo</span>
        </div>
        <div className="mx-2">-</div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Alto</span>
        </div>
      </div>
    </div>
  );
}