import {instance, ResponseType, TaskPriorities, TaskStatuses} from "../../../common/api/api";
import {UpdateDomainTaskModelType} from "../model/tasks.reducer";
import {AddTaskArgType, GetTasksResponse, TaskType, TodolistType, UpdateTaskModelType} from "./todolist.type.api";

export const api = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {title: title});
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    const promise = instance.put<ResponseType>(`todo-lists/${id}`, { title: title });
    return promise;
  },
  getTasks(todoListId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todoListId}/tasks`);
  },
  deleteTask(todoListId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`);
  },
  createTask(arg:AddTaskArgType) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todoListId}/tasks`, { title: arg.title });
  },
  updateTask(todoListId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<TaskType>>(`todo-lists/${todoListId}/tasks/${taskId}`, model);
  },
};


