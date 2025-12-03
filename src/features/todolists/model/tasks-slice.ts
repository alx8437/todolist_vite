import { nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask } from "@/features/todolists/api/taskApi.types.ts"
import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { rejectWithValue }) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
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
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),
    createTaskAC: create.preparedReducer(
      ({ todolistId, title }) => {
        return { payload: { id: nanoid(), todolistId, title } }
      },
      (state, action) => {
        const newTask: DomainTask = {
          id: action.payload.id,
          status: TaskStatus.New,
          todoListId: action.payload.todolistId,
          title: action.payload.title,
          startDate: "",
          priority: TaskPriority.Low,
          description: "",
          deadline: "",
          addedDate: "",
          order: 1,
        }
        state[action.payload.todolistId].push(newTask)
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
export const { changeTaskStatusAC, changeTaskTitleAC, createTaskAC, deleteTaskAC, fetchTasks } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
