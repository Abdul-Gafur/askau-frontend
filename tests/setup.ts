import "@testing-library/jest-dom";
import { beforeAll, afterAll } from "vitest";

// Suppress next-themes console.warn in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    const msg = args[0];
    if (typeof msg === "string" && msg.includes("next-themes")) return;
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
