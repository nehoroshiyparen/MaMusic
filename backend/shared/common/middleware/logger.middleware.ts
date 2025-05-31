import { v4 as uuidv4 } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import { logInfo } from '../utils/logger/logger'

// Логирование приходящего запроса

export const attachCorrelationId = (req: Request, res: Response, next: NextFunction) => {
    const incomingId = req.headers['x-correlation-id']
    const correlationId = Array.isArray(incomingId) ? incomingId[0] : (incomingId || uuidv4())
    const accessToken = req.cookies?.accessToken

    req.headers['x-correlation-id'] = correlationId
    res.setHeader('x-correlation-id', correlationId)
    
    logInfo( `Incomming request to ${req.method} ${req.url}`, correlationId, accessToken)

    next() 
}