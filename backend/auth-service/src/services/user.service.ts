import AuthUser from "src/db/models/AuthUser.model";
import { RegisterDto } from "src/dto/register.dto";
import { Transaction } from "sequelize";


export class UserService {
    async createUser(data: RegisterDto, transaction: Transaction) {
        return await AuthUser.create({
            username: data.username,
            email: data.email,
            password_hash: data.password, // already hashed password !!!
        }, 
        { transaction }
        )
    }

    async findUser(params: { id?: number, username?: string, email?: string }) {
        const user = await AuthUser.findOne({
            where: { 
                ...params 
            }
        })
        return user
    }

    async deleteUser(id: number) {
        await AuthUser.destroy({
            where: {
                id
            }
        })

        return
    }
}