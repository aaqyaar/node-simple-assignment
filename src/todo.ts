import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { TodoData, TodoDataArray } from "./types";

export default class Todo {
  static fileName: string = join(__dirname, "./todos.json");
  /**
   * Add a new task to the list
   * @param data  The task name
   * @returns void
   */
  static addTask = async (data: TodoData["title"]) => {
    try {
      const fileContent = readFileSync(this.fileName, "utf8");
      const existingData = JSON.parse(fileContent) as TodoDataArray;
      let id = (Math.random() * 100000).toFixed(0).toString().substring(0, 5);
      const findItem = existingData.find((item: TodoData) => item.id == id);
      if (findItem) {
        id = (Math.random() * 100000).toFixed(0).toString().substring(0, 5);
      }
      existingData.push({
        id,
        title: data,
      });
      writeFileSync(this.fileName, JSON.stringify(existingData, null, 2));
      console.log(`New Data Saved: ${data}`);
      process.exit(1);
    } catch (error) {
      const newItem = [
        {
          id: (Math.random() * 100000).toFixed(0).toString().substring(0, 5),
          title: data,
        },
      ];
      writeFileSync(this.fileName, JSON.stringify(newItem, null, 2));
      console.log(`New Item Saved: ${data}`);
      process.exit(1);
    }
  };
  /**
   * Update a task
   * @param id The task id
   * @param args The new task name
   */
  static updateTask = (id: TodoData["id"], args: TodoData["title"]) => {
    try {
      const data = readFileSync(this.fileName, "utf8");
      const parsedData = JSON.parse(data) as TodoDataArray;
      const findItem = parsedData.find((item: TodoData) => item.id == id);
      if (findItem) {
        findItem.title = args;
        writeFileSync(this.fileName, JSON.stringify(parsedData, null, 2));
        console.log(`Updated Item with id: ${id}`);
        process.exit(1);
      }
      console.log("No item found");
    } catch (error) {
      console.log("No item found");
    }
  };
  /**
   * Delete a task
   * @param id The task id
   */
  static deleteTask = (id: TodoData["id"]) => {
    const data = readFileSync(this.fileName, "utf8");
    const existingData = JSON.parse(data) as TodoDataArray;
    const removedData = existingData.filter((item: TodoData) => item.id != id);
    writeFileSync(this.fileName, JSON.stringify(removedData, null, 2));
    console.log(`Removed Item with id: ${id}`);
    process.exit(1);
  };
  /**
   * Display all tasks
   * @returns TodoDataArray
   */
  static displayTasks = (): TodoDataArray => {
    const data = JSON.parse(
      readFileSync(this.fileName, "utf8")
    ) as TodoDataArray;
    console.log(data);
    return data;
  };
}
