import { Router } from "express";
import { EditData, FetchStat } from "../controllers/user.controller";

const router = Router()

router.post('/edit', EditData)
router.get('/fetchStat', FetchStat)

export default router