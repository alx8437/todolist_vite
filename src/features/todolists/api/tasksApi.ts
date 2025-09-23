import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import type { DomainTask, TaskResponseType } from "@/features/todolists/api/taskApi.types.ts"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<TaskResponseType>(`/todo-lists/${todolistId}/tasks`)
  },
  changeTask(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
  createTask(todolistId: string, title: string) {
    return instance.post<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
