export interface SimpleConsumer {
    connect(): Promise<void>;
    handle: (message: any) => Promise<void>;
    disconnect(): Promise<void>;
}