import { TokenPayload } from '../payload/token.payload'
import { Request } from 'express'

declare module 'express-serve-static-core' {
    interface Request {
      user?: TokenPayload;
    }
}