import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";
import { AuthUserAttributes } from "../../types/user.types";

type AuthUserCreationAttributes = Optional<AuthUserAttributes, 'id' | 'is_verified'> 

class AuthUser extends Model<AuthUserAttributes, AuthUserCreationAttributes> 
    implements AuthUserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password_hash!: string;
    public is_verified!: boolean;
}

AuthUser.init(
    {
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true 
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'auth_users',
        modelName: 'AuthUser',
        timestamps: true,
    }
)

export default AuthUser