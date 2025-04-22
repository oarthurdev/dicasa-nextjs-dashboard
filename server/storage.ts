import { 
  users, type User, type InsertUser,
  brokers, type Broker,
  properties, type Property,
  stats, type Stats 
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

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // DiCasa Dashboard specific methods
  getStats(): Promise<Stats | undefined>;
  getBrokerRankings(): Promise<Broker[]>;
  getBrokerById(id: number): Promise<Broker | undefined>;
  getBrokerPerformance(id: number): Promise<BrokerPerformance | undefined>;
  getBrokerRecentSales(id: number): Promise<Property[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brokerData: Map<number, Broker>;
  private propertyData: Map<number, Property>;
  private statsData: Stats | undefined;
  private brokerPerformance: Map<number, BrokerPerformance>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.brokerData = new Map();
    this.propertyData = new Map();
    this.brokerPerformance = new Map();
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

  async getStats(): Promise<Stats | undefined> {
    return this.statsData;
  }

  async getBrokerRankings(): Promise<Broker[]> {
    return Array.from(this.brokerData.values())
      .sort((a, b) => b.points - a.points);
  }

  async getBrokerById(id: number): Promise<Broker | undefined> {
    return this.brokerData.get(id);
  }

  async getBrokerPerformance(id: number): Promise<BrokerPerformance | undefined> {
    return this.brokerPerformance.get(id);
  }

  async getBrokerRecentSales(id: number): Promise<Property[]> {
    return Array.from(this.propertyData.values())
      .filter(property => property.broker_id === id)
      .sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())
      .slice(0, 5); // Return only the 5 most recent sales
  }

  // This is just for development and would be replaced by actual Supabase data in production
  private initializeSampleData() {
    // Mock brokers
    const sampleBrokers: Broker[] = [
      {
        id: 1,
        name: "João Dantas",
        specialty: "Luxury Properties",
        avatar_initials: "JD",
        avatar_color: "#6366F1", // primary
        points: 1258,
        properties_sold: 42,
        total_sales: "520000",
        last_month_properties: 34,
        last_month_sales: "452000",
        last_month_points: 1050,
        avg_sale_price: "1240000",
        last_month_avg_price: "1120000",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: "Maria Silva",
        specialty: "Commercial",
        avatar_initials: "MS",
        avatar_color: "#22C55E", // secondary
        points: 1150,
        properties_sold: 36,
        total_sales: "480000",
        last_month_properties: 31,
        last_month_sales: "436000",
        last_month_points: 970,
        avg_sale_price: "950000",
        last_month_avg_price: "865000",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: "Carlos Braga",
        specialty: "Residential",
        avatar_initials: "CB",
        avatar_color: "#F59E0B", // accent
        points: 985,
        properties_sold: 29,
        total_sales: "415000",
        last_month_properties: 25,
        last_month_sales: "384000",
        last_month_points: 840,
        avg_sale_price: "720000",
        last_month_avg_price: "655000",
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Add brokers to map
    sampleBrokers.forEach(broker => {
      this.brokerData.set(broker.id, broker);

      // Add broker performance data
      this.brokerPerformance.set(broker.id, {
        monthlyData: [
          { month: "Jan", salesAmount: 300000, propertiesSold: 3, points: 120 },
          { month: "Feb", salesAmount: 350000, propertiesSold: 4, points: 140 },
          { month: "Mar", salesAmount: 320000, propertiesSold: 3, points: 130 },
          { month: "Apr", salesAmount: 400000, propertiesSold: 5, points: 160 },
          { month: "May", salesAmount: 380000, propertiesSold: 4, points: 150 },
          { month: "Jun", salesAmount: 450000, propertiesSold: 6, points: 180 },
          { month: "Jul", salesAmount: 520000, propertiesSold: 7, points: 210 },
          { month: "Aug", salesAmount: 480000, propertiesSold: 6, points: 190 },
          { month: "Sep", salesAmount: 510000, propertiesSold: 7, points: 200 }
        ],
        propertyTypes: [
          { type: "Luxury", percentage: 45, count: 19 },
          { type: "Apartment", percentage: 30, count: 13 },
          { type: "House", percentage: 15, count: 6 },
          { type: "Commercial", percentage: 7, count: 3 },
          { type: "Land", percentage: 3, count: 1 }
        ]
      });
    });

    // Create sample properties for each broker
    const propertyTypes = ["Luxury", "Apartment", "House", "Commercial", "Land"];
    const locations = ["Jardim Oceânico", "Leblon", "Búzios", "Ipanema", "Barra da Tijuca"];
    let propertyId = 1;

    sampleBrokers.forEach(broker => {
      for (let i = 0; i < 5; i++) {
        const saleDate = new Date();
        saleDate.setDate(saleDate.getDate() - i * 5); // Sales over last month
        
        const property: Property = {
          id: propertyId++,
          title: `${propertyTypes[i % propertyTypes.length]} Property ${i+1}`,
          type: propertyTypes[i % propertyTypes.length],
          location: locations[i % locations.length],
          price: (1000000 + i * 200000).toString(),
          sale_date: saleDate,
          broker_id: broker.id,
          points: 50 + i * 10,
          created_at: new Date()
        };
        
        this.propertyData.set(property.id, property);
      }
    });

    // Create stats data
    this.statsData = {
      id: 1,
      total_properties: 325,
      monthly_sales: "1320000",
      active_brokers: 27,
      avg_sale_time: 42,
      last_month_properties: 290,
      last_month_sales: "1360000",
      last_month_active_brokers: 25,
      last_month_avg_sale_time: 47,
      region_data: JSON.stringify({
        north: { percentage: 32, count: 104 },
        south: { percentage: 24, count: 78 },
        east: { percentage: 19, count: 62 },
        west: { percentage: 25, count: 81 }
      }),
      monthly_performance: JSON.stringify([
        { month: "Jan", value: 900000 },
        { month: "Feb", value: 950000 },
        { month: "Mar", value: 920000 },
        { month: "Apr", value: 1100000 },
        { month: "May", value: 1050000 },
        { month: "Jun", value: 1320000 }
      ]),
      updated_at: new Date()
    };
  }
}

export const storage = new MemStorage();
