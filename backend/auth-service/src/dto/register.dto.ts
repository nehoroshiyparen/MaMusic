import { z } from 'zod'

export const RegisterDtoSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 3 characters')
})

export type RegisterDto = z.infer<typeof RegisterDtoSchema>