import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import Playlist from "./Playlist.model";
import Track from "./Track.model";

class Playlist_Tracks extends Model {
    public playlist_id!: number;
    public track_id!: number;
    public order!: number;
}

Playlist_Tracks.init(
    {
        playlist_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        track_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        tableName: 'Playlist_Tracks',
        modelName: 'Playlist_Tracks',
    }
)

Playlist.belongsToMany(Track, { through: Playlist_Tracks, foreignKey: 'playlist_id', as: 'tracks' })
Track.belongsToMany(Playlist, { through: Playlist_Tracks, foreignKey: 'track_id', as: 'playlists'})

export default Playlist_Tracks