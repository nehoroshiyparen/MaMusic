import { z } from 'zod'
import { TrackMetaSchema } from '../schemas/trackMeta.schema'

export const fetchUserLikedTracksSchema = z.object({
    id: z.number(),
    owner_id: z.number(),
    is_public: z.boolean(),
    meta: TrackMetaSchema,
    likes: z
        .object({})
}).transform(({ likes, ...rest }) => rest)

export type FetchUserLikedTracksResonse = z.infer<typeof fetchUserLikedTracksSchema>