import { uuid } from "drizzle-orm/pg-core";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "attendee",
  "organizer",
  "admin",
]);



export const users = pgTable("users", {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar("name", { length: 100 }).notNull(),
   
  email: varchar("email", { length: 250 }).notNull().unique(),
 
  role: userRoleEnum("role").notNull().default("attendee"),

  profileImageUrl: text("profile_image_url"),

  isAccountVerified: boolean("is_account_verified").notNull().default(false),

 organizer_request : boolean("orgainzer_request").notNull().default(false),
 
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export default users;
