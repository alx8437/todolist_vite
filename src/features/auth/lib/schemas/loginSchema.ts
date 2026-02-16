import { z } from "zod/v4"

const MIN = 3
const MAX = 10

export const loginSchema = z.object({
  email: z.email({ error: "Некорректный email" }),
  password: z
    .string()
    .min(MIN, `Пароль должен быть минимум ${MIN} символа`)
    .max(MAX, `Пароль должен быть максимум ${MAX} символов`),
  rememberMe: z.boolean(),
})

export type LoginInputs = z.infer<typeof loginSchema>
