import { createTodolist, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import {
  CreateTaskPayload,
  DeleteTaskPayload,
  DomainTask,
  UpdateTaskModel,
} from "@/features/todolists/api/taskApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { rejectWithValue }) => {
        try {
          const res = await tasksApi.getTasks({ todolistId })
          return { tasks: res.data.items, todolistId }
        } catch (error) {
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
      async (arg: DeleteTaskPayload, { rejectWithValue }) => {
        try {
          const res = await tasksApi.deleteTask(arg)
          return {
            resultCode: res.data.resultCode,
            todolistId: arg.todolistId,
            taskId: arg.taskId,
          }
        } catch (error) {
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
          dispatch(changeStatusAC({ status: "succeeded" }))
          return {
            task: res.data.data.item,
          }
        } catch (error) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),

    changeTaskStatus: create.asyncThunk(
      async (task: DomainTask, { rejectWithValue }) => {
        const updateTaskModel: UpdateTaskModel = {
          title: task.title,
          startDate: task.startDate,
          priority: task.priority,
          description: task.description,
          status: task.status,
          deadline: task.deadline,
        }
        try {
          const res = await tasksApi.updateTask({
            todolistId: task.todoListId,
            taskId: task.id,
            model: updateTaskModel,
          })
          return {
            updatedTask: res.data.data.item,
          }
        } catch (error) {
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
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)

      if (index !== -1) {
        tasks[index].title = action.payload.title
      }
    }),
  }),
  extraReducers: (builder) => {
    builder.addCase(createTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload.id]
    })
  },
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
})

export const tasksReducer = tasksSlice.reducer
export const { changeTaskStatus, changeTaskTitleAC, createTask, deleteTask, fetchTasks } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
