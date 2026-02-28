import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import users from "./user.model";
 
// Enums

export const eventModeEnum = pgEnum("event_mode", [
  "online",
  "offline",
]);

export const eventCategoryEnum = pgEnum("event_category", [
  "conference",
  "webinar",
  "workshop",
  "competition",
  "technology",
  "coding",
  "other",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "upcoming",
  "cancelled",
  "completed",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "free",
  "paid",
]);

 // Table

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),

    description: text("description").notNull(),

    bannerUrls: text("banner_urls")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    start_time: timestamp("start_time", { withTimezone: true }).notNull(),
    end_time: timestamp("end_time", { withTimezone: true }).notNull(),

    registration_deadline: timestamp("registration_deadline", {
      withTimezone: true,
    }).notNull(),

    location: varchar("location", { length: 200 }).default("Online"),

    event_mode: eventModeEnum("event_mode").notNull(),

    capacity: integer("capacity").notNull().default(100),

    event_category: eventCategoryEnum("event_category").notNull(),

    payment_type: paymentTypeEnum("payment_type").notNull(),
    price: integer("price").notNull().default(0),

    event_status: eventStatusEnum("event_status")
      .notNull()
      .default("upcoming"),

    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    isDeleted: boolean("is_deleted").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    authorIdx: index("events_author_idx").on(table.authorId),
    statusIdx: index("events_status_idx").on(table.event_status),
    categoryIdx: index("events_category_idx").on(table.event_category),
    statusCategoryIdx: index("events_status_category_idx").on(
      table.event_status,
      table.event_category
    ),
  })
);

export default events;
