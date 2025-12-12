import { pgTable, 
    serial,
     varchar,
      text,
    timestamp,
    boolean, 
    integer,
    pgEnum
    } from "drizzle-orm/pg-core";

    export const userRoleEnum = pgEnum("user_role",[
        'student',
        "coordinator",
        "club_admin",
        "super_admin"
    ])

    export const users = pgTable("users",{
        id: serial("id").primaryKey(),

        name : varchar("name", {length:100}).notNull(),
        username : varchar("username", {length:50}).notNull().unique(),
         email : varchar("email", {length:250}).notNull().unique(),
         password : varchar("password", {length:255}).notNull(),
         user_role: userRoleEnum("user_role").notNull().default('student'),


         rollNumber : varchar("roll_number", {length:50}).notNull().unique(),
         branch : varchar("branch", {length:50}).notNull(),
         year: integer('year').notNull(),

         phone : varchar('phone',{length:15}).notNull(),

         profileImageUrl : text("profile_image_url"),

         verifyOtp : varchar("verify_otp", {length:10}),
         verifyOtpExpiredAt : timestamp("verify_otp_expired_at", {withTimezone:true}),

         isAccountVerified : boolean('is_account_verified').notNull().default(false),
        isProfileComplete : boolean("isProfileComplete").notNull().default(false),
         createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
         updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
        .$onUpdate(() => new Date())
            .notNull(),

    })

    export default users