
import { Request, Response } from "express";
import db from "../db/db";
import Users, { users } from "../db/schema/user.model";
 
import { eq, type InferModel } from "drizzle-orm";
import {
  sendWelcomeMail,
} from "../services/mail/sendMail.service";
import magiclink from "../db/schema/magicLink.schema";
import crypto from "node:crypto";
 

export async function handleNewUserRegistration(
  data: { email: string; hashed_token: string },
  res: Response
): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const name = data.email.split("@")[0];

      // Insert user
      const [newUser] = await tx
        .insert(users)
        .values({
          email: data.email,
          name,
          isAccountVerified: true,
        })
        .onConflictDoNothing()
        .returning();

      // Delete the magic link token
      await tx
        .delete(magiclink)
        .where(eq(magiclink.hashed_token, data.hashed_token));

      // If user already existed (conflict), don't send welcome email
      if (newUser) {
        // Send welcome email outside transaction to avoid blocking
        setImmediate(() => {
          sendWelcomeMail(data.email, name).catch((err) =>
            console.error("Failed to send welcome email:", err)
          );
        });
      }
    });

    res.status(201).json({
      success: true,
      msg: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}