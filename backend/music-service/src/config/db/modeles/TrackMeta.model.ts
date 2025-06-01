import { DataTypes, InferAttributes, Model } from "sequelize";
import sequelize from '../config/sequelize'

class TrackMeta extends Model {
    public id!: number;
    public track_id!: number;
    public title!: string;
    public artists!: string[];
    public duration!: number;
    public cover_url!: string;
}

TrackMeta.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true, 
            primaryKey: true 
        },
        track_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            references: {
                model: 'Tracks',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artists: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        duration: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        cover_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true,
        }
    },
    {
        sequelize,
        tableName: 'Track_Meta',
        modelName: 'Track_Meta'
    }
)

export type TrackMetaAttributes = InferAttributes<TrackMeta>
export default TrackMeta