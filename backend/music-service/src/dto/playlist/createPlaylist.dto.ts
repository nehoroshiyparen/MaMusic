import { z } from 'zod'

export const createPlaylistSchema = z.object({
    track: z.object({
        id: z.number()
    })
})

export type CreatePlaylistDto = z.infer<typeof createPlaylistSchema>