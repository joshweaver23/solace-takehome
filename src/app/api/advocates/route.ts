import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { AdvocateApiResponse } from "../../../types/advocate";

export async function GET(): Promise<Response> {
  try {
    // Try to get data from database first
    const data = await db.select().from(advocates);
    return Response.json({ data });
  } catch (error) {
    // Log the database error for debugging
    console.error("Database connection failed:", error);

    // Fall back to static data
    console.log("Falling back to static advocate data");
    const data = advocateData;

    return Response.json({
      data,
      warning: "Using fallback data - database unavailable"
    });
  }
}
