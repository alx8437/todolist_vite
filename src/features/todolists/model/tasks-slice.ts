import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { CreateTaskPayload, DeleteTaskPayload, DomainTask } from "@/features/todolists/api/taskApi.types.ts"
import { TaskStatus } from "@/common/enums/enums.ts"

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
      async ({ title, todolistId }: CreateTaskPayload, { rejectWithValue }) => {
        try {
          const res = await tasksApi.createTask({ todolistId, title })
          return {
            task: res.data.data.item,
          }
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)

      if (index !== -1) {
        tasks[index].status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.New
      }
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)

      if (index !== -1) {
        tasks[index].title = action.payload.title
      }
    }),
  }),
  extraReducers: (builder) => {
    builder.addCase(createTodolistTC.fulfilled, (state, action) => {
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
export const { changeTaskStatusAC, changeTaskTitleAC, createTask, deleteTask, fetchTasks } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
