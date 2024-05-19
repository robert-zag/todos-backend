import { Router } from "express"
import authRouter from "./auth"
import todoListRouter from "./todo-list"
import todoItemRouter from "./todo-item"

const router = Router()

export default () => {
	router.use("/auth", authRouter())
	router.use("/todo-list", todoListRouter())
	router.use("/todo-item", todoItemRouter())

	return router
}
