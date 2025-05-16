import React from "react";

type FunnelStage = {
  name: string;
  value: number;
};

type FunnelBarProps = {
  stages: FunnelStage[];
  totalLeads: number;
};

const getColorForStage = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export const FunnelBar = ({ stages, totalLeads }: FunnelBarProps) => {
  return (
    <div className="w-full">
      <div className="flex w-full h-16 rounded overflow-hidden shadow">
        {stages.map((stage, idx) => {
          const width = stage.value;
          const color = getColorForStage(stage.name);
          const showLabel = width >= 15;

          return (
            <div
              key={idx}
              className="flex items-center justify-center text-white text-xs font-semibold overflow-hidden"
              style={{
                backgroundColor: color,
                width: `${width}%`,
                minWidth: "4px",
                whiteSpace: "nowrap",
              }}
            >
              {showLabel ? (
                <div className="text-center leading-tight px-1 truncate">
                  <div>{stage.name}</div>
                  <div>{stage.value.toFixed(0)}%</div>
                </div>
              ) : (
                <div className="text-xs px-1">{stage.value.toFixed(0)}%</div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center mt-4 text-gray-400">
        Total de Leads:{" "}
        <span className="text-white font-semibold">{totalLeads}</span>
      </p>

      <div className="mt-6 space-y-2">
        <h4 className="text-white font-semibold text-sm mb-2">Legenda:</h4>
        {stages.map((stage, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-sm text-gray-200"
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColorForStage(stage.name) }}
            ></div>
            <span>{stage.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
