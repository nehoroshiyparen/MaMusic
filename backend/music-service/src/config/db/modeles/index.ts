import dotenv from 'dotenv'
import Genre from './Gener.model'
import Playlist from './Playlist.model'
import Playlist_Tracks from './Playlist_Tracks.model'
import Track from './Track.model'
import Track_Likes from './Track_likes.model'
import TrackMeta from './TrackMeta.model'
import TrackMetaGenres from './TrackMetaGenres.model'


dotenv.config()

function setupAssociations() {
    Track.hasOne(TrackMeta, { foreignKey: 'track_id', as: 'meta', onDelete: 'CASCADE' })
    TrackMeta.belongsTo(Track, { foreignKey: 'track_id', as: 'track', onDelete: 'CASCADE' })
}

const registerModels = () => {
    setupAssociations()
    console.log(`Models registered for ${process.env.DB_DATABASE}`)
}

export default registerModels