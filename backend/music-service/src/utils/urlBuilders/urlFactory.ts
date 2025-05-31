import dotenv from 'dotenv'
import { randomUUID } from 'crypto'

dotenv.config()

const baseUrl = process.env.BASE_URL

export const createPlaylistLink = () => {
    const id = randomUUID()
    const link = `${baseUrl}/playlists/${id}`
    return link
}