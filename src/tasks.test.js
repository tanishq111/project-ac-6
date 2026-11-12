import { describe, expect, it } from "vitest";
import { tasksReducer } from "./tasks.js";

describe("tasksReducer", () => {
  it("adds a task without modifying the original array", () => {
    const tasks = Object.freeze([]);
    const task = { id: "task-1", title: "Learn state", completed: false };
    const result = tasksReducer(tasks, { type: "task/added", task });

    expect(result).toEqual([task]);
    expect(tasks).toEqual([]);
  });

  it("toggles one task without mutating it", () => {
    const task = Object.freeze({ id: "task-1", title: "Learn state", completed: false });
    const tasks = Object.freeze([task]);
    const result = tasksReducer(tasks, { type: "task/toggled", taskId: "task-1" });

    expect(result[0].completed).toBe(true);
    expect(task.completed).toBe(false);
    expect(result[0]).not.toBe(task);
  });

  it("deletes only the selected task", () => {
    const firstTask = { id: "task-1", title: "Learn state", completed: false };
    const secondTask = { id: "task-2", title: "Learn props", completed: false };
    const tasks = Object.freeze([firstTask, secondTask]);

    expect(tasksReducer(tasks, { type: "task/deleted", taskId: "task-1" })).toEqual([secondTask]);
    expect(tasks).toHaveLength(2);
  });
});