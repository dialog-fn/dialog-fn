import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createDialog } from "./library";
import type { DialogComponentProps } from "./library";

type In = { foo: string };
type Out = { bar: string };

function setup(options?: { forceUnmount?: boolean }) {
  const { register, useDialog } = createDialog<In, Out>(options);

  const Dialog = register((props: DialogComponentProps<In, Out>) => (
    <div data-testid="dialog">
      <span data-testid="open">{String(props.isOpen)}</span>
      <span data-testid="data">{JSON.stringify(props.data)}</span>
      <button onClick={() => props.onConfirm?.({ bar: "ok" })}>confirm</button>
      <button onClick={() => props.onClose?.()}>close</button>
    </div>
  ));

  const onResolve = vi.fn();
  const onReject = vi.fn();

  const Harness = () => {
    const showDialog = useDialog();
    return (
      <>
        <button onClick={() => showDialog({ foo: "bar" }).then(onResolve, onReject)}>
          show
        </button>
        <Dialog />
      </>
    );
  };

  render(<Harness />);
  return { onResolve, onReject };
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

  it("rejects when closed", async () => {
    const { onReject } = setup();
    fireEvent.click(screen.getByText("show"));
    fireEvent.click(screen.getByText("close"));
    await waitFor(() => expect(onReject).toHaveBeenCalled());
    expect(screen.getByTestId("open")).toHaveTextContent("false");
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
