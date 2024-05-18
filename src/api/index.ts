import { Router } from "express"
import authRouter from "./auth"

const router = Router()

export default () => {
	router.use("/auth", authRouter())

	return router
}
