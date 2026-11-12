import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskForm } from "./TaskForm.jsx";

describe("TaskForm", () => {
  it("rejects an empty title", async () => {
    const onAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm onAddTask={onAddTask} />);

    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter at least three characters.");
    expect(onAddTask).not.toHaveBeenCalled();
  });

  it("submits a trimmed title and clears the input", async () => {
    const onAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm onAddTask={onAddTask} />);

    await user.type(screen.getByLabelText("Task title"), "  Practice props  ");
    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(onAddTask).toHaveBeenCalledExactlyOnceWith("Practice props");
    expect(screen.getByLabelText("Task title")).toHaveValue("");
  });
});