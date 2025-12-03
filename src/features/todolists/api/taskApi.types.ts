import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"

export type DomainTask = {
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
  items: Array<DomainTask>
  totalCount: number
  error: string | null
}

export type UpdateTaskModel = Omit<DomainTask, "id" | "todoListId" | "order" | "addedDate">

export type ChangeTaskPayload = {
  todolistId: string
  taskId: string
  model: UpdateTaskModel
}
