import React from 'react';

interface HeatMapProps {
  data: {
    dias: string[];
    horarios: string[];
    dados: number[][];
  };
}

export function HeatMap({ data }: HeatMapProps) {
  const maxValue = data.dados.reduce((max, row) => {
    const rowMax = Math.max(...row);
    return rowMax > max ? rowMax : max;
  }, 0);

  const getColor = (value: number) => {
    if (value === 0) return 'rgba(30, 41, 59, 0.4)';
    const normalizedValue = value / maxValue;
    return `rgba(59, 130, 246, ${0.3 + (normalizedValue * 0.7)})`;
  };

  const getTextColor = (value: number) => {
    if (value === 0) return 'text-muted-foreground';
    const normalizedValue = value / maxValue;
    return normalizedValue > 0.4 ? 'text-primary-foreground font-semibold' : 'text-foreground font-medium';
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Mapa de Calor - Mensagens Enviadas</h3>

      <div className="w-full">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-20"></th>
              {data.dias.map((dia, index) => (
                <th key={index} className="text-sm font-medium text-foreground">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.horarios.map((horario, horarioIndex) => (
              <tr key={horarioIndex}>
                <td className="text-xs font-medium text-foreground text-right pr-2">{`${horario}`}</td>
                {data.dias.map((_, diaIndex) => {
                  const value = data.dados[diaIndex][horarioIndex] || 0;
                  return (
                    <td 
                      key={diaIndex} 
                      className="p-0"
                    >
                      <div 
                        className="aspect-square rounded flex items-center justify-center"
                        style={{ 
                          backgroundColor: getColor(value),
                          transition: 'background-color 0.3s ease'
                        }}
                        title={`${value} mensagens enviadas`}
                      >
                        {value > 0 && (
                          <span className={`text-xs ${getTextColor(value)}`}>
                            {value}
                          </span>
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

      <div className="mt-4 flex items-center justify-end gap-3">
        <span className="text-sm font-medium text-foreground">Volume de mensagens:</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500/30 border border-border"></div>
            <span className="ml-1 text-xs font-medium text-foreground">Baixo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500/50 border border-border"></div>
            <span className="ml-1 text-xs font-medium text-foreground">Médio</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500 border border-border"></div>
            <span className="ml-1 text-xs font-medium text-foreground">Alto</span>
          </div>
        </div>
      </div>
    </div>
  );
}