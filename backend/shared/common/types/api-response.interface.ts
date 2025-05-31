// Тип стандартного успешного ответа API

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
    error?: {
        code: string;
        message: string;
    }
}