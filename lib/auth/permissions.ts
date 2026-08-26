/**
 * Permission utilities for the AskAU frontend.
 *
 * CRITICAL SECURITY WARNING:
 * ────────────────────────────────────────────────────────────────────
 * Frontend permission checks are for UI rendering ONLY.
 * They are NOT a security mechanism.
 *
 * The backend (AskAU Platform API) is authoritative for all access
 * control decisions. The backend must validate authorization
 * independently for every request.
 *
 * Hiding UI elements based on frontend permission checks does NOT
 * prevent unauthorized access. Always enforce authorization on the
 * server/backend.
 * ────────────────────────────────────────────────────────────────────
 *
 * These utilities are used solely to conditionally render UI elements
 * appropriate for the user's role, improving the user experience.
 * They must never be used to gate sensitive operations.
 */

import type { UserRole } from "@/types/auth";

/** Role hierarchy: higher index = more privileged */
const ROLE_HIERARCHY: UserRole[] = ["user", "admin", "super_admin"];

/**
 * Returns true if the user's roles include at least one of the required roles.
 *
 * UI-only. Backend authorization is authoritative.
 */
export function hasRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userRoles.some((role) => ROLE_HIERARCHY.indexOf(role) >= requiredIndex);
}

/**
 * Returns true if the user has admin privileges (admin or super_admin).
 *
 * UI-only. Backend authorization is authoritative.
 */
export function isAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, "admin");
}

/**
 * Returns true if the user has super_admin privileges.
 *
 * UI-only. Backend authorization is authoritative.
 */
export function isSuperAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, "super_admin");
}
