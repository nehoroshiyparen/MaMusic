import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import Playlist from "./Playlist.model";

class Playlist_Likes extends Model {
    public user_id!: number;
    public playlist_id!: number;
}

Playlist_Likes.init(
    {
        user_id: { 
            type: DataTypes.INTEGER,
            allowNull: false, 
            primaryKey: true 
        },
        playlist_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Playlist',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    },
    {
        sequelize,
        tableName: 'Playlist_Likes',
        modelName: 'Playlist_Likes',
    }
)

Playlist.hasMany(Playlist_Likes, { 
    foreignKey: 'playlist_id', 
    as: 'likes',
    onDelete: 'CASCADE',
    hooks: true
})
Playlist_Likes.belongsTo(Playlist, { foreignKey: 'playlist_id', as: 'playlist' })

export default Playlist_Likes