import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createDialog } from "./library";
import type { DialogComponentProps } from "./library";

type In = { foo: string };
type Out = { bar: string };

const Body = (props: DialogComponentProps<In, Out>) => (
  <div data-testid="dialog">
    <span data-testid="open">{String(props.isOpen)}</span>
    <span data-testid="data">{JSON.stringify(props.data)}</span>
    <button onClick={() => props.onConfirm?.({ bar: "ok" })}>confirm</button>
    <button onClick={() => props.onClose?.()}>close</button>
  </div>
);

function setup(options?: { forceUnmount?: boolean }) {
  // No explicit generics — In/Out are inferred from Body's props (verified by tsc).
  const { Dialog, show } = createDialog(Body, options);

  const onResolve = vi.fn();
  const onReject = vi.fn();

  const Harness = () => (
    <>
      <button onClick={() => show({ foo: "bar" }).then(onResolve, onReject)}>show</button>
      <Dialog />
    </>
  );

  render(<Harness />);
  return { Dialog, show, onResolve, onReject };
}

describe("createDialog (react adapter)", () => {
  it("renders the dialog closed by default", () => {
    setup();
    expect(screen.getByTestId("open")).toHaveTextContent("false");
  });

  it("opens with the provided data", () => {
    setup();
    fireEvent.click(screen.getByText("show"));
    expect(screen.getByTestId("open")).toHaveTextContent("true");
    expect(screen.getByTestId("data")).toHaveTextContent('{"foo":"bar"}');
  });

  it("resolves with the confirm payload and closes", async () => {
    const { onResolve } = setup();
    fireEvent.click(screen.getByText("show"));
    fireEvent.click(screen.getByText("confirm"));
    await waitFor(() => expect(onResolve).toHaveBeenCalledWith({ bar: "ok" }));
    expect(screen.getByTestId("open")).toHaveTextContent("false");
  });

  it("resolves with undefined when dismissed", async () => {
    const { onResolve, onReject } = setup();
    fireEvent.click(screen.getByText("show"));
    fireEvent.click(screen.getByText("close"));
    await waitFor(() => expect(onResolve).toHaveBeenCalledWith(undefined));
    expect(onReject).not.toHaveBeenCalled();
    expect(screen.getByTestId("open")).toHaveTextContent("false");
  });

  it("show() works when called outside any component", async () => {
    const { Dialog, show } = createDialog(Body);
    render(<Dialog />);
    expect(screen.getByTestId("open")).toHaveTextContent("false");

    // No hook, no event handler — just call the function directly.
    let result: Out | undefined | "pending" = "pending";
    act(() => {
      show({ foo: "bar" }).then((r) => (result = r));
    });
    expect(screen.getByTestId("open")).toHaveTextContent("true");

    fireEvent.click(screen.getByText("confirm"));
    await waitFor(() => expect(result).toEqual({ bar: "ok" }));
  });

  it("unmounts the dialog when forceUnmount is enabled", () => {
    setup({ forceUnmount: true });
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("show"));
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByText("confirm"));
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });
});
