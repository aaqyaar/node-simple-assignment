import Todo from "./src/todo";
import { EventEmitter } from "events";
import { createInterface, ReadLine } from "readline";
import { ACTIONS, TodoData } from "./src/types";

class App {
  private _readLine: ReadLine;
  private _eventEmitter: EventEmitter;
  private _todo: Todo;

  constructor() {
    this._readLine = this.initReadLine();
    this._eventEmitter = new EventEmitter();
    this._todo = new Todo();
    this.init();
    this._eventEmitter.on("exit", () => {
      this._readLine.close();
    });
  }

  init() {
    console.log("Welcome to Todo CLI!");
    console.log("--------------------");

    this.displayCommands();
  }

  initReadLine(): ReadLine {
    return createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  displayCommands() {
    this._readLine.question(
      "Choose one of these commands (add/delete,update,list,exit) :- ",
      (data) => {
        this.chooseCommand(data);
      }
    );
  }

  chooseCommand(data: string) {
    switch (data) {
      case ACTIONS.ADD:
        this._readLine.question(
          "Enter task name :- ",
          (data: TodoData["title"]) => {
            this._todo.addTask(data);
          }
        );
        break;
      case ACTIONS.UPDATE:
        this._todo.displayTasks();
        this._readLine.question(
          "Enter the task id you want to update :- ",
          (id: TodoData["id"]) => {
            this._readLine.question(
              "Enter the new task name :- ",
              (data: TodoData["title"]) => {
                this._todo.updateTask(id, data);
                this._eventEmitter.emit("exit");
              }
            );
          }
        );
        break;
      case ACTIONS.DELETE:
        this._todo.displayTasks();
        this._readLine.question(
          "Enter the task id you want to delete :- ",
          (id: TodoData["id"]) => {
            this._todo.deleteTask(id);
            this._eventEmitter.emit("exit");
          }
        );
        break;
      case ACTIONS.LIST:
        this._todo.displayTasks();
        this._eventEmitter.emit("exit");
        break;
      case ACTIONS.EXIT:
        this._eventEmitter.emit("exit");
      default:
        console.error("Invalid command please try again");
        this._eventEmitter.emit("exit");
        break;
    }
  }
}

new App();
