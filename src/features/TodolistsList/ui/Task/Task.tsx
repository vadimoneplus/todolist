import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "common/api/api";
import {TaskType} from "../../api/todolist.type.api";

type TaskPropsType = {
  task: TaskType;
  todoListId: string;
  changeTaskStatus: (id: string, status: TaskStatuses, todoListId: string) => void;
  changeTaskTitle: (taskId: string, newTitle: string, todoListId: string) => void;
  removeTask: (taskId: string, todoListId: string) => void;
};
export const Task = React.memo((props: TaskPropsType) => {
  const onClickHandler = useCallback(
    () => props.removeTask(props.task.id, props.todoListId),
    [props.task.id, props.todoListId]
  );

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      props.changeTaskStatus(
        props.task.id,
        newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
        props.todoListId
      );
    },
    [props.task.id, props.todoListId]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      props.changeTaskTitle(props.task.id, newValue, props.todoListId);
    },
    [props.task.id, props.todoListId]
  );

  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={props.task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
