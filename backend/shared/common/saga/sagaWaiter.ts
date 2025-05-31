import { ApiError } from "../utils/api-error"
import { SagaAck } from "./interfaces/SagaAck.interface"


export class SagaWaiter {
    private waiters = new Map<string, {
        expected: number,
        recieved: SagaAck[],
        resolve: (data: SagaAck[]) => void,
        reject: (err: Error) => void,
        timer: NodeJS.Timeout
    }>()

    createWaiter(correlationId: string, expectedCount: number, timeout = 5000): void {
        if (this.waiters.has(correlationId)) {
            throw new Error(`Waiter for correlationId ${correlationId} already exists`)
        }

        let resolve!: (data: SagaAck[]) => void
        let reject!: (err: Error) => void

        const timer = setTimeout(() => {
            this.waiters.delete(correlationId)
            reject(ApiError.BadRequest('Timeout waiting for all acks', 'TIMEOUT_KAFKA'))
        }, timeout)

        this.waiters.set(correlationId, {
            expected: expectedCount,
            recieved: [],
            resolve,
            reject,
            timer
        })
    }

    async waitForAcks(correlationId: string): Promise<SagaAck[]> {
        const waiter = this.waiters.get(correlationId)
        if (!waiter) {
            throw new Error(`No waiter found for correlationId: ${correlationId}`)
        }

        return new Promise((resolve, reject) => {
            // Проксируем в тот же промис
            waiter.resolve = resolve
            waiter.reject = reject

            // Убедимся, что если уже все пришло — сразу зарезолвим
            if (waiter.recieved.length >= waiter.expected) {
                clearTimeout(waiter.timer)
                this.waiters.delete(correlationId)
                resolve(waiter.recieved)
            }
        })
    }

    onMessage(correlationId: string, ack: SagaAck) {
        const waiter = this.waiters.get(correlationId)
        if (!waiter) return

        if (ack.type === 'fail') {
            clearTimeout(waiter.timer)
            this.waiters.delete(correlationId)
            waiter.reject(ApiError.BadRequest(`Failure from ${ack.from}`))
            return
        }

        waiter.recieved.push(ack)

        if (waiter.recieved.length >= waiter.expected) {
            clearTimeout(waiter.timer)
            this.waiters.delete(correlationId)
            waiter.resolve(waiter.recieved)
        }
    }
}