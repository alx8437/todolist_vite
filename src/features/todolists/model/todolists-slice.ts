import { createSlice, nanoid } from "@reduxjs/toolkit"

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as Todolist[],
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        return { payload: { id: nanoid(), title } }
      },
      (state, action) => {
        state.push({ ...action.payload, filter: "all" })
      },
    ),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)

      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((tl) => tl.id === action.payload.id)

      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
})

export const todolistsReducer = todolistsSlice.reducer

export const { createTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, deleteTodolistAC } =
  todolistsSlice.actions
