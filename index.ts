import Todo from "./src/todo";
import { createServer } from "http";
import { createReadStream, createWriteStream, readFileSync } from "fs";
import path = require("path");
import { IncomingForm, Fields, Files } from "formidable";

class App {
  private todo = new Todo();

  constructor() {
    this.boot();
  }

  async boot() {
    createServer(async (req, res) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      });

      switch (req.url) {
        case "/":
          const data = readFileSync("./public/index.html");
          res.write(data);
          res.end();

          break;

        case "/tasks":
          if (req.method === "GET") {
            const tasks = this.todo.displayTasks();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(tasks));
            res.end();
          } else if (req.method === "POST") {
            console.log("Hello");

            res.writeHead(201, { "Content-Type": "multipart/form-data" });

            const form = new IncomingForm();

            form.parse(req, async (err, fields: Fields, files: Files) => {
              const { title } = fields;
              const image =
                files.image !== undefined && files.image[0].filepath;

              const fileExtension = path.extname(
                (files.image &&
                  (files.image[0].originalFilename as string)) as any
              );

              const newFilename = `${title}${fileExtension}`;

              const targetPath = `./public/images/${newFilename}`;

              const sourceStream = createReadStream(image as string);
              const targetStream = createWriteStream(targetPath);

              sourceStream.pipe(targetStream);

              await this.todo.addTask(title ? title[0] : "", newFilename);

              res.end();
            });
          } else if (req.method === "PUT") {
            console.log("Hello");

            res.writeHead(201, { "Content-Type": "application/json" });

            let data = "";

            req.on("data", (chunk) => {
              data += chunk;
            });

            req.on("end", async () => {
              console.log("Received formData:", data);
              const { taskId, title } = JSON.parse(data);

              const response = await this.todo.updateTask(taskId, title);

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ response }));
            });
          } else if (req.method == "DELETE") {
            let data = "";

            req.on("data", (chunk) => {
              data += chunk;
            });

            req.on("end", async () => {
              console.log("Received formData:", data);

              const { taskId } = JSON.parse(data);

              const response = await this.todo.deleteTask(taskId as string);

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ response }));
            });
          }

          break;
      }
    }).listen(8000, () => {
      console.log("🚀 Server running at http://localhost:8000");
    });
  }
}

new App();
