import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Playlist extends Model {
    public id!: number;
    public owner_id!: number;
    public url!: string;
    public title!: string;
    public description!: string;
    public cover_url!: string;
    public is_public!: boolean;
}

Playlist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Новый плейст'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: { 
                len: [0, 300] 
            }
        },
        cover_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'url',
        },
        is_public: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        sequelize,
        tableName: 'Playlists',
        modelName: 'Playlist',
        timestamps: true,
    }
)

export default Playlist