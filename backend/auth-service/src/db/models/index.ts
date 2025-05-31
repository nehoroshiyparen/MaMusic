import dotenv from 'dotenv'
import './AuthUser.model'
import './RefreshToken.model'
import AuthUser from './AuthUser.model'
import RefreshToken from './RefreshToken.model'

dotenv.config()

function setupAssociations() {
    AuthUser.hasOne(RefreshToken, { foreignKey: 'user_id', as: 'refresh_token', onDelete: 'CASCADE' })
    RefreshToken.belongsTo(AuthUser, { foreignKey: 'user_id', as: 'auth_user', onDelete: 'CASCADE' })
}

const registerModels = () => {
    setupAssociations()
    console.log(`Models registered for ${process.env.DB_DATABASE}`)
}

export default registerModels