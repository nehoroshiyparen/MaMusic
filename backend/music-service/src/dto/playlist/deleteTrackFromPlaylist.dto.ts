import { z } from 'zod'

export const deleteTrackFromPlaylistSchema = z.object({
    playlist_id: z.number(),
    track_id: z.number()
})

export type DeleteTrackFromPlaylistDto = z.infer<typeof deleteTrackFromPlaylistSchema>