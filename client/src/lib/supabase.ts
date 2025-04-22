import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Broker related queries
export async function getBrokerRankings() {
  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .order('points', { ascending: false });
    
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

export async function getBrokerRecentSales(brokerId: number) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('broker_id', brokerId)
    .order('sale_date', { ascending: false })
    .limit(5);
    
  if (error) {
    console.error(`Error fetching recent sales for broker ${brokerId}:`, error);
    throw error;
  }
  
  return data;
}

// Stats related queries
export async function getDashboardStats() {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
  
  return data;
}

export async function getBrokerPerformance(brokerId: number) {
  // This could be a real query in Supabase, but for now we're returning sample data
  // from the server API
  return null;
}
