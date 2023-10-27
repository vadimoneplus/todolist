import {tasksActions, tasksReducer, TasksStateType, tasksThunks} from "features/TodolistsList/model/tasks.reducer";
import {TaskPriorities, TaskStatuses} from "common/api/api";
import {todolistsActions, todosThunks} from "features/TodolistsList/model/todolists.reducer";
import {UpdateTaskArgType} from "../api/todolist.type.api";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    todoListId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action ={
    type: tasksThunks.removeTask.fulfilled.type,
    payload: {
      taskId: "2",
      todoListId: "todolistId1",
    }
  }
  // tasksActions.removeTask({taskId: "2", todoListId: "todolistId2"});

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy();
});

test("correct task should be added to correct array", () => {
  //const action = addTaskAC("juce", "todolistId2");
  // const action = tasksActions.addTask({
  const task = {
    todoListId: "todolistId2",
    title: "juce",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: 0,
    startDate: "",
    id: "id exists",
  }
  const action = tasksThunks.addTask.fulfilled(
    {
      task
    },
    'requestId',
    {title: task.title, todoListId: task.todoListId}
  );

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  type TaskType = {
    type: string;
    payload: UpdateTaskArgType
  }
  const action:TaskType = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
      taskId: "2",
      domainModel: {status: TaskStatuses.New},
      todoListId: "todolistId2",
    }
  }

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test("title of specified task should be changed", () => {
  type TaskType = {
    type: string;
    payload: UpdateTaskArgType
  }
  const action:TaskType = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
      taskId: "2",
      domainModel: {title: "yogurt"},
      todoListId: "todolistId2"
    }
  }

  const endState = tasksReducer(startState, action);

  // expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});

test("new array should be added when new todolist is added", () => {
  const action = todolistsActions.addTodolist({
    todolist: {
      id: "blabla",
      title: "new todolist",
      order: 0,
      addedDate: "",
    },
  });

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("propertry with todolistId should be deleted", () => {
  const action = todolistsActions.removeTodolist({id: "todolistId2"});

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {
  const action={
    type: todosThunks.fetchTodos.fulfilled.type,
    payload:{
      todolists: [
        {id: "1", title: "title 1", order: 0, addedDate: ""},
        {id: "2", title: "title 2", order: 0, addedDate: ""},
      ],
    }
  }
  // const action = todolistsActions.setTodolists({
  //   todolists: [
  //     {id: "1", title: "title 1", order: 0, addedDate: ""},
  //     {id: "2", title: "title 2", order: 0, addedDate: ""},
  //   ],
  // });

  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toBeDefined();
  expect(endState["2"]).toBeDefined();
});

test("tasks should be added for todolist", () => {
  // const action = tasksActions.setTasks({ tasks: startState["todolistId1"], todolistId: "todolistId1" });
  const action = tasksThunks.fetchTasks
    .fulfilled({tasks: startState["todolistId1"], todoListId: "todolistId1"},
      'requestId',
      'todolistId1');

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
