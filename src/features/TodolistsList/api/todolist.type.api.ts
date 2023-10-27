import {TaskPriorities, TaskStatuses} from "../../../common/api/api";
import {UpdateDomainTaskModelType} from "../model/tasks.reducer";

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};


export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
export type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
export  type AddTaskArgType={
  title: string,
  todoListId: string
}
export type UpdateTaskArgType = {
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todoListId: string
}