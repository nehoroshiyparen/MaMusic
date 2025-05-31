import axios from 'axios'
import { HealthCheckResponse } from 'shared/common/types/health.interface'
import { logInfo } from 'shared/common/utils/logger/logger';

interface ServiceHealth {
    service: string;
    status: 'OK' | "ERROR";
    error?: string;
    data?: HealthCheckResponse;
}

export const checkServicesHealth = async(correlationId: string): Promise<ServiceHealth[]> => {
    const services = [
        { name: 'USER', url: 'http://user-service:5223/health' },
        { name: 'AUTH', url: 'http://auth-service:5001/health' },
        { name: 'MUSIC', url: 'http://music-service:5112/health' },
    ]

    const checks = services.map(async ({ name, url }) => {
        try {
            const res = await axios.get<HealthCheckResponse>(url, {
                headers: {
                    'x-correlation-id': String(correlationId)
                }
            })
            return {
                service: name,
                status: 'OK' as const,
                data: res.data,
            }
        } catch (e) {
            return {
                service: name,
                status: "ERROR" as const,
                error: (e as Error).message,
            }
        }
    })

    return Promise.all(checks)
}