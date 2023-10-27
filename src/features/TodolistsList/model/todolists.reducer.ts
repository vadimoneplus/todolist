import {appActions, RequestStatusType} from "app/app.reducer";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk, handleServerNetworkError} from "../../../common/utils";
import {api} from "../api/todolists-api";
import {TodolistType} from "../api/todolist.type.api";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
      // return state.filter(tl => tl.id !== action.payload.id)
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: "all", entityStatus: "idle"};
      state.unshift(newTodolist);
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.entityStatus = action.payload.entityStatus;
      }
    },
    // setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
    //   return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}));
    //   // return action.payload.forEach(t => ({...t, filter: 'active', entityStatus: 'idle'}))
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
        return [];
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}));
      })
  },
});


// thunks
const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todo/fetchTodos",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await api.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
// const fetchTodos =
//   createAppAsyncThunk<{ todolists: TodolistType[] }, void>("todolists/fetchTodolists",
//     async (_, thunkAPI) => {
//       const {dispatch, rejectWithValue} = thunkAPI;
//       try {
//         dispatch(appActions.setAppStatus({status: "loading"}));
//         const res = await api.getTodolists()
//         dispatch(appActions.setAppStatus({status: "succeeded"}));
//         return {todolists: res.data}
//       } catch (error) {
//         handleServerNetworkError(error, dispatch);
//         return rejectWithValue(null);
//       }
//     })
// export const _fetchTodolistsTC = (): AppThunk => {
//   return (dispatch) => {
//     dispatch(appActions.setAppStatus({status: "loading"}));
//     api
//       .getTodolists()
//       .then((res) => {
//         dispatch(todolistsActions.setTodolists({todolists: res.data}));
//         dispatch(appActions.setAppStatus({status: "succeeded"}));
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };
export const removeTodolistTC = (id: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(appActions.setAppStatus({status: "loading"}));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(todolistsActions.changeTodolistEntityStatus({id, entityStatus: "loading"}));
    api.deleteTodolist(id).then((res) => {
      dispatch(todolistsActions.removeTodolist({id}));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(appActions.setAppStatus({status: "succeeded"}));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}));
    api.createTodolist(title).then((res) => {
      dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}));
      dispatch(appActions.setAppStatus({status: "succeeded"}));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    api.updateTodolist(id, title).then((res) => {
      dispatch(todolistsActions.changeTodolistTitle({id, title}));
    });
  };
};

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todosThunks = {fetchTodos};