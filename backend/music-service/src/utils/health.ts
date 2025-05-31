import {HealthCheckResponse} from 'shared/common/types/health.interface'

export const getHealthStatus = (): HealthCheckResponse => {
    try {
        return {
            status: 200,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: process.env.SERVICE_NAME || "MUSIC-SERVICE",
            version: process.env.npm_package_version || '1.0.0',
        }
    } catch (e) {
        return {
            status: 500,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: process.env.SERVICE_NAME || "MUSIC-SERVICE",
            version: process.env.npm_package_version || '1.0.0',
            message: `${e}`
        }
    }
}