import { z } from "zod/v4"
import { ResultCode } from "@/common/enums"

export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

type FieldError = z.infer<typeof fieldErrorSchema>

export const baseResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    data: schema,
    resultCode: z.enum(ResultCode),
    fieldsErrors: fieldErrorSchema.array(),
    messages: z.string().array(),
  })

export const defaultResponseSchema = baseResponseSchema(z.object({}))
export type DefaultResponse = z.infer<typeof defaultResponseSchema>

export type BaseResponse<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
