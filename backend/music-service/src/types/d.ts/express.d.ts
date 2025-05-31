import { TokenPayload } from '../payload/token.payload'
import { Multer } from 'multer'
import { Request } from 'express'

declare module 'express-serve-static-core' {
    interface Request {
      user?: TokenPayload;
      file?: Multer.File;
    }
}