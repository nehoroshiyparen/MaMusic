import { Request, Response, NextFunction } from 'express'

export function createHandler<T>(
    getHandler: () => (req: Request, res: Response, next: NextFunction) => Promise<any> | void 
)   {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const handler = getHandler()
            await handler(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}