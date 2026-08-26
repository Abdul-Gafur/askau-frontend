/**
 * NextAuth.js Route Handler
 * Handles all /api/auth/* requests (sign-in, sign-out, callbacks, session)
 */
import { handlers } from "@/lib/auth/config";

export const { GET, POST } = handlers;
