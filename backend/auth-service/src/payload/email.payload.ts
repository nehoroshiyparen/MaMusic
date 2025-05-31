import { z } from "zod"

export const emailSchema = (value: string) => {
    return z.string().email().safeParse(value).success
}