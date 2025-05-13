import { formatCurrency, formatNumber } from '@/lib/utils';
import type { Broker } from '@shared/schema';

interface BrokerRankingTableProps {
  brokers: Broker[];
  companyId: string;
}

export function BrokerRankingTable({ brokers, companyId }: BrokerRankingTableProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Broker Rankings</h2>
        <div className="bg-background rounded-lg px-3 py-1">
          <span className="text-primary text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="overflow-hidden">
        {brokers.map((broker, index) => (
          <div 
            key={broker.id} 
            className={cn(
              "flex items-center justify-between py-4 animate-slide-up",
              index < brokers.length - 1 ? "border-b border-gray-700" : ""
            )} 
            style={{ animationDelay: `${0.5 + index * 0.1}s` }}
          >
            <div className="flex items-center">
              <div className="font-mono text-lg w-8 text-right mr-4 font-bold">#{index + 1}</div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-center font-bold mr-4" 
                style={{ 
                  backgroundColor: `${broker.avatar_color}20`,
                  color: broker.avatar_color 
                }}
              >
                {broker.avatar_initials}
              </div>
              <div>
                <h3 className="font-medium">{broker.name}</h3>
                <p className="text-xs text-muted-foreground">{broker.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-muted-foreground text-xs">Properties</p>
                <p className="font-mono font-medium">{broker.properties_sold}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-xs">Sales</p>
                <p className="font-mono font-medium">{formatCurrency(broker.total_sales)}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-xs">Points</p>
                <p className="font-mono font-bold text-primary">{formatNumber(broker.points)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
```