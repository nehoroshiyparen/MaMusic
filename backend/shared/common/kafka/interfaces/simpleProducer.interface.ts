export interface SimpleProducer {
    connect(): Promise<void>;
    disconnect(): Promise<void>; 
}