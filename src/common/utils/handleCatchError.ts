import { changeStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { isAxiosError } from "axios"
import { z } from "zod/v4"

export const handleCatchError = (dispatch: Dispatch, error: unknown) => {
  let errorMessage

  switch (true) {
    case isAxiosError(error):
      errorMessage = error.response?.data?.message || error.message
      break

    case error instanceof z.ZodError:
      errorMessage = "Zod error validation, look at the console"
      console.log(error.issues)
      break

    case error instanceof Error:
      errorMessage = `Native error ${error.message}`
      break

    default:
      errorMessage = "Something went wrong"
  }

  dispatch(setErrorAC({ error: errorMessage }))
  dispatch(changeStatusAC({ status: "failed" }))
}
