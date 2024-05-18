import { Router } from "express"

import * as postLogin from "./post.login"
import * as postRegister from "./post.register"

import validationMiddleware from "../../middleware/validationMiddleware"

const router = Router()

export default () => {
	router.post("/login", validationMiddleware(postLogin.requestSchema), postLogin.workflow)
	router.post("/register", validationMiddleware(postRegister.requestSchema), postRegister.workflow)

	return router
}
