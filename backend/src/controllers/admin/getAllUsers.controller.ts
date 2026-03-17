import { Request, Response } from "express";
import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import { role_request_table } from "../../db/schema/role_request.schema";
import db from "../../db/db";
import { and, desc, eq, ne } from "drizzle-orm";

import { payment_table } from "../../db/schema/payment_schema";
import { users } from "../../db";

export const getAllUsersAD = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        msg: "Unauthorized",
        success: false,
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Forbidden",
      });
    }

    const results = await db
      .select()
      .from(users)
      .where(ne(users.role, "admin"));

    if (results.length === 0) {
      return res.status(203).json({
        success: false,
        msg: "No user found",
      });
    }

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("All users fetching error (Admin)", error);
    return;
  }
};

export const getAllOrganizerRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        msg: "Unauthorized",
        success: false,
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Forbidden",
      });
    }

    const results = await db
      .select({
        id: role_request_table.id,
        status: role_request_table.status,
        name: users.name,
        email: users.email,
        createdAt: role_request_table.created_at,
      })
      .from(role_request_table)
      .leftJoin(users, eq(role_request_table.user_id, users.id))
      .where(eq(role_request_table.status, "pending"));

    if (results.length === 0) {
      console.log("No organizer request");

      return res.status(203).json({
        success: false,
        msg: "No user found",
      });
    }

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("All users fetching error (Admin)", error);
    return;
  }
};

export const getAllReg = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Forbidden",
      });
    }

    const results = await db
      .select({
        user_name: users.name,
        email: users.email,
        event_title: events.title,
        registration_date: event_registration_table.registration_date,
        registration_status: event_registration_table.registration_status,
        payment: {
          amount: payment_table.amount,
          status: payment_table.payment_status,
        },
        ticket_code: event_registration_table.ticket_code,
      })
      .from(event_registration_table)
      .innerJoin(users, eq(event_registration_table.user_id, users.id))
      .innerJoin(events, eq(event_registration_table.event_id, events.id))
      .leftJoin(
        payment_table,
        eq(payment_table.registration_id, event_registration_table.id),
      )
      //   .where(eq(events.authorId, user.id))
      .orderBy(desc(event_registration_table.created_at));

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Organizer events fetching error", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const getRegPerEvents = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        msg: "Slug is required",
      });
    }

    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    if (user.role !== "organizer") {
      return res.status(403).json({
        success: false,
        msg: "Forbidden",
      });
    }

    const results = await db
      .select({
        user_name: users.name,
        email: users.email,
        event_title: events.title,
        registration_date: event_registration_table.registration_date,
        registration_status: event_registration_table.registration_status,
        payment: {
          amount: payment_table.amount,
          status: payment_table.payment_status,
        },
        ticket_code: event_registration_table.ticket_code,
      })
      .from(event_registration_table)
      .innerJoin(users, eq(event_registration_table.user_id, users.id))
      .innerJoin(events, eq(event_registration_table.event_id, events.id))
      .leftJoin(
        payment_table,
        eq(payment_table.registration_id, event_registration_table.id),
      )
      .where(and(eq(events.slug, slug), eq(events.authorId, user.id)))
      .orderBy(desc(event_registration_table.created_at));

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.log(error);
  }
};
