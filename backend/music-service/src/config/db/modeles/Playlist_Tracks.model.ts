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
        }
    },
    {
        sequelize,
        tableName: 'Playlist_Tracks',
        modelName: 'Playlist_Tracks',
        indexes: [
            {
                unique: true,
                fields: ['playlist_id', 'order']
            }
        ]
    }
)

Playlist_Tracks.belongsTo(Playlist, { foreignKey: 'playlist_id' })
Playlist_Tracks.belongsTo(Track, { foreignKey: 'track_id', as: 'track' })

export default Playlist_Tracks