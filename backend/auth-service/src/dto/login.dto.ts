import { z } from 'zod'

export const LoginDtoSchema = z.object({
    identifier: z.string(), 
    password: z.string()
})

export type LoginDto = z.infer<typeof LoginDtoSchema>