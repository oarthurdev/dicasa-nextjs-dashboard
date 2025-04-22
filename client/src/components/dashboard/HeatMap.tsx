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

  // Função para calcular a cor baseada no valor normalizado
  const getColor = (value: number) => {
    if (value === 0) return 'rgba(241, 245, 249, 0.8)'; // Cinza claro para valor zero
    
    const normalizedValue = value / maxValue;
    const intensity = Math.min(Math.floor(normalizedValue * 100), 100);
    
    // Escala de azul (do mais claro ao mais escuro)
    return `rgba(37, 99, 235, ${0.2 + (normalizedValue * 0.8)})`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Mapa de Calor - Atividades</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="font-normal"></th>
              {data.dias.map((dia, index) => (
                <th key={index} className="px-2 py-1 font-normal">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.horarios.map((horario, row) => (
              <tr key={row}>
                <td className="text-xs text-gray-500 p-1">{horario}</td>
                {data.dias.map((_, col) => {
                  const value = data.dados[row] ? data.dados[row][col] || 0 : 0;
                  return (
                    <td 
                      key={col} 
                      className="p-1"
                    >
                      <div 
                        className="w-full h-8 rounded"
                        style={{ 
                          backgroundColor: getColor(value),
                          transition: 'background-color 0.3s ease'
                        }}
                        title={`${value} atividades`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legenda */}
      <div className="mt-3 flex items-center justify-end text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded bg-blue-100"></div>
          <span>0</span>
        </div>
        <div className="mx-2">-</div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded bg-blue-700"></div>
          <span>1</span>
        </div>
      </div>
    </div>
  );
}