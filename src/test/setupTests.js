import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "@/test/msw/server";

// next/image needs the Next.js runtime, so in tests we swap it
// for a plain <img> tag that behaves close enough for our checks.
vi.mock("next/image", () => ({
  default: ({ alt, src, unoptimized, ...props }) => {
    const resolvedSrc = typeof src === "string" ? src : src?.src || "";
    return createElement("img", { alt, src: resolvedSrc, ...props });
  },
}));

// Start the fake server before the tests, and fail loudly if
// a test makes a request we forgot to mock.
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// Clear any one-off handlers so tests don't leak into each other.
afterEach(() => {
  server.resetHandlers();
});

// Shut the fake server down once everything is finished.
afterAll(() => {
  server.close();
});
