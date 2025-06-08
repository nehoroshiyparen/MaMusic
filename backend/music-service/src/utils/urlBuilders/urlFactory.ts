import dotenv from 'dotenv'
import { randomUUID } from 'crypto'

dotenv.config()

const baseUrl = process.env.BASE_URL

export const createPlaylistLink = () => {
    const id = randomUUID()
    const link = `${baseUrl}/playlists/${id}`
    return link
}

export const createFilename = (title: string, artists: string[]) => {
    return `${title.split(' ').join('_')}__${artists.map(artist => artist.split(' ').join('_')).join(',_')}`.replace('/', '_')
}

export const getPublicUrl = (key: string) => {
    const [folder, identifier] = key.split('/')
    return `https://console.yandex.cloud/folders/b1gt7k3osg4pjv1r55lr/storage/buckets/nehorosiyparen-music?key=${folder}%2F${identifier}`
}