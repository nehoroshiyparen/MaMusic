export type SagaStep = {
    service: string
    action: () => Promise<void>
    compensation?: () => Promise<void>
}