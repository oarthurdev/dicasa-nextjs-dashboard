import { 
  users, type User, type InsertUser,
  brokers, type Broker, type InsertBroker,
  leads, type Lead, type InsertLead,
  activities, type Activity, type InsertActivity,
  broker_points, type BrokerPoints, type InsertBrokerPoints,
  kommo_config, type KommoConfig, type InsertKommoConfig
} from "@shared/schema";

// Define additional types for performance data
interface BrokerPerformance {
  monthlyData: {
    month: string;
    salesAmount: number;
    propertiesSold: number;
    points: number;
  }[];
  propertyTypes: {
    type: string;
    percentage: number;
    count: number;
  }[];
}

// Define data for heatmap
interface HeatmapData {
  dias: string[];
  horarios: string[];
  dados: number[][];
}

// Define data for alerts
interface BrokerAlert {
  tipo: string;
  mensagem: string;
  quantidade: number;
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Kommo API configuration
  getKommoConfig(): Promise<KommoConfig | undefined>;
  updateKommoConfig(config: InsertKommoConfig): Promise<KommoConfig>;
  
  // Dashboard methods
  getBrokerRankings(): Promise<BrokerPoints[]>;
  getBrokerById(id: number): Promise<Broker | undefined>;
  getBrokerPoints(id: number): Promise<BrokerPoints | undefined>;
  getBrokerLeads(id: number): Promise<Lead[]>;
  getBrokerActivities(id: number): Promise<Activity[]>;
  
  // Analytics methods
  getBrokerPerformance(id: number): Promise<BrokerPerformance>;
  getActivityHeatmap(id: number): Promise<HeatmapData>;
  getBrokerAlerts(id: number): Promise<BrokerAlert[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brokerData: Map<number, Broker>;
  private leadData: Map<number, Lead>;
  private activityData: Map<string, Activity>;
  private brokerPointsData: Map<number, BrokerPoints>;
  private kommoConfigData: KommoConfig | undefined;
  private brokerPerformance: Map<number, BrokerPerformance>;
  private brokerHeatmap: Map<number, HeatmapData>;
  private brokerAlerts: Map<number, BrokerAlert[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.brokerData = new Map();
    this.leadData = new Map();
    this.activityData = new Map();
    this.brokerPointsData = new Map();
    this.brokerPerformance = new Map();
    this.brokerHeatmap = new Map();
    this.brokerAlerts = new Map();
    this.currentId = 1;
    
    // Initialize with sample data for development
    this.initializeSampleData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getKommoConfig(): Promise<KommoConfig | undefined> {
    return this.kommoConfigData;
  }

  async updateKommoConfig(config: InsertKommoConfig): Promise<KommoConfig> {
    this.kommoConfigData = {
      id: 1,
      ...config,
      created_at: new Date(),
      updated_at: new Date()
    };
    return this.kommoConfigData;
  }

  async getBrokerRankings(): Promise<BrokerPoints[]> {
    return Array.from(this.brokerPointsData.values())
      .sort((a, b) => b.pontos - a.pontos);
  }

  async getBrokerById(id: number): Promise<Broker | undefined> {
    return this.brokerData.get(id);
  }

  async getBrokerPoints(id: number): Promise<BrokerPoints | undefined> {
    return this.brokerPointsData.get(id);
  }

  async getBrokerLeads(id: number): Promise<Lead[]> {
    return Array.from(this.leadData.values())
      .filter(lead => lead.responsavel_id === id);
  }

  async getBrokerActivities(id: number): Promise<Activity[]> {
    return Array.from(this.activityData.values())
      .filter(activity => activity.user_id === id);
  }

  async getBrokerPerformance(id: number): Promise<BrokerPerformance> {
    return this.brokerPerformance.get(id) || {
      monthlyData: [],
      propertyTypes: []
    };
  }

  async getActivityHeatmap(id: number): Promise<HeatmapData> {
    return this.brokerHeatmap.get(id) || {
      dias: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
      horarios: ["08h - 10h", "10h - 12h", "12h - 14h", "14h - 16h", "16h - 18h", "18h - 20h", "20h - 22h"],
      dados: []
    };
  }

  async getBrokerAlerts(id: number): Promise<BrokerAlert[]> {
    return this.brokerAlerts.get(id) || [];
  }

  // This is just for development and would be replaced by actual database data in production
  private initializeSampleData() {
    // Mock kommo config
    this.kommoConfigData = {
      id: 1,
      api_url: "https://example.kommo.com/api/v4",
      access_token: "example_access_token",
      refresh_token: "example_refresh_token",
      sync_interval: 60,
      last_sync: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };

    // Mock brokers
    const sampleBrokers: Broker[] = [
      {
        id: 1,
        nome: "Jocimar Figueiredo",
        email: "jocimar@example.com",
        foto_url: "https://example.com/photos/jocimar.jpg",
        cargo: "Corretor",
        criado_em: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        nome: "Abel Francisco Fa",
        email: "abel@example.com",
        foto_url: "https://example.com/photos/abel.jpg",
        cargo: "Corretor",
        criado_em: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        nome: "Lenonn",
        email: "lenonn@example.com",
        foto_url: "https://example.com/photos/lenonn.jpg",
        cargo: "Corretor",
        criado_em: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        nome: "Maicon",
        email: "maicon@example.com",
        foto_url: "https://example.com/photos/maicon.jpg",
        cargo: "Corretor",
        criado_em: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        nome: "Gabriel",
        email: "gabriel@example.com",
        foto_url: "https://example.com/photos/gabriel.jpg",
        cargo: "Corretor",
        criado_em: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        nome: "Sirvelaine",
        email: "sirvelaine@example.com",
        foto_url: "https://example.com/photos/sirvelaine.jpg",
        cargo: "Corretor",
        criado_em: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        nome: "Tatiane Batista",
        email: "tatiane@example.com",
        foto_url: "https://example.com/photos/tatiane.jpg",
        cargo: "Corretor",
        criado_em: new Date(),
        updated_at: new Date()
      }
    ];

    // Add brokers to map
    sampleBrokers.forEach(broker => {
      this.brokerData.set(broker.id, broker);
    });

    // Broker points data
    const sampleBrokerPoints: BrokerPoints[] = [
      {
        id: 1,
        nome: "Jocimar Figueiredo",
        pontos: -75,
        leads_respondidos_1h: 0,
        leads_visitados: 0,
        propostas_enviadas: 0,
        vendas_realizadas: 1,
        leads_atualizados_mesmo_dia: 0,
        feedbacks_positivos: 0,
        leads_sem_interacao_24h: 0,
        leads_respondidos_apos_18h: 0,
        leads_tempo_resposta_acima_12h: 0,
        leads_5_dias_sem_mudanca: 0,
        updated_at: new Date()
      },
      {
        id: 2,
        nome: "Abel Francisco Fa",
        pontos: -168,
        leads_respondidos_1h: 0,
        leads_visitados: 0,
        propostas_enviadas: 0,
        vendas_realizadas: 1,
        leads_atualizados_mesmo_dia: 0,
        feedbacks_positivos: 0,
        leads_sem_interacao_24h: 0,
        leads_respondidos_apos_18h: 0,
        leads_tempo_resposta_acima_12h: 0,
        leads_5_dias_sem_mudanca: 0,
        updated_at: new Date()
      },
      {
        id: 3,
        nome: "Lenonn",
        pontos: -187,
        leads_respondidos_1h: 0,
        leads_visitados: 0,
        propostas_enviadas: 0,
        vendas_realizadas: 9,
        leads_atualizados_mesmo_dia: 0,
        feedbacks_positivos: 0,
        leads_sem_interacao_24h: 5,
        leads_respondidos_apos_18h: 0,
        leads_tempo_resposta_acima_12h: 0,
        leads_5_dias_sem_mudanca: 0,
        updated_at: new Date()
      },
      {
        id: 4,
        nome: "Maicon",
        pontos: -208,
        leads_respondidos_1h: 4,
        leads_visitados: 0,
        propostas_enviadas: 0,
        vendas_realizadas: 0,
        leads_atualizados_mesmo_dia: 0,
        feedbacks_positivos: 0,
        leads_sem_interacao_24h: 30,
        leads_respondidos_apos_18h: 5,
        leads_tempo_resposta_acima_12h: 0,
        leads_5_dias_sem_mudanca: 15,
        updated_at: new Date()
      },
      {
        id: 5,
        nome: "Gabriel",
        pontos: -436,
        leads_respondidos_1h: 0,
        leads_visitados: 0,
        propostas_enviadas: 0,
        vendas_realizadas: 5,
        leads_atualizados_mesmo_dia: 0,
        feedbacks_positivos: 0,
        leads_sem_interacao_24h: 0,
        leads_respondidos_apos_18h: 0,
        leads_tempo_resposta_acima_12h: 0,
        leads_5_dias_sem_mudanca: 0,
        updated_at: new Date()
      },
      {
        id: 6,
        nome: "Sirvelaine",
        pontos: -607,
        leads_respondidos_1h: 0,
        leads_visitados: 0,
        propostas_enviadas: 0,
        vendas_realizadas: 0,
        leads_atualizados_mesmo_dia: 0,
        feedbacks_positivos: 0,
        leads_sem_interacao_24h: 0,
        leads_respondidos_apos_18h: 0,
        leads_tempo_resposta_acima_12h: 0,
        leads_5_dias_sem_mudanca: 0,
        updated_at: new Date()
      },
      {
        id: 7,
        nome: "Tatiane Batista",
        pontos: -1510,
        leads_respondidos_1h: 0,
        leads_visitados: 0,
        propostas_enviadas: 0,
        vendas_realizadas: 1,
        leads_atualizados_mesmo_dia: 0,
        feedbacks_positivos: 0,
        leads_sem_interacao_24h: 0,
        leads_respondidos_apos_18h: 0,
        leads_tempo_resposta_acima_12h: 0,
        leads_5_dias_sem_mudanca: 0,
        updated_at: new Date()
      }
    ];

    // Add broker points to map
    sampleBrokerPoints.forEach(brokerPoint => {
      this.brokerPointsData.set(brokerPoint.id, brokerPoint);
    });

    // Create sample leads for each broker
    let leadId = 1;

    sampleBrokers.forEach(broker => {
      // Add sample leads
      for (let i = 0; i < 5; i++) {
        const lead: Lead = {
          id: leadId++,
          nome: `Lead ${leadId} - Cliente Potencial`,
          responsavel_id: broker.id,
          contato_nome: `Contato ${i+1}`,
          valor: (500000 + i * 100000),
          status_id: 100 + i,
          pipeline_id: 8865067,
          etapa: i === 0 ? "Contato Inicial" : 
                 i === 1 ? "Qualificação" : 
                 i === 2 ? "Apresentação" : 
                 i === 3 ? "Proposta" : "Negociação",
          criado_em: new Date(new Date().setDate(new Date().getDate() - i * 3)),
          atualizado_em: new Date(new Date().setDate(new Date().getDate() - i)),
          fechado: false,
          status: "Em progresso",
          updated_at: new Date()
        };
        
        this.leadData.set(lead.id, lead);
      }
    });

    // Create sample activities for each broker
    sampleBrokers.forEach(broker => {
      // Get leads for this broker
      const brokerLeads = Array.from(this.leadData.values())
        .filter(lead => lead.responsavel_id === broker.id);
      
      if (brokerLeads.length > 0) {
        let activityId = broker.id * 1000;
        
        // Create activities for each lead
        brokerLeads.forEach(lead => {
          // Add some message activities
          const messageTypes = ["mensagem_enviada", "mensagem_recebida"];
          for (let i = 0; i < 4; i++) {
            const activity: Activity = {
              id: `activity_${activityId++}`,
              lead_id: lead.id,
              user_id: broker.id,
              tipo: messageTypes[i % 2],
              valor_anterior: "",
              valor_novo: `Conteúdo da mensagem ${i+1}`,
              criado_em: new Date(new Date().setHours(9 + i*2)),
              dia_semana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"][Math.floor(Math.random() * 5)],
              hora: 9 + i*2,
              updated_at: new Date()
            };
            
            this.activityData.set(activity.id, activity);
          }
          
          // Add some status change activities
          const statusChanges = [
            { from: "Novo Lead", to: "Contato Inicial" },
            { from: "Contato Inicial", to: "Qualificação" },
            { from: "Qualificação", to: "Apresentação" },
            { from: "Apresentação", to: "Proposta" }
          ];
          
          for (let i = 0; i < 3; i++) {
            const activity: Activity = {
              id: `activity_${activityId++}`,
              lead_id: lead.id,
              user_id: broker.id,
              tipo: "mudança_status",
              valor_anterior: statusChanges[i].from,
              valor_novo: statusChanges[i].to,
              criado_em: new Date(new Date().setDate(new Date().getDate() - (3-i))),
              dia_semana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"][Math.floor(Math.random() * 5)],
              hora: 10 + i,
              updated_at: new Date()
            };
            
            this.activityData.set(activity.id, activity);
          }
        });
      }
    });

    // Create broker performance data
    sampleBrokerPoints.forEach(broker => {
      // Add broker performance data
      this.brokerPerformance.set(broker.id, {
        monthlyData: [
          { month: "Jan", salesAmount: 300000, propertiesSold: 3, points: 120 },
          { month: "Fev", salesAmount: 350000, propertiesSold: 4, points: 140 },
          { month: "Mar", salesAmount: 320000, propertiesSold: 3, points: 130 },
          { month: "Abr", salesAmount: 400000, propertiesSold: 5, points: 160 },
          { month: "Mai", salesAmount: 380000, propertiesSold: 4, points: 150 },
          { month: "Jun", salesAmount: 450000, propertiesSold: 6, points: 180 }
        ],
        propertyTypes: [
          { type: "Apartamento", percentage: 45, count: 19 },
          { type: "Casa", percentage: 30, count: 13 },
          { type: "Terreno", percentage: 15, count: 6 },
          { type: "Comercial", percentage: 7, count: 3 },
          { type: "Rural", percentage: 3, count: 1 }
        ]
      });

      // Criar dados do mapa de calor para cada corretor
      const heatmapData: HeatmapData = {
        dias: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
        horarios: ["08h - 10h", "10h - 12h", "12h - 14h", "14h - 16h", "16h - 18h", "18h - 20h", "20h - 22h"],
        dados: [
          [5, 3, 7, 4, 6, 2, 0],
          [8, 6, 4, 5, 7, 3, 1],
          [3, 5, 6, 4, 2, 1, 0],
          [9, 7, 8, 6, 5, 2, 1],
          [6, 8, 9, 7, 5, 3, 0],
          [4, 2, 3, 5, 4, 2, 0],
          [2, 1, 0, 2, 1, 0, 0]
        ]
      };
      
      this.brokerHeatmap.set(broker.id, heatmapData);

      // Criar alertas para o corretor (específico para o corretor Maicon)
      if (broker.id === 4) {
        const alerts: BrokerAlert[] = [
          {
            tipo: "warning",
            mensagem: "30 leads sem interação há mais de 24h",
            quantidade: 30
          },
          {
            tipo: "warning",
            mensagem: "5 leads respondidos após 18h",
            quantidade: 5
          },
          {
            tipo: "warning",
            mensagem: "15 leads com mais de 5 dias sem mudança de etapa",
            quantidade: 15
          }
        ];
        
        this.brokerAlerts.set(broker.id, alerts);
      }
    });
  }
}

export const storage = new MemStorage();
