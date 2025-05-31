export interface SagaAck {
    from: string;
    type: 'success' | 'fail',
    data?: any
}