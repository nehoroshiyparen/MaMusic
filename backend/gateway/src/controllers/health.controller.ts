import { Request, Response } from "express";
import { getHealthStatus } from "../utils/health/getHealthStatus";
import { checkServicesHealth } from '../utils/health/checkServicesHealth'

export const healthCheck = (_req: Request, res: Response) => {
    const health = getHealthStatus();
    res.status(health.status).json(health)
};

export const generalHealthCheck = async(req: Request, res: Response) => {
    const rawCorrelationId = req.headers['x-correlation-id']
    const correlationId = Array.isArray(rawCorrelationId) ? rawCorrelationId[0] : rawCorrelationId || ''

    const health = await getHealthStatus()
    const services = await checkServicesHealth(correlationId)

    const hasError = services.some(service => service.status === 'ERROR')

    res.status(hasError ? 207 : 200).json({
        gateway: health,
        services: services,
    })
}