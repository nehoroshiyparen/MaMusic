import { DataTypes, InferAttributes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import TrackMeta from "./TrackMeta.model";

class Track extends Model {
    public id!: number;
    public file_key!: string;
    public owner_id!: number;
    public is_public!: boolean;
}

Track.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        file_key: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_public: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        sequelize,
        tableName: 'Tracks',
        modelName: 'Track',
        timestamps: true,
    }
)

export type TrackAttributes = InferAttributes<Track>
export default Track