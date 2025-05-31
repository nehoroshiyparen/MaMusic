import { ApiError } from "shared/common/utils/ApiError/api-error";
import { loadEsm } from 'load-esm';
import { IAudioMetadata } from "music-metadata";

export async function getMetadataFromBuffer(fileBuffer: Buffer): Promise<IAudioMetadata> {
    try {
        const mm = await loadEsm<typeof import('music-metadata')>('music-metadata');
        const metadata = await mm.parseBuffer(fileBuffer, 'audio/mpeg');
        return metadata
    } catch (e) {
        console.log(e)
        throw ApiError.Internal('Error while parsing Metadata from the track', 'TRACK_PARSE_ERROR', e)
    }
}