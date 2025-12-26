import { changeStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { BaseResponse } from "@/common/types"

export const handleAppError = <T>(dispatch: Dispatch, data: BaseResponse<T>) => {
  dispatch(changeStatusAC({ status: "failed" }))
  const error = data.messages.length ? data.messages[0] : "Something went wrong"
  dispatch(setErrorAC({ error }))
}
