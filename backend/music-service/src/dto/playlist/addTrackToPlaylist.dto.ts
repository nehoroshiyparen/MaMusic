import { z } from 'zod'

export const addTrackToPlaylistSchema = z.object({
    playlist_id: z.number(),
    track_id: z.number()
})

export type AddTrackToPlaylistDto = z.infer<typeof addTrackToPlaylistSchema>