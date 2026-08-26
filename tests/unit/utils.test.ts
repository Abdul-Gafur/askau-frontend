/**
 * Unit tests for utility functions.
 */
import { describe, it, expect } from "vitest";
import { cn, truncate, safeJsonParse, generateClientId, isBrowser } from "@/lib/utils";

describe("cn (class merge utility)", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });
});

describe("truncate", () => {
  it("returns string unchanged if shorter than max", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and adds ellipsis", () => {
    const result = truncate("Hello World", 8);
    expect(result).toBe("Hello...");
    expect(result.length).toBe(8);
  });
});

describe("safeJsonParse", () => {
  it("parses valid JSON", () => {
    expect(safeJsonParse<{ a: number }>('{"a":1}')).toEqual({ a: 1 });
  });

  it("returns null for invalid JSON", () => {
    expect(safeJsonParse("not json")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(safeJsonParse("")).toBeNull();
  });
});

describe("generateClientId", () => {
  it("generates a string", () => {
    expect(typeof generateClientId()).toBe("string");
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateClientId()));
    expect(ids.size).toBe(10);
  });

  it("starts with cid-", () => {
    expect(generateClientId()).toMatch(/^cid-/);
  });
});

describe("isBrowser", () => {
  it("returns true in jsdom environment", () => {
    // jsdom sets window, so isBrowser() should be true in vitest+jsdom
    expect(isBrowser()).toBe(true);
  });
});
