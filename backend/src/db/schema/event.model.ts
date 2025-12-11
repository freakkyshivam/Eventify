import { pgTable, 
    serial,
     varchar,
      text,
    timestamp,
    integer,
    pgEnum,
    } from "drizzle-orm/pg-core";

import users from "./user.model";

    export const eventModeEnum = pgEnum("event_mode", [
        "online",
        "offline"
    ])

    export const eventCategoryEnum = pgEnum("event_category",[
        'conference',
        'webinar',
        'workshop',
        'competition',
        'technology',
        'coding',
        'other'
    ])

    export const paymentTypeEnum = pgEnum("payment_type",[
        "free",
        "paid"
    ])

    export const eventStatusEnum = pgEnum("event_status",[
        'upcoming',
        'ongoing',
        'completed',
        'cancelled'
    ])

    export const eventTypeEnum = pgEnum("event_type",[
        'solo',
        'team'
    ])

    export const events = pgTable("events",{
        id : serial("id").primaryKey(),

        title : varchar("title",{length:200}).notNull(),
        description : text("description").notNull(),

        bannerUrls : text("banner_urls").array().notNull().default([]),
      
        startTime: timestamp("start_time", { withTimezone: true }).notNull(),
        endTime: timestamp("end_time", { withTimezone: true }).notNull(),
        registrationDeadline: timestamp("registration_deadline", {
        withTimezone: true,
        }).notNull(),


        location: varchar("location", { length: 200 }).notNull(),


        eventMode :  eventModeEnum("event_mode").notNull().default("online"),

        capacity : integer("capacity").notNull().default(100),

        eventCategory : eventCategoryEnum("event_category").notNull().default("other"), 

        paymentType : paymentTypeEnum("payment_type").notNull().default("free"),

        price : integer("price").notNull().default(0),

        eventStatus : eventStatusEnum("event_status").notNull().default("upcoming"),

        eventType : eventTypeEnum("event_type").notNull().default("solo"),
        minTeamSize : integer("min_team_size").notNull().default(1),
        maxTeamSize : integer("max_team_size").notNull().default(1),

        organizingClub: varchar("organizing_club", { length: 100 }).notNull(),

        allowedBranches: text("allowed_branches").array().notNull().default([]),
        allowedYears: integer("allowed_years").array().notNull().default([]),

        authorId: integer("author_id") .notNull() .references(() => users.id, { onDelete: "cascade" }),

        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
       updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date())
         .notNull(),


    })

    export default events