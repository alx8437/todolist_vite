export type DomainTask = {
  description: string | null
  title: string
  status: number
  priority: number
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
