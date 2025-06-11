import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MaMusic API',
            version: '1.0.0',
            description: 'Дока для музыкального сервиса MaMusic. Работа с треками, плейлистами и их загрузками, стримингом осуществляется здесь',
        },
        servers: [
            {
                url: 'http://localhost:5112',
                description: 'Дока'
            }
        ]
    },
    apis: [
        path.join(__dirname, './**/*.yaml'),
        path.join(__dirname, '../../../../shared/swagger/**/*.yaml'),
    ],
}

export const swaggerSpec = swaggerJsdoc(options)