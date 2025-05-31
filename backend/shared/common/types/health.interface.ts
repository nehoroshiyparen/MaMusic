// Тип стандартого ответа о состоянии сервиса

export interface HealthCheckResponse {
    status: number;
    timestamp: string;
    uptime: number;
    service: string;
    version: string;
    message?: string;
}