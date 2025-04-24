import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  numeric,
  json,
  bigint,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela de usuários do sistema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Tabela de corretores
export const brokers = pgTable("brokers", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  nome: text("nome").notNull(),
  email: text("email"),
  foto_url: text("foto_url"),
  cargo: text("cargo"),
  criado_em: timestamp("criado_em"),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertBrokerSchema = createInsertSchema(brokers).omit({
  updated_at: true,
});

// Tabela de leads
export const leads = pgTable("leads", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  nome: text("nome").notNull(),
  responsavel_id: bigint("responsavel_id", { mode: "number" }).references(
    () => brokers.id,
    { onDelete: "set null" },
  ),
  contato_nome: text("contato_nome"),
  valor: numeric("valor", { precision: 12, scale: 2 }),
  status_id: bigint("status_id", { mode: "number" }),
  pipeline_id: bigint("pipeline_id", { mode: "number" }),
  etapa: text("etapa"),
  criado_em: timestamp("criado_em"),
  atualizado_em: timestamp("atualizado_em"),
  fechado: boolean("fechado").default(false),
  status: text("status"),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  updated_at: true,
});

// Tabela de atividades
export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  lead_id: bigint("lead_id", { mode: "number" }).references(() => leads.id, {
    onDelete: "cascade",
  }),
  user_id: bigint("user_id", { mode: "number" }).references(() => brokers.id, {
    onDelete: "set null",
  }),
  tipo: text("tipo"),
  valor_anterior: text("valor_anterior"),
  valor_novo: text("valor_novo"),
  criado_em: timestamp("criado_em"),
  dia_semana: text("dia_semana"),
  hora: integer("hora"),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  updated_at: true,
});

// Tabela de pontuação dos corretores
export const broker_points = pgTable("broker_points", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .references(() => brokers.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  pontos: integer("pontos").default(0),
  leads_respondidos_1h: integer("leads_respondidos_1h").default(0),
  leads_visitados: integer("leads_visitados").default(0),
  propostas_enviadas: integer("propostas_enviadas").default(0),
  vendas_realizadas: integer("vendas_realizadas").default(0),
  leads_atualizados_mesmo_dia: integer("leads_atualizados_mesmo_dia").default(
    0,
  ),
  feedbacks_positivos: integer("feedbacks_positivos").default(0),
  resposta_rapida_3h: integer("resposta_rapida_3h").default(0),
  todos_leads_respondidos: integer("todos_leads_respondidos").default(0),
  cadastro_completo: integer("cadastro_completo").default(0),
  acompanhamento_pos_venda: integer("acompanhamento_pos_venda").default(0),
  leads_sem_interacao_24h: integer("leads_sem_interacao_24h").default(0),
  leads_respondidos_apos_18h: integer("leads_respondidos_apos_18h").default(0),
  leads_ignorados_48h: integer("leads_ignorados_48h").default(0),
  leads_perdidos: integer("leads_perdidos").default(0),
  leads_tempo_resposta_acima_12h: integer(
    "leads_tempo_resposta_acima_12h",
  ).default(0),
  leads_5_dias_sem_mudanca: integer("leads_5_dias_sem_mudanca").default(0),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertBrokerPointsSchema = createInsertSchema(broker_points).omit({
  updated_at: true,
});

// Tabela para configuração da API Kommo
export const kommo_config = pgTable("kommo_config", {
  id: serial("id").primaryKey(),
  api_url: text("api_url").notNull(),
  access_token: text("access_token").notNull(),
  refresh_token: text("refresh_token"),
  sync_interval: integer("sync_interval").default(60), // em minutos
  last_sync: timestamp("last_sync"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertKommoConfigSchema = createInsertSchema(kommo_config).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Types para TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Broker = typeof brokers.$inferSelect;
export type InsertBroker = z.infer<typeof insertBrokerSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type BrokerPoints = typeof broker_points.$inferSelect;
export type InsertBrokerPoints = z.infer<typeof insertBrokerPointsSchema>;

export type KommoConfig = typeof kommo_config.$inferSelect;
export type InsertKommoConfig = z.infer<typeof insertKommoConfigSchema>;
