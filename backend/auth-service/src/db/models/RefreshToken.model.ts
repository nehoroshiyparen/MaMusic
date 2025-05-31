import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize'

class RefreshToken extends Model {
    public id!: number;
    public user_id!: number;
    public token!: string;
}

RefreshToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'auth_users',
                key: 'id',
            },
            onDelete: 'CASCADE'
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'refresh_tokens',
        modelName: 'RefreshToken',
        timestamps: true,
    }
)

export default RefreshToken