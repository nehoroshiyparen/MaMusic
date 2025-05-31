import { ApiError } from '../utils/api-error'
import { logError, logInfo } from '../utils/logger/logger'
import { SagaStep } from './interfaces/SagaStep.interface'

export class SagaManager {
    private steps: SagaStep[] = []
    public addStep(step: SagaStep) {
        this.steps.push(step)
    }

    async execute() {
        const executedSteps: SagaStep[] = []

        for (const step of this.steps) {
            try {
                await step.action()
                executedSteps.push(step)
            } catch (e) {
                logError(`[Saga Error] Step failed in ${step.service}`, e)
                for (const executeStep of executedSteps) {
                    try {
                        if (executeStep.compensation) {
                            await executeStep.compensation()
                        }
                    } catch (compError) {
                        logError(`[Saga Error] Compensation failed in ${executeStep.service}`, compError)
                    }
                }
                throw ApiError.Internal('Saga failed and compensated')
            }
        }
    }
}