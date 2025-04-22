import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const brokers = pgTable("brokers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  avatar_initials: text("avatar_initials").notNull(),
  avatar_color: text("avatar_color").notNull(),
  points: integer("points").notNull().default(0),
  properties_sold: integer("properties_sold").notNull().default(0),
  total_sales: numeric("total_sales", { precision: 12, scale: 2 }).notNull().default("0"),
  last_month_properties: integer("last_month_properties").notNull().default(0),
  last_month_sales: numeric("last_month_sales", { precision: 12, scale: 2 }).notNull().default("0"),
  last_month_points: integer("last_month_points").notNull().default(0),
  avg_sale_price: numeric("avg_sale_price", { precision: 12, scale: 2 }).notNull().default("0"),
  last_month_avg_price: numeric("last_month_avg_price", { precision: 12, scale: 2 }).notNull().default("0"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertBrokerSchema = createInsertSchema(brokers).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  sale_date: timestamp("sale_date").defaultNow(),
  broker_id: integer("broker_id").notNull(),
  points: integer("points").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  created_at: true,
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  total_properties: integer("total_properties").notNull().default(0),
  monthly_sales: numeric("monthly_sales", { precision: 12, scale: 2 }).notNull().default("0"),
  active_brokers: integer("active_brokers").notNull().default(0),
  avg_sale_time: integer("avg_sale_time").notNull().default(0),
  last_month_properties: integer("last_month_properties").notNull().default(0),
  last_month_sales: numeric("last_month_sales", { precision: 12, scale: 2 }).notNull().default("0"),
  last_month_active_brokers: integer("last_month_active_brokers").notNull().default(0),
  last_month_avg_sale_time: integer("last_month_avg_sale_time").notNull().default(0),
  region_data: json("region_data").notNull().default({}),
  monthly_performance: json("monthly_performance").notNull().default({}),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  updated_at: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Broker = typeof brokers.$inferSelect;
export type InsertBroker = z.infer<typeof insertBrokerSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
