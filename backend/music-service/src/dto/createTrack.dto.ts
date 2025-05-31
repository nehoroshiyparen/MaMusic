import { z } from "zod";

export const CreateTrackSchema = z.object({
    title: z.string(),
    artists: z.array(z.string())
})

export type CreateTrackDto = z.infer<typeof CreateTrackSchema>