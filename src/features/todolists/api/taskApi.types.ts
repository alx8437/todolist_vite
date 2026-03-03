import { TaskPriority, TaskStatus } from "@/common/enums"
import { z } from "zod/v4"
import { baseResponseSchema } from "@/common/types"

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.iso.datetime({ local: true }),
})

export type DomainTask = z.infer<typeof domainTaskSchema>

export const getTaskSchema = z.object({
  totalCount: z.number().int().nonnegative(),
  error: z.string().nullable(),
  items: domainTaskSchema.array(),
})

export type TaskResponseType = z.infer<typeof getTaskSchema>

// Create and update task schema
export const taskOperationResponseSchema = baseResponseSchema(
  z.object({
    item: domainTaskSchema,
  }),
)

export type TaskOperationResponse = z.infer<typeof taskOperationResponseSchema>

export type UpdateTaskModel = Omit<DomainTask, "id" | "todoListId" | "order" | "addedDate">

export type ChangeTaskPayload = {
  todolistId: string
  taskId: string
  model: UpdateTaskModel
}

export type CreateTaskPayload = {
  todolistId: string
  title: string
}

export type DeleteTaskPayload = {
  todolistId: string
  taskId: string
}
