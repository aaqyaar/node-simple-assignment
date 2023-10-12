import Todo from "./src/todo";
import { EventEmitter } from "events";
import { createInterface } from "readline";
import { ACTIONS, TodoData } from "./src/types";

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
  (data) => {
    switch (data) {
      case ACTIONS.ADD:
        _readLine.question("Enter task name :- ", (data: TodoData["title"]) => {
          addTask(data);
        });
        break;
      case ACTIONS.UPDATE:
        _readLine.question(
          "Enter the task id you want to update :- ",
          (id: TodoData["id"]) => {
            _readLine.question(
              "Enter the new task name :- ",
              (data: TodoData["title"]) => {
                updateTask(id, data);
              }
            );
          }
        );
        break;
      case ACTIONS.DELETE:
        displayTasks();
        _readLine.question(
          "Enter the task id you want to delete :- ",
          (id: TodoData["id"]) => {
            deleteTask(id);
          }
        );
        break;
      case ACTIONS.LIST:
        displayTasks();
        eventEmitter.emit("exit");
        break;
      case ACTIONS.EXIT:
        eventEmitter.emit("exit");
      default:
        console.error("Invalid command please try again");
        eventEmitter.emit("exit");
        break;
    }
  }
);
