import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const marketplaceRole = pgEnum("marketplace_role", [
  "consumer",
  "provider",
  "admin",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: text("username"),
  website: text("website"),
  avatarUrl: text("avatar_url"),
  fullName: text("full_name"),
  role: marketplaceRole("role").notNull().default("consumer"),
  phone: varchar("phone", { length: 256 }),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  country: text("country"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
