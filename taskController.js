const fs = require("fs/promises"); // Using promises for file system operations
const DB_FILE = "tasks.json";

module.exports = {
  abc: "abc",
  getTasks: async function () {
    const data = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(data);
  },

  getTask: async function (taskId) {
    const tasks = await this.getTasks();
    return tasks.find((task) => task.id === parseInt(taskId));
  },

  addTask: async function (newTask) {
    const tasks = await this.getTasks();
    if (Boolean(parseInt(newTask.id))) {
      var existingTask = tasks.find((task) => task.id === parseInt(newTask.id));
      if (existingTask) {
        return {
          message: "Task already exist with this id. Id should be unique.",
        };
      }
    } else newTask.id = Date.now(); // Assign a unique ID
    tasks.push(newTask);
    await fs.writeFile(DB_FILE, JSON.stringify(tasks, null, 2));
    return newTask;
  },

  updateTask: async function (taskId, updatedTask) {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        description: updatedTask.description,
        isCompleted: updatedTask.isCompleted,
      };
      await fs.writeFile(DB_FILE, JSON.stringify(tasks, null, 2));
      return true;
    }
    return false;
  },

  deleteTask: async function (taskId) {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== parseInt(taskId));
    if (filteredTasks.length < tasks.length) {
      await fs.writeFile(DB_FILE, JSON.stringify(filteredTasks, null, 2));
      return true;
    }
    return false;
  },
};
