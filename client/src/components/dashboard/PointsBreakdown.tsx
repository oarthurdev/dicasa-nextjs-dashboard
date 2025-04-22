import React from 'react';

interface PointCategory {
  categoria: string;
  quantidade: number;
  pontos: number;
  tipo: 'Positivo' | 'Negativo';
}

interface PointsBreakdownProps {
  data: PointCategory[];
}

export function PointsBreakdown({ data }: PointsBreakdownProps) {
  // Calcular totais
  const totalPositivo = data
    .filter(item => item.tipo === 'Positivo')
    .reduce((sum, item) => sum + item.pontos, 0);
  
  const totalNegativo = data
    .filter(item => item.tipo === 'Negativo')
    .reduce((sum, item) => sum + Math.abs(item.pontos), 0);
  
  const saldo = totalPositivo - totalNegativo;

  // Determinar a escala máxima para os gráficos
  const maxPositivo = Math.max(...data.filter(item => item.tipo === 'Positivo').map(item => item.pontos), 1);
  const maxNegativo = Math.max(...data.filter(item => item.tipo === 'Negativo').map(item => Math.abs(item.pontos)), 1);
  const maxValue = Math.max(maxPositivo, maxNegativo);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Detalhamento de Pontos</h3>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Negativo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Positivo</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-center mb-1">
              <span>{item.categoria}</span>
              <span className={item.tipo === 'Positivo' ? 'text-green-600' : 'text-red-600'}>
                {item.tipo === 'Positivo' ? '+' : ''}{item.pontos}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.tipo === 'Positivo' ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ 
                  width: `${(Math.abs(item.pontos) / maxValue) * 100}%`,
                  transition: 'width 0.5s ease'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500">Pontos positivos: </span>
            <span className="text-green-600 font-semibold">+{totalPositivo}</span>
          </div>
          <div>
            <span className="text-gray-500">Pontos negativos: </span>
            <span className="text-red-600 font-semibold">-{totalNegativo}</span>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-gray-500">Balanço: </span>
          <span className={`font-semibold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {saldo >= 0 ? '+' : ''}{saldo}
          </span>
        </div>
      </div>
    </div>
  );
}