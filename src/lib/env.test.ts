import { describe, expect, it } from "vitest";
import { DEV_SECRET, parseEnv } from "./env";

const secret = "a".repeat(32);

describe("parseEnv", () => {
  it("needs nothing on this computer", () => {
    expect(parseEnv({})).toEqual({
      databaseUrl: null, authSecret: DEV_SECRET, authUrl: "http://localhost:3000", onVercel: false,
      dataDir: ".data/pglite",
    });
  });
  it("follows PORT, so any dev server's sign-in works", () => {
    expect(parseEnv({ PORT: "6301" }).authUrl).toBe("http://localhost:6301");
  });
  it("uses the live address on Vercel", () => {
    const e = parseEnv({ VERCEL: "1", DATABASE_URL: "postgres://x", BETTER_AUTH_SECRET: secret,
      VERCEL_PROJECT_PRODUCTION_URL: "guildhall.vercel.app" });
    expect(e).toMatchObject({ onVercel: true, authUrl: "https://guildhall.vercel.app", databaseUrl: "postgres://x" });
  });
  it("refuses to run on Vercel without a database", () => {
    expect(() => parseEnv({ VERCEL: "1", BETTER_AUTH_SECRET: secret })).toThrow(/DATABASE_URL/);
  });
  it("refuses to run on Vercel with the development secret", () => {
    expect(() => parseEnv({ VERCEL: "1", DATABASE_URL: "postgres://x" })).toThrow(/BETTER_AUTH_SECRET/);
  });
  it("refuses a short secret anywhere", () => {
    expect(() => parseEnv({ BETTER_AUTH_SECRET: "short" })).toThrow(/BETTER_AUTH_SECRET/);
  });
  it("lets BETTER_AUTH_URL override the address", () => {
    expect(parseEnv({ BETTER_AUTH_URL: "https://crm.example.com" }).authUrl).toBe("https://crm.example.com");
  });
  it("lets tests point the built-in database elsewhere", () => {
    expect(parseEnv({ GUILDHALL_DATA_DIR: "memory://" }).dataDir).toBe("memory://");
  });
});
