import { z } from 'zod'

export const updatePlaylistSchema = z.object({
    title: z.string().optional(),
    description: z.string().max(300).optional(),
    isPublic: z.boolean().optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'At least one field has to be specified'
    }
)

export type UpdatePlaylistDto = z.infer<typeof updatePlaylistSchema>