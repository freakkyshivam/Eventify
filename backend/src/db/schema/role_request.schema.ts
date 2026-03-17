import { pgTable, uuid, pgEnum, varchar,timestamp } from "drizzle-orm/pg-core";
import users from "./user.model";
import { time } from "console";
import { boolean } from "drizzle-orm/pg-core";

export const status = pgEnum("status",['pending', 'approved', 'rejected']);

export const role_request_table = pgTable('role_request',{
    id : uuid().primaryKey().defaultRandom(),

    user_id : uuid("user_id").references(()=> users.id),

    requested_role : varchar("requsted_role").default("organizer"),

    status : status("status").default('pending'),
    used : boolean("used").default(false).notNull(),

    created_at : timestamp('created_at', {withTimezone : true}).defaultNow(),

    updated_at : timestamp("updated_at", {withTimezone : true}).$onUpdate(()=>new Date())
})