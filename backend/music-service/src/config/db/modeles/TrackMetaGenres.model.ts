import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import Genre from "./Gener.model";
import TrackMeta from "./TrackMeta.model";

class TrackMetaGenres extends Model {
    public track_meta_id!: number;
    public genre_id!: number;
}

TrackMetaGenres.init(
    {
        track_meta_id: {
            type: DataTypes.INTEGER,
            references: { model: 'Track_Meta', key: 'id' },
            primaryKey: true,
        },
        genre_id: {
            type: DataTypes.INTEGER,
            references: { model: 'Genre', key: 'id' },
            primaryKey: true,
        },
    },
    {
        sequelize,
        tableName: 'Track_Meta_Genres',
    }
)

Genre.belongsToMany(TrackMeta, { through: TrackMetaGenres, foreignKey: 'genre_id', as: 'tracks' })
TrackMeta.belongsToMany(Genre, { through: TrackMetaGenres, foreignKey: 'track_meta_id', as: 'genres' })

export default TrackMetaGenres