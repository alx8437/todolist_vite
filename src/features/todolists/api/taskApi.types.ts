import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"

export type Task = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type TaskResponseType = {
  items: Array<Task>
  totalCount: number
  error: string | null
}

export type UpdateTaskModel = Omit<Task, "id" | "todoListId" | "order" | "addedDate">

export type ChangeTaskPayload = {
  todolistId: string
  taskId: string
  model: UpdateTaskModel
}
