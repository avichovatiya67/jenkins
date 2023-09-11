const http = require("http");
const morgan = require("morgan");
const taskController = require("./taskController");
const PORT = 1000;

const server = http.createServer();
server.on("request", (req, res) => {
  morgan("dev")(req, res, async () => {
    try {
      switch (req.method) {
        case "GET":
          if (req.url === "/tasks") {
            const tasks = await taskController.getTasks();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(tasks));
          } else if (req.url.includes("/task/")) {
            const taskId = req.url.split("/")[2];
            const task = await taskController.getTask(taskId);
            if (task) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(task));
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("Task not found");
            }
          } else {
            throw new Error("URL not found");
          }
          return;

        case "POST":
          if (req.url === "/add") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", async () => {
              const newTask = JSON.parse(body);
              const addedTask = await taskController.addTask(newTask);
              res.writeHead(addedTask?.message ? 409 : 201, { "Content-Type": "application/json" });
              res.end(JSON.stringify(addedTask));
            });
          } else {
            throw new Error("URL not found");
          }
          return;

        case "PUT":
          if (req.url.includes("/update/")) {
            const taskId = req.url.split("/")[2];
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", async () => {
              const updatedTask = JSON.parse(body);
              const result = await taskController.updateTask(
                taskId,
                updatedTask
              );
              if (result) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Task updated");
              } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Task not found");
              }
            });
          } else {
            throw new Error("URL not found");
          }
          return;

        case "DELETE":
          if (req.url.includes("/delete/")) {
            const taskId = req.url.split("/")[2];
            const result = await taskController.deleteTask(taskId);
            if (result) {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end("Task deleted");
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("Task not found");
            }
          } else {
            throw new Error("URL not found");
          }
          return;

        default:
          console.log("URL not specified");
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("URL not found");
          return;
      }
    } catch (error) {
      console.log(error.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(error.message || "Server error");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
