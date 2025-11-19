import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"

const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
  }),
})

export const appReducer = appSlice.reducer
export const { changeThemeModeAC } = appSlice.actions
