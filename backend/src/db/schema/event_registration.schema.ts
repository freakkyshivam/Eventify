import { pgTable, uuid, boolean, varchar,pgEnum,timestamp } from "drizzle-orm/pg-core";

import events from "./event.model";
import users from "./user.model";

export const registration_status_enum = pgEnum('registration_status', ["registered", "cancelled", "attended"])


export const payment_status_enum = pgEnum("payment_status",["pending", "completed", "failed"])

export const event_registration_table = pgTable('event_registration',{
    id : uuid().primaryKey().defaultRandom(),

    event_id : uuid("event_id").references(()=> events.id),

    user_id : uuid("user_id").references(()=> users.id),

    registration_date : timestamp("registration_date",{withTimezone:true}).defaultNow(),

    registration_status : registration_status_enum().default("registered"),

    payment_id : payment_status_enum().default('pending'),
    razorpay_order_id : varchar("razorpay_order_id",{length : 50}).notNull(),

    ticket_code : varchar("ticket_code", {length:50}).notNull(),

    created_at : timestamp("created_at", {withTimezone : true}).defaultNow(),
    updated_at : timestamp("updated_at",{withTimezone: true}).$onUpdate(()=> new Date())
})