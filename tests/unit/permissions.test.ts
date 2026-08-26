/**
 * Unit tests for auth permission utilities.
 */
import { describe, it, expect } from "vitest";
import { hasRole, isAdmin, isSuperAdmin } from "@/lib/auth/permissions";

describe("hasRole", () => {
  it("returns true when user has the required role", () => {
    expect(hasRole(["user"], "user")).toBe(true);
    expect(hasRole(["admin"], "admin")).toBe(true);
  });

  it("returns true when user has a higher role", () => {
    expect(hasRole(["admin"], "user")).toBe(true);
    expect(hasRole(["super_admin"], "admin")).toBe(true);
    expect(hasRole(["super_admin"], "user")).toBe(true);
  });

  it("returns false when user has insufficient role", () => {
    expect(hasRole(["user"], "admin")).toBe(false);
    expect(hasRole(["user"], "super_admin")).toBe(false);
    expect(hasRole(["admin"], "super_admin")).toBe(false);
  });

  it("handles multiple roles", () => {
    expect(hasRole(["user", "admin"], "admin")).toBe(true);
  });

  it("returns false for empty roles", () => {
    expect(hasRole([], "user")).toBe(false);
  });
});

describe("isAdmin", () => {
  it("returns true for admin", () => {
    expect(isAdmin(["admin"])).toBe(true);
  });

  it("returns true for super_admin", () => {
    expect(isAdmin(["super_admin"])).toBe(true);
  });

  it("returns false for user", () => {
    expect(isAdmin(["user"])).toBe(false);
  });
});

describe("isSuperAdmin", () => {
  it("returns true for super_admin", () => {
    expect(isSuperAdmin(["super_admin"])).toBe(true);
  });

  it("returns false for admin", () => {
    expect(isSuperAdmin(["admin"])).toBe(false);
  });
});
