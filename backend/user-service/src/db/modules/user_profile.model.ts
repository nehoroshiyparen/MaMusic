import { DataTypes, Model } from 'sequelize'
import sequelize from "../config/sequelize";

class User extends Model {
    public id!: number;
    public username!: string;
    public avatar_url!: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        avatar_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
    }
)

export default User