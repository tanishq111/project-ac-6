import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useUsers } from "./useUsers.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("loads users without using the real network", async () => {
  const users = [{ id: 1, name: "Asha", email: "asha@example.com" }];
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => users }));
  const { result } = renderHook(() => useUsers("https://example.com/users"));

  await waitFor(() => expect(result.current.status).toBe("success"));
  expect(result.current.users).toEqual(users);
});

it("reports an HTTP failure and allows retry", async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: false, status: 503 })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });
  vi.stubGlobal("fetch", fetchMock);
  const { result } = renderHook(() => useUsers("https://example.com/users"));

  await waitFor(() => expect(result.current.status).toBe("error"));
  expect(result.current.error).toContain("503");
  act(() => result.current.retry());
  await waitFor(() => expect(result.current.status).toBe("success"));
  expect(result.current.users).toEqual([]);
});

it("rejects an unexpected response shape", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) }));
  const { result } = renderHook(() => useUsers("https://example.com/users"));

  await waitFor(() => expect(result.current.status).toBe("error"));
  expect(result.current.error).toContain("unexpected response");
});

it("aborts an in-flight request when unmounted", () => {
  let requestSignal;
  vi.stubGlobal("fetch", vi.fn((url, options) => {
    requestSignal = options.signal;
    return new Promise(() => {});
  }));
  const { unmount } = renderHook(() => useUsers("https://example.com/users"));

  expect(requestSignal.aborted).toBe(false);
  unmount();
  expect(requestSignal.aborted).toBe(true);
});