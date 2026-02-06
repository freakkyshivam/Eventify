import {uuid, pgTable, text, timestamp} from 'drizzle-orm/pg-core'
import users from './user.model'
import { boolean } from 'drizzle-orm/pg-core'
import { varchar } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';

export const magiclink_purpose = pgEnum('purpose',['login', 'register'])

export const magicLinkTable = pgTable('magic_link_table',{
    id : uuid("magic_link_id").primaryKey().defaultRandom(),

    // user_id : uuid("user_id").references(()=>users.id ).notNull(),

    email : varchar("email", {length:250}).notNull().unique(),

    hashed_token : text("hashed_token").notNull(),

    expired_at : timestamp("expired_at",{withTimezone : true}).notNull(),
    used : boolean().default(false),

    purpose : magiclink_purpose().notNull(),
    
    created_at : timestamp("created_at",{withTimezone:true}).defaultNow().notNull(),
    updated_at : timestamp("updated_at", {withTimezone:true}).$onUpdate(()=> new Date())
})

export default magicLinkTable;