import Todo from "./src/todo";
import { EventEmitter } from "events";
import { createInterface } from "readline";

const { deleteTask, addTask, displayTasks, updateTask } = Todo;

const _readLine = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eventEmitter = new EventEmitter();

eventEmitter.on("exit", () => {
  process.exit(1);
});

_readLine.question(
  "Choose one of these commands (add/delete,update,list,exit) :- ",
  (data: any) => {
    switch (data) {
      case "add":
        _readLine.question("Enter task name :- ", (data: any) => {
          addTask(data);
        });
        break;
      case "update":
        _readLine.question(
          "Enter the task id you want to update :- ",
          (id: any) => {
            _readLine.question("Enter the new task name :- ", (data: any) => {
              updateTask(id, data);
            });
          }
        );
        break;
      case "delete":
        displayTasks();
        _readLine.question(
          "Enter the task id you want to delete :- ",
          (data: any) => {
            deleteTask(data);
          }
        );
        break;
      case "list":
        displayTasks();
        eventEmitter.emit("exit");
        break;
      case "exit":
        eventEmitter.emit("exit");
      default:
        console.error("Invalid command please try again");
        eventEmitter.emit("exit");
        break;
    }
  }
);
