import { z } from 'zod'
import { TrackMetaSchema } from './trackMeta.schema'

export const fetchTrackSchema = z.object({
    id: z.number(),
    owner_id: z.number(),
    file_url: z.string(),
    is_public: z.boolean(),
    meta: TrackMetaSchema,
})

export type FetchTrackResponse = z.infer<typeof fetchTrackSchema>