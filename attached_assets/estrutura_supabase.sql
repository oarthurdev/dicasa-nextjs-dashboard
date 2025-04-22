-- Criar tabela para armazenar dados dos corretores
CREATE TABLE IF NOT EXISTS brokers (
    id bigint PRIMARY KEY,
    nome text NOT NULL,
    email text,
    foto_url text,
    cargo text,
    criado_em timestamp,
    updated_at timestamp DEFAULT now()
);

-- Criar tabela para armazenar dados dos leads
CREATE TABLE IF NOT EXISTS leads (
    id bigint PRIMARY KEY,
    nome text NOT NULL,
    responsavel_id bigint,
    contato_nome text,
    valor numeric,
    status_id bigint,
    pipeline_id bigint,
    etapa text,
    criado_em timestamp,
    atualizado_em timestamp,
    fechado boolean DEFAULT false,
    status text,
    updated_at timestamp DEFAULT now(),
    FOREIGN KEY (responsavel_id) REFERENCES brokers (id) ON DELETE SET NULL
);

-- Criar tabela para armazenar dados das atividades
CREATE TABLE IF NOT EXISTS activities (
    id text PRIMARY KEY,
    lead_id bigint,
    user_id bigint,
    tipo text,
    valor_anterior text,
    valor_novo text,
    criado_em timestamp,
    dia_semana text,
    hora integer,
    updated_at timestamp DEFAULT now(),
    FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES brokers (id) ON DELETE SET NULL
);

-- Criar tabela para armazenar a pontuação dos corretores
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
