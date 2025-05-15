import React from "react";
import { formatNumber } from "@/lib/utils";

interface MetricSummaryCardsProps {
  totalLeads: number;
  activeBrokers: number;
  averagePoints: number;
  totalSales: number;
  isLoading?: boolean;
}

export function MetricSummaryCards({
  totalLeads,
  activeBrokers,
  averagePoints,
  totalSales,
  isLoading = false,
}: MetricSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card/50 rounded-lg p-4 shadow-sm h-24 animate-pulse border border-border"
          >
            <div className="h-3 bg-muted rounded w-24 mb-3"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Total de Leads"
        value={totalLeads}
        textColor="text-blue-400"
      />
      <MetricCard
        title="Corretores Ativos"
        value={activeBrokers}
        textColor="text-primary"
      />
      <MetricCard
        title="Pontuação Máxima"
        value={averagePoints}
        textColor={averagePoints >= 0 ? "text-green-500" : "text-red-500"}
      />
      <MetricCard
        title="Vendas Realizadas"
        value={totalSales}
        textColor="text-purple-500"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  textColor: string;
}

function MetricCard({ title, value, textColor }: MetricCardProps) {
  return (
    <div className="bg-card rounded-lg p-5 shadow-md border border-border hover:shadow-lg transition-shadow hover:bg-card/80">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <p className={`text-4xl font-bold mt-1 ${textColor}`}>
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
    </div>
  );
}