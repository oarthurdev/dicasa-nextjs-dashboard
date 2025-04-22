import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Broker related queries
export async function getBrokerRankings() {
  const { data, error } = await supabase
    .from('broker_points')
    .select('*')
    .order('pontos', { ascending: false });
    
  if (error) {
    console.error('Error fetching broker rankings:', error);
    throw error;
  }
  
  return data;
}

export async function getBrokerById(id: number) {
  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching broker with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function getBrokerPoints(id: number) {
  const { data, error } = await supabase
    .from('broker_points')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching points for broker with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function getBrokerLeads(id: number) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('responsavel_id', id)
    .order('criado_em', { ascending: false });
    
  if (error) {
    console.error(`Error fetching leads for broker with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function getBrokerActivities(id: number) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', id)
    .order('criado_em', { ascending: false });
    
  if (error) {
    console.error(`Error fetching activities for broker with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Analytics related queries
export async function getBrokerPerformance(brokerId: number) {
  // Gerar dados de performance mensal baseados nas atividades
  try {
    // Obter as atividades e leads do corretor
    const activities = await getBrokerActivities(brokerId);
    const leads = await getBrokerLeads(brokerId);
    
    // Agrupar por mês e calcular métricas
    const monthlyData = generateMonthlyData(activities, leads);
    
    // Calcular tipos de propriedades
    const propertyTypes = calculatePropertyTypes(leads);
    
    return {
      monthlyData,
      propertyTypes
    };
  } catch (error) {
    console.error(`Error generating performance data for broker ${brokerId}:`, error);
    throw error;
  }
}

// Função auxiliar para gerar heatmap de atividades
export async function getActivityHeatmap(brokerId: number) {
  try {
    // Buscar atividades do corretor
    const { data, error } = await supabase
      .from('activities')
      .select('dia_semana, hora')
      .eq('user_id', brokerId);
      
    if (error) {
      throw error;
    }
    
    // Gerar heatmap
    const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    const horarios = Array.from({ length: 24 }, (_, i) => `${i}h`);
    
    // Inicializar matriz de dados com zeros
    const dados = Array(7).fill(0).map(() => Array(24).fill(0));
    
    // Preencher os dados
    if (data) {
      data.forEach(activity => {
        const diaIndex = dias.indexOf(activity.dia_semana);
        const hora = activity.hora;
        
        if (diaIndex >= 0 && hora >= 0 && hora < 24) {
          dados[diaIndex][hora]++;
        }
      });
    }
    
    return {
      dias,
      horarios,
      dados
    };
  } catch (error) {
    console.error(`Error generating heatmap for broker ${brokerId}:`, error);
    throw error;
  }
}

// Função auxiliar para obter alertas do corretor
export async function getBrokerAlerts(brokerId: number) {
  try {
    // Obter os pontos do corretor
    const brokerPoints = await getBrokerPoints(brokerId);
    
    if (!brokerPoints) {
      return [];
    }
    
    const alerts = [];
    
    // Verificar leads sem interação
    if (brokerPoints.leads_sem_interacao_24h > 0) {
      alerts.push({
        tipo: 'warning',
        mensagem: 'Leads sem interação há mais de 24h',
        quantidade: brokerPoints.leads_sem_interacao_24h
      });
    }
    
    // Verificar leads respondidos após 18h
    if (brokerPoints.leads_respondidos_apos_18h > 0) {
      alerts.push({
        tipo: 'warning',
        mensagem: 'Leads respondidos após 18h',
        quantidade: brokerPoints.leads_respondidos_apos_18h
      });
    }
    
    // Verificar leads sem mudança por 5+ dias
    if (brokerPoints.leads_5_dias_sem_mudanca > 0) {
      alerts.push({
        tipo: 'critical',
        mensagem: 'Leads sem atualização há mais de 5 dias',
        quantidade: brokerPoints.leads_5_dias_sem_mudanca
      });
    }
    
    return alerts;
  } catch (error) {
    console.error(`Error generating alerts for broker ${brokerId}:`, error);
    throw error;
  }
}

// Funções auxiliares para análise de dados
function generateMonthlyData(activities, leads) {
  // Exemplo simplificado - em produção, você usaria datas reais dos dados
  return [
    { month: 'Jan', salesAmount: 450000, propertiesSold: 2, points: 45 },
    { month: 'Fev', salesAmount: 320000, propertiesSold: 1, points: 30 },
    { month: 'Mar', salesAmount: 780000, propertiesSold: 3, points: 72 },
    { month: 'Abr', salesAmount: 550000, propertiesSold: 2, points: 53 },
    { month: 'Mai', salesAmount: 630000, propertiesSold: 2, points: 48 },
    { month: 'Jun', salesAmount: 920000, propertiesSold: 4, points: 85 }
  ];
}

function calculatePropertyTypes(leads) {
  // Exemplo simplificado - em produção, você extrairia estes dados dos leads
  return [
    { type: 'Apartamento', percentage: 45, count: 9 },
    { type: 'Casa', percentage: 30, count: 6 },
    { type: 'Terreno', percentage: 15, count: 3 },
    { type: 'Comercial', percentage: 10, count: 2 }
  ];
}
