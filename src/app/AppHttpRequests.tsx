import { CreateItemForm, EditableSpan } from "@/common/components"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { type ChangeEvent, type CSSProperties, useEffect, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/taskApi.types.ts"
import { TaskStatus } from "@/common/enums/enums.ts"

type TaskStateType = Record<string, DomainTask[]>

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<TaskStateType>({})

  useEffect(() => {
    todolistsApi.getTodolists().then((res) => {
      const todolists = res.data
      setTodolists(todolists)

      todolists.forEach((todolist) =>
        tasksApi.getTasks(todolist.id).then((res) => {
          const tasks = res.data.items
          setTasks((prevState) => ({ ...prevState, [todolist.id]: tasks }))
        }),
      )
    })
  }, [])

  const createTodolist = (title: string) => {
    todolistsApi.createTodolist(title).then((res) => {
      const newTodolist = res.data.data.item
      setTodolists([newTodolist, ...todolists])
      setTasks({ ...tasks, [newTodolist.id]: [] })
    })
  }

  const deleteTodolist = (id: string) => {
    todolistsApi.deleteTodolist(id).then(() => setTodolists(todolists.filter((todolist) => todolist.id !== id)))
  }

  const changeTodolistTitle = (id: string, title: string) => {
    todolistsApi.changeTodolistTitle({ id, title }).then(() => {
      setTodolists(todolists.map((todolist) => (todolist.id === id ? { ...todolist, title } : todolist)))
    })
  }

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask(todolistId, title).then((res) => {
      const task = res.data.data.item
      setTasks({ ...tasks, [todolistId]: [task, ...tasks[todolistId]] })
    })
  }

  const deleteTask = (todolistId: string, taskId: string) => {
    tasksApi.deleteTask(todolistId, taskId).then((res) => {
      if (res.data.resultCode === 0) {
        setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter((task) => task.id !== taskId) })
      }
    })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const todolistId = task.todoListId

    const model: UpdateTaskModel = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
      title: task.title,
    }

    tasksApi.updateTask({ todolistId, taskId: task.id, model }).then(() => {
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].map((el) => (el.id === task.id ? { ...el, ...model } : el)),
      })
    })
  }

  const changeTaskTitle = (task: DomainTask, title: string) => {
    const todolistId = task.todoListId

    const model: UpdateTaskModel = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      status: task.status,
      title: title,
    }

    tasksApi.updateTask({ todolistId, taskId: task.id, model }).then(() => {
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].map((t) => (t.id === task.id ? { ...t, title } : t)),
      })
    })
  }

  return (
    <div style={{ margin: "20px" }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={(title) => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task) => (
            <div key={task.id}>
              <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "330px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
