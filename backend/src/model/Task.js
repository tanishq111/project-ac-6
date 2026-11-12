import mongoose from "mongoose";
import User from "./User.js";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  }
}, { timestamps: true });
// i will need a user->
// i cannot do create a separate model for each users

taskSchema.index({ user: 1 });
taskSchema.index({ user: 1, priority: 1 });
const Task = mongoose.model("Task", taskSchema);
export default Task;




// import assert from "node:assert/strict";
// import Task from "../src/model/Task.js";

// const valid = new Task({ title: "  Check validation  " });
// await valid.validate();
// assert.equal(valid.title, "Check validation");
// assert.equal(valid.completed, false);

// await assert.rejects(new Task({ title: "ab" }).validate(), { name: "ValidationError" });
// const cast = new Task({ title: "Observe casting", completed: "false" });
// assert.equal(cast.completed, false);
// assert.throws(() => new Task({ title: "Check strict mode", unknown: true }), {
//   name: "StrictModeError",
// });
// console.log("Defaults, trimming, validation, casting, and strict mode checked.");