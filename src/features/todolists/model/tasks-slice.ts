import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistAC, deleteTodolistAC } from "@/features/todolists/model/todolists-slice.ts"

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
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
        const newTask: Task = { ...action.payload, isDone: false }
        state[action.payload.todolistId].push(newTask)
      },
    ),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)

      if (index !== -1) {
        tasks[index].isDone = action.payload.isDone
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
    builder.addCase(createTodolistAC, (state, action) => {
      state[action.payload.id] = []
    })
    builder.addCase(deleteTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
  },
})

export const tasksReducer = tasksSlice.reducer
export const { changeTaskStatusAC, changeTaskTitleAC, createTaskAC, deleteTaskAC } = tasksSlice.actions

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
