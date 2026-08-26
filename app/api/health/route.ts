import { NextResponse } from "next/server";
import type { HealthResponse } from "@/types/api";

/**
 * Health check endpoint — used by monitoring and CI.
 * Returns a basic health status for the Next.js frontend process.
 *
 * NOTE: This checks frontend health only, not the AskAU Platform API.
 * A full health check (including backend) requires calling the platform health endpoint.
 */
export async function GET(): Promise<NextResponse<HealthResponse>> {
  return NextResponse.json({
    status: "ok",
    version: process.env["NEXT_PUBLIC_APP_VERSION"] ?? "0.1.0",
    timestamp: new Date().toISOString(),
  });
}
