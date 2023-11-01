import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { TodoData, TodoDataArray } from "./types";

export default class Todo {
  fileName: string = join(__dirname, "./todos.json");
  /**
   * Add a new task to the list
   * @param data  The task name
   * @returns void
   */
  addTask = async (data: TodoData["title"], image: TodoData["image"]) => {
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
        image,
      });
      writeFileSync(this.fileName, JSON.stringify(existingData, null, 2));
      console.log(`New Data Saved: ${data}`);
      // process.exit(1);
    } catch (error) {
      const newItem = [
        {
          id: (Math.random() * 100000).toFixed(0).toString().substring(0, 5),
          title: data,
        },
      ];
      writeFileSync(this.fileName, JSON.stringify(newItem, null, 2));
      console.log(`New Item Saved: ${data}`);
      // process.exit(1);
    }
  };
  /**
   * Update a task
   * @param id The task id
   * @param args The new task name
   */
  updateTask = (id: TodoData["id"], args: TodoData["title"]) => {
    try {
      const data = readFileSync(this.fileName, "utf8");
      const parsedData = JSON.parse(data) as TodoDataArray;
      const findItem = parsedData.find((item: TodoData) => item.id == id);
      if (findItem) {
        findItem.title = args;
        writeFileSync(this.fileName, JSON.stringify(parsedData, null, 2));
        console.log(`Updated Item with id: ${id}`);
        return parsedData;
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
  deleteTask = async (id: TodoData["id"]): Promise<any> => {
    console.log(id);
    const data = readFileSync(this.fileName, "utf8");
    const existingData = JSON.parse(data) as TodoDataArray;
    const findItem = existingData.find((item: TodoData) => item.id == id);

    if (!findItem) {
      console.log("No item found");
    }
    const removedData = await existingData.filter(
      (item: TodoData) => item.id != id
    );
    writeFileSync(this.fileName, JSON.stringify(removedData, null, 2));
    console.log(`Removed Item with id: ${id}`);
    return removedData;
  };
  /**
   * Display all tasks
   * @returns TodoDataArray
   */
  displayTasks = (): TodoDataArray => {
    const data = JSON.parse(
      readFileSync(this.fileName, "utf8")
    ) as TodoDataArray;

    return data;
  };
}
