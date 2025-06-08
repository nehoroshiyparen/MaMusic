import { z } from 'zod' 

export const TrackMetaSchema = z.object({
    title: z.string(),
    artists: z.array(z.string()),
    duration: z.number(),
    cover_url: z.string().url().nullable()
})