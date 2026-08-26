import type { ID, ISODateTime } from "./common";

/**
 * Authentication and user types for the AskAU application.
 *
 * The frontend treats the user object as returned by the backend
 * after successful authentication. The backend is authoritative
 * for all access decisions.
 *
 * SECURITY NOTE:
 * - Frontend UI state must never be the sole authorization mechanism.
 * - Backend authorization decisions are always authoritative.
 * - Hiding UI elements is NOT a security control.
 */

/** User roles recognized by the AskAU platform */
export type UserRole = "user" | "admin" | "super_admin";

/** Authenticated user profile */
export interface User {
  id: ID;
  email: string;
  name: string;
  displayName: string;
  /** Microsoft Entra Object ID */
  entraId?: string;
  roles: UserRole[];
  department?: string;
  jobTitle?: string;
  /** ISO 639-1 language preference */
  languagePreference?: string;
  /** Account creation timestamp */
  createdAt: ISODateTime;
  /** Last login timestamp */
  lastLoginAt?: ISODateTime;
}

/** Session state — safe to expose client-side */
export interface SessionUser {
  id: ID;
  email: string;
  name: string;
  displayName: string;
  roles: UserRole[];
  /** Profile picture URL from Microsoft Graph (if available) */
  image?: string;
}

/** Authentication session */
export interface AuthSession {
  user: SessionUser;
  /** Session expiry timestamp */
  expires: ISODateTime;
  /** Whether the session is active */
  isActive: boolean;
}

/** Permission check result */
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}
