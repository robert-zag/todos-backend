import { Router } from "express"
import swaggerUi from "swagger-ui-express"
import openApiDocument from "./openApi"

const router = Router()

export default () => {
	router.use("/", swaggerUi.serve)
	router.get("/", swaggerUi.setup(openApiDocument))

	return router
}
