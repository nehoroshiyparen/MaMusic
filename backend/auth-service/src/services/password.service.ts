import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

export class PasswordService {
    private saltRounds: number = Number(process.env.SALT_ROUNDS)

    async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, this.saltRounds)
        return hash
    }

    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}