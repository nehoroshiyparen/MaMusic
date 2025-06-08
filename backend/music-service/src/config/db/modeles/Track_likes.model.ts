import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import Track from "./Track.model";

class Track_Likes extends Model {
    public user_id!: number;
    public track_id!: number;
}

Track_Likes.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        track_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Track',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    },
    {
        sequelize,
        tableName: 'Track_Likes',
        modelName: 'Track_Likes',
        timestamps: true,
    }
)

Track.hasMany(Track_Likes, { 
    foreignKey: 'track_id', 
    as: 'likes',
    onDelete: 'CASCADE',
    hooks: true
})
Track_Likes.belongsTo(Track, { foreignKey: 'track_id', as: 'track' })

export default Track_Likes