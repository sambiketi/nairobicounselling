import { pgTable, uuid, text, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";

export const therapists = pgTable("therapists", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  title: text("title"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  specialties: jsonb("specialties").$default(() => []),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Therapist = typeof therapists.$inferSelect;
export type NewTherapist = typeof therapists.$inferInsert;
