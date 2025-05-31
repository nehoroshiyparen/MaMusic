import { Response, Request } from "express";

export const EditData = async(req: Request, res: Response) => {
    console.log('User data edit logic')
    res.status(201).json({message: 'Data edited'})
}

export const FetchStat = async(req: Request, res: Response) => {
    console.log('Stat fetching logic')
    res.status(201).json({message: 'Stats fetched', stats: 'some stats'})
}