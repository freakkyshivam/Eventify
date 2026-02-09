import {
  pgTable,
  uuid,
  boolean,
  varchar,
  pgEnum,
  timestamp,
  numeric,
  uniqueIndex
} from "drizzle-orm/pg-core";

 

import { event_registration_table } from "./event_registration.schema";

export const payment_status_enum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
]);
export const payment_table = pgTable("payment", {
  id: uuid().primaryKey().defaultRandom(),

  registration_id: uuid("registration_id")
    .references(() => event_registration_table.id)
    .notNull(),

  payment_status: payment_status_enum().default("pending"),
  payment_id: varchar("payment_id", { length: 50 }),
  razorpay_order_id: varchar("razorpay_order_id", { length: 50 }),

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("INR"),

  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
},

(table) => ({
    uniq_registration: uniqueIndex("uniq_registration_payment")
      .on(table.registration_id),

    uniq_razorpay_order: uniqueIndex("uniq_razorpay_order")
      .on(table.razorpay_order_id),
  })
);

