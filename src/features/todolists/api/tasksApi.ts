import { instance } from "@/common/instance"
import {
  ChangeTaskPayload,
  CreateTaskPayload,
  DeleteTaskPayload,
  TaskOperationResponse,
  TaskResponseType,
} from "@/features/todolists/api/taskApi.types.ts"
import { DefaultResponse } from "@/common/types"

export const tasksApi = {
  getTasks(payload: { todolistId: string }) {
    const { todolistId } = payload
    return instance.get<TaskResponseType>(`/todo-lists/${todolistId}/tasks`)
  },
  updateTask(payload: ChangeTaskPayload) {
    const { model, taskId, todolistId } = payload
    return instance.put<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  createTask(payload: CreateTaskPayload) {
    const { title, todolistId } = payload
    return instance.post<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(payload: DeleteTaskPayload) {
    const { taskId, todolistId } = payload
    return instance.delete<DefaultResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
