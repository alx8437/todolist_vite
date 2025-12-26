import { changeStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { isAxiosError } from "axios"

export const handleCatchError = (dispatch: Dispatch, error: unknown) => {
  let errorMessage

  if (isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message
  } else if (error instanceof Error) {
    errorMessage = `Native error ${error.message}`
  } else {
    errorMessage = "Something went wrong"
  }

  dispatch(setErrorAC({ error: errorMessage }))
  dispatch(changeStatusAC({ status: "failed" }))
}
