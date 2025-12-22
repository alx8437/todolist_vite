import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export type ThemeMode = "dark" | "light"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    changeStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
  }),
  selectors: {
    selectThemeMode: (sliceState) => sliceState.themeMode,
    selectStatus: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
})

export const appReducer = appSlice.reducer
export const { changeThemeModeAC, changeStatusAC, setErrorAC } = appSlice.actions
export const { selectThemeMode, selectStatus, selectError } = appSlice.selectors
