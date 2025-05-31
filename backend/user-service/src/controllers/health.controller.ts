import { Request, Response } from "express";
import { getHealthStatus } from "../utils/health";

export const healthCheck = async(_req: Request, res: Response) => {
    const health = await getHealthStatus()
    res.status(health.status).json(health)
}