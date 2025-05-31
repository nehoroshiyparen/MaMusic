export interface MulterFileArray {
    [fieldname: string]: Express.Multer.File[]
}

export interface MulterFile extends Express.Multer.File {}