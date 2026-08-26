/**
 * Unit tests for the API error classes.
 */
import { describe, it, expect } from "vitest";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitedError,
  NetworkError,
  TimeoutError,
  ServerError,
  isApiError,
  createApiErrorFromStatus,
} from "@/lib/api/errors";

describe("API Error Classes", () => {
  it("UnauthorizedError has correct properties", () => {
    const err = new UnauthorizedError("corr-123");
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("UNAUTHORIZED");
    expect(err.correlationId).toBe("corr-123");
    expect(isApiError(err)).toBe(true);
  });

  it("ForbiddenError has correct properties", () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("FORBIDDEN");
  });

  it("NotFoundError has correct properties", () => {
    const err = new NotFoundError("Conversation");
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain("Conversation");
  });

  it("ValidationError includes fieldErrors", () => {
    const err = new ValidationError("Invalid input", { email: ["Invalid email"] });
    expect(err.statusCode).toBe(422);
    expect(err.fieldErrors?.email).toContain("Invalid email");
  });

  it("RateLimitedError has correct status", () => {
    const err = new RateLimitedError(60);
    expect(err.statusCode).toBe(429);
    expect(err.retryAfter).toBe(60);
  });

  it("NetworkError has correct code", () => {
    const err = new NetworkError();
    expect(err.code).toBe("NETWORK_ERROR");
    expect(err.statusCode).toBe(0);
  });

  it("TimeoutError has correct code", () => {
    const err = new TimeoutError();
    expect(err.code).toBe("TIMEOUT");
  });

  it("ServerError has correct status", () => {
    const err = new ServerError(503);
    expect(err.statusCode).toBe(503);
    expect(err.code).toBe("SERVER_ERROR");
  });

  it("isApiError returns false for non-API errors", () => {
    expect(isApiError(new Error("generic"))).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError("string")).toBe(false);
  });

  describe("createApiErrorFromStatus", () => {
    it("maps 401 to UnauthorizedError", () => {
      const err = createApiErrorFromStatus(401, {});
      expect(err).toBeInstanceOf(UnauthorizedError);
    });

    it("maps 403 to ForbiddenError", () => {
      const err = createApiErrorFromStatus(403, {});
      expect(err).toBeInstanceOf(ForbiddenError);
    });

    it("maps 404 to NotFoundError", () => {
      const err = createApiErrorFromStatus(404, {});
      expect(err).toBeInstanceOf(NotFoundError);
    });

    it("maps 422 to ValidationError", () => {
      const err = createApiErrorFromStatus(422, { message: "Bad input" });
      expect(err).toBeInstanceOf(ValidationError);
    });

    it("maps 500 to ServerError", () => {
      const err = createApiErrorFromStatus(500, {});
      expect(err).toBeInstanceOf(ServerError);
    });
  });
});
