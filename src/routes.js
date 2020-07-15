import express from "express"
import remiderController from "./controllers/reminder_controller"

const router=express.Router()

router.post("/reminder/:transaction_id",remiderController.upsert)
router.post("/reminder",remiderController.post)

export default router