import dotenv from 'dotenv'
import './user_profile.model'

dotenv.config()

const registerModels = () => {
    console.log(`Models registered: for ${process.env.DB_DATABASE}`)
}

export default registerModels