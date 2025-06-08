import { z } from 'zod'

export const updatePlaylistSchema = z.object({
    title: z.string().optional(),
    description: z.string().max(300).optional(),
    isPublic: z.boolean().optional()
})

export type UpdatePlaylistDto = z.infer<typeof updatePlaylistSchema>