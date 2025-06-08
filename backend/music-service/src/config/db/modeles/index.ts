import dotenv from 'dotenv'
import Playlist from './Playlist.model'
import Playlist_Tracks from './Playlist_Tracks.model'
import Track from './Track.model'
import TrackMeta from './TrackMeta.model'


dotenv.config()

function setupAssociations() {
    Track.hasOne(TrackMeta, { foreignKey: 'track_id', as: 'meta', onDelete: 'CASCADE' })
    TrackMeta.belongsTo(Track, { foreignKey: 'track_id', as: 'track', onDelete: 'CASCADE' })
    Playlist.hasMany(Playlist_Tracks, { foreignKey: 'playlist_id', as: 'playlist_tracks'  })
}

const registerModels = () => {
    setupAssociations()
    console.log(`Models registered for ${process.env.DB_DATABASE}`)
}

export default registerModels