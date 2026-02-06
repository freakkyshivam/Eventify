 
import { pgTable, uuid, timestamp, text, boolean } from "drizzle-orm/pg-core";
import users from "./user.model";

export const sessionsTable = pgTable('sesssions_table',{

    sid : text("session_id").primaryKey().notNull(),

    user_id : uuid("user_id").references(()=>users.id).notNull(),

    hash_refresh_token : text("hash_refresh_token").notNull(),

    active : boolean("active").default(true),

    device : text("device_name").notNull(),
    os : text("os").notNull(),
    browser : text("browser").notNull(),

    revoked_at : timestamp("revoked_at",{withTimezone : true}),

    created_at : timestamp("created_at", {withTimezone : true}).defaultNow(),

    updated_at : timestamp("updated_at", {withTimezone : true}).$onUpdate(()=> new Date())
})

export default sessionsTable;