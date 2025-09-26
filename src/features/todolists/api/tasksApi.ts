import { instance } from "@/common/instance"
import { BaseResponse } from "@/common/types"
import type { ChangeTaskPayload, Task, TaskResponseType } from "@/features/todolists/api/taskApi.types.ts"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<TaskResponseType>(`/todo-lists/${todolistId}/tasks`)
  },
  updateTask(payload: ChangeTaskPayload) {
    const { model, taskId, todolistId } = payload
    return instance.put<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
