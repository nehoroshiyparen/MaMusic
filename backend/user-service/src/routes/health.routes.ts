import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";

const router = Router()

router.use("/health", healthCheck)

export default router