import { z } from 'zod'
import { TrackMetaSchema } from './trackMeta.schema'

export const fetchTrackSchema = z.object({
    id: z.number(),
    onwer_id: z.number(),
    is_public: z.boolean(),
    meta: TrackMetaSchema,
})

export type FetchTrackResponse = z.infer<typeof fetchTrackSchema>