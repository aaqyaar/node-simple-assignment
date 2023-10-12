import Todo from "./src/todo";
import { EventEmitter } from "events";
import { createInterface, ReadLine } from "readline";
import { ACTIONS, TodoData } from "./src/types";

const { deleteTask, addTask, displayTasks, updateTask } = Todo;

class App {
  private _readLine: ReadLine;
  private _eventEmitter: EventEmitter;

  constructor() {
    this._readLine = this.initReadLine();
    this._eventEmitter = new EventEmitter();
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
            addTask(data);
          }
        );
        break;
      case ACTIONS.UPDATE:
        displayTasks();
        this._readLine.question(
          "Enter the task id you want to update :- ",
          (id: TodoData["id"]) => {
            this._readLine.question(
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
        this._readLine.question(
          "Enter the task id you want to delete :- ",
          (id: TodoData["id"]) => {
            deleteTask(id);
          }
        );
        break;
      case ACTIONS.LIST:
        displayTasks();
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
