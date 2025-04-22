import React from 'react';

interface Alert {
  tipo: string;
  mensagem: string;
  quantidade: number;
}

interface AlertListProps {
  alerts: Alert[];
}

export function AlertList({ alerts }: AlertListProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Alertas</h3>
        <p className="text-gray-500 text-sm">Nenhum alerta encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Alertas</h3>
      
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div 
            key={index}
            className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded"
          >
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">⚠</span>
              <span className="text-sm">{alert.mensagem}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}