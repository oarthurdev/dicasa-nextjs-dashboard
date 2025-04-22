CREATE TABLE IF NOT EXISTS broker_points (
    id bigint PRIMARY KEY,
    nome text NOT NULL,
    pontos integer DEFAULT 0,
    leads_respondidos_1h integer DEFAULT 0,
    leads_visitados integer DEFAULT 0,
    propostas_enviadas integer DEFAULT 0,
    vendas_realizadas integer DEFAULT 0,
    leads_atualizados_mesmo_dia integer DEFAULT 0,
    feedbacks_positivos integer DEFAULT 0,
    leads_sem_interacao_24h integer DEFAULT 0,
    leads_respondidos_apos_18h integer DEFAULT 0,
    leads_tempo_resposta_acima_12h integer DEFAULT 0,
    leads_5_dias_sem_mudanca integer DEFAULT 0,
    updated_at timestamp DEFAULT now(),
    FOREIGN KEY (id) REFERENCES brokers (id) ON DELETE CASCADE
);
