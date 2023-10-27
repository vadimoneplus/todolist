import {AppThunk} from "app/store";
import {appActions} from "app/app.reducer";
import {todolistsActions, todosThunks} from "features/TodolistsList/model/todolists.reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "../../../common/utils";
import {TaskPriorities, TaskStatuses} from "../../../common/api/api";
import {AddTaskArgType, TaskType, UpdateTaskArgType, UpdateTaskModelType} from "../api/todolist.type.api";
import {api} from "../api/todolists-api";


const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // removeTask: (state, action: PayloadAction<{ taskId: string; todoListId: string }>) => {
    //   const tasks = state[action.payload.todoListId];
    //   const index = tasks.findIndex((t) => t.id === action.payload.taskId);
    //   if (index !== -1) tasks.splice(index, 1);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todoListId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = {...tasks[index], ...action.payload.domainModel};
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      // .addCase(todolistsActions.setTodolists, (state, action) => {
      //   action.payload.todolists.forEach((tl) => {
      //     state[tl.id] = [];
      //   });
      // })
      .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      });
  },
});
// thunks
const fetchTasks = createAppAsyncThunk<
  { tasks: TaskType[], todoListId: string }, string>(
  'tasks/fetchTasks', async (todoListId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({status: "loading"}));
      const res = await api.getTasks(todoListId)
      const tasks = res.data.items;
      dispatch(appActions.setAppStatus({status: "succeeded"}));
      return {tasks, todoListId}
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }

  })
// enum Status {
//   success=0,
//   error=1,
//   captcha=10
// }
const Status = {
  success: 0,
  error: 1,
  captcha: 10
} as const;

const addTask = createAppAsyncThunk<
  { task: TaskType }, AddTaskArgType>(
  'tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({status: "loading"}));
      const res = await api.createTask(arg)
      if (res.data.resultCode === Status.success) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatus({status: "succeeded"}));
        return {task}
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  })
const removeTask = createAppAsyncThunk<{taskId:string, todoListId:string},{taskId:string, todoListId:string}>('tasks/removeTask', async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  try {
    await api.deleteTask(arg.todoListId, arg.taskId)
    return arg
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
})
// export const _removeTaskTC =
//   (taskId: string, todoListId: string): AppThunk =>
//     (dispatch) => {
//       api.deleteTask(todoListId, taskId)
//         .then(() => {
//           dispatch(tasksActions.removeTask({taskId, todoListId}));
//         });
//     };

const updateTask =
  createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTask',
    async (arg, thunkAPI) => {
      const {dispatch, rejectWithValue, getState} = thunkAPI;
      try {
        const state = getState();
        const task = state.tasks[arg.todoListId].find((t) => t.id === arg.taskId);
        if (!task) {
          //throw new Error("task not found in the state");
          console.warn("task not found in the state");
          return rejectWithValue(null);
        }
        const apiModel: UpdateTaskModelType = {
          deadline: task.deadline,
          description: task.description,
          priority: task.priority,
          startDate: task.startDate,
          title: task.title,
          status: task.status,
          ...arg.domainModel,
        };
        const res = await api.updateTask(arg.todoListId, arg.taskId, apiModel)
        if (res.data.resultCode === 0) {
          return arg
        } else {
          handleServerAppError(res.data, dispatch);
          return rejectWithValue(null);
        }
      } catch (error: any) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
      }
    })

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = {fetchTasks, addTask, updateTask,removeTask};
