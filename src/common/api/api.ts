import axios from "axios";
import {UpdateDomainTaskModelType} from "../../features/TodolistsList/model/tasks.reducer";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
    headers: {
  "API-KEY": "1cdd9f77-c60e-4af5-b194-659e4ebd5d41",
}
});
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};


export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}