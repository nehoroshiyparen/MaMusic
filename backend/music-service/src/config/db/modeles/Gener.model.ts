import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import TrackMeta from "./TrackMeta.model";
import TrackMetaGenres from "./TrackMetaGenres.model";

class Genre extends Model {
    public id!: number;
    public name!: string;
}

Genre.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        }
    },
    {
        sequelize,
        tableName: 'Genres',
        modelName: 'Genre',
    }
)

export default Genre