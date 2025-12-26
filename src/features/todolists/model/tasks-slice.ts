import { createTodolist, deleteTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { createAppSlice, handleAppError, handleCatchError } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import {
  CreateTaskPayload,
  DeleteTaskPayload,
  DomainTask,
  UpdateTaskModel,
} from "@/features/todolists/api/taskApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import { RootState } from "@/app/store.ts"
import { ResultCode } from "@/common/enums/enums.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks({ todolistId })
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    deleteTask: create.asyncThunk(
      async (arg: DeleteTaskPayload, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.deleteTask(arg)
          dispatch(changeStatusAC({ status: "succeeded" }))
          return {
            resultCode: res.data.resultCode,
            todolistId: arg.todolistId,
            taskId: arg.taskId,
          }
        } catch (error) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          if (action.payload.resultCode === 0) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)

            if (index !== -1) {
              tasks.splice(index, 1)
            }
          }
        },
      },
    ),
    createTask: create.asyncThunk(
      async ({ title, todolistId }: CreateTaskPayload, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask({ todolistId, title })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return {
              task: res.data.data.item,
            }
          } else {
            handleAppError<{ item: DomainTask }>(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError(dispatch, error)
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),

    updateTask: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; model: Partial<DomainTask> },
        { rejectWithValue, getState, dispatch },
      ) => {
        const allTodolistTasks = (getState() as RootState).tasks[payload.todolistId]

        const task = allTodolistTasks.find((task) => task.id === payload.taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const model: UpdateTaskModel = {
          title: task.title,
          startDate: task.startDate,
          priority: task.priority,
          description: task.description,
          status: task.status,
          deadline: task.deadline,
          ...payload.model,
        }

        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({
            todolistId: task.todoListId,
            taskId: task.id,
            model,
          })
          dispatch(changeStatusAC({ status: "succeeded" }))
          return {
            updatedTask: res.data.data.item,
          }
        } catch (error) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { id, todoListId } = action.payload.updatedTask
          const tasks = state[todoListId]
          const index = tasks.findIndex((task) => task.id === id)

          if (index !== -1) {
            tasks[index] = action.payload.updatedTask
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder.addCase(createTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(deleteTodolist.fulfilled, (state, action) => {
      delete state[action.payload.id]
    })
  },
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
})

export const tasksReducer = tasksSlice.reducer
export const { updateTask, createTask, deleteTask, fetchTasks } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
