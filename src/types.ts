interface TodoData {
  id: string;
  title: string;
}

enum ACTIONS {
  ADD = "add",
  DELETE = "delete",
  UPDATE = "update",
  LIST = "list",
  EXIT = "exit",
}

type TodoDataArray = TodoData[];

export { TodoData, TodoDataArray, ACTIONS };
