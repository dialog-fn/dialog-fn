import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDialogStore } from "../src/store";

describe("createDialogStore", () => {
  it("starts closed with empty data", () => {
    const store = createDialogStore();
    expect(store.getState()).toMatchObject({
      isOpen: false,
      data: {},
      promise: {},
    });
  });

  it("opens and sets data via showDialog", () => {
    const store = createDialogStore<{ foo: string }, void>();
    store.showDialog({ foo: "bar" });
    expect(store.getState().isOpen).toBe(true);
    expect(store.getState().data).toEqual({ foo: "bar" });
  });

  it("resolves the promise with the confirm value", async () => {
    const store = createDialogStore<void, { bar: string }>();
    const result = store.showDialog();
    store.confirm({ bar: "ok" });
    await expect(result).resolves.toEqual({ bar: "ok" });
    expect(store.getState().isOpen).toBe(false);
  });

  it("rejects the promise when closed", async () => {
    const store = createDialogStore();
    const result = store.showDialog();
    store.close();
    await expect(result).rejects.toBeUndefined();
    expect(store.getState().isOpen).toBe(false);
  });

  it("clears data after confirm when forceUnmount is off", async () => {
    const store = createDialogStore<{ foo: string }, void>();
    const result = store.showDialog({ foo: "bar" });
    store.confirm();
    await result;
    expect(store.getState().data).toEqual({});
  });

  it("keeps data after confirm when forceUnmount is on", async () => {
    const store = createDialogStore<{ foo: string }, void>({ forceUnmount: true });
    const result = store.showDialog({ foo: "bar" });
    store.confirm();
    await result;
    expect(store.getState().data).toEqual({ foo: "bar" });
  });

  it("notifies subscribers and stops after unsubscribe", () => {
    const store = createDialogStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.open();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.close();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  describe("mount lifecycle", () => {
    it("keeps shouldRender true when forceUnmount is off", () => {
      const store = createDialogStore();
      expect(store.getState().shouldRender).toBe(true);
      store.showDialog();
      store.confirm();
      expect(store.getState().shouldRender).toBe(true);
    });

    it("unmounts immediately when forceUnmount is on without delay", () => {
      const store = createDialogStore({ forceUnmount: true });
      expect(store.getState().shouldRender).toBe(false);
      store.showDialog();
      expect(store.getState().shouldRender).toBe(true);
      store.confirm();
      expect(store.getState().shouldRender).toBe(false);
    });

    describe("with delayUnmount", () => {
      beforeEach(() => vi.useFakeTimers());
      afterEach(() => vi.useRealTimers());

      it("defers unmount until the delay elapses", () => {
        const store = createDialogStore({ forceUnmount: true, delayUnmount: 200 });
        store.showDialog();
        store.confirm();
        expect(store.getState().shouldRender).toBe(true);
        vi.advanceTimersByTime(199);
        expect(store.getState().shouldRender).toBe(true);
        vi.advanceTimersByTime(1);
        expect(store.getState().shouldRender).toBe(false);
      });

      it("cancels a pending unmount when reopened", () => {
        const store = createDialogStore({ forceUnmount: true, delayUnmount: 200 });
        store.showDialog();
        store.confirm();
        vi.advanceTimersByTime(100);
        store.showDialog();
        vi.advanceTimersByTime(200);
        expect(store.getState().shouldRender).toBe(true);
        expect(store.getState().isOpen).toBe(true);
      });
    });
  });
});
