import { Router } from "express"

import * as patchItemStatus from "./patch.itemStatus"

import validationMiddleware from "../../middleware/validationMiddleware"
import authMiddleware from "../../middleware/authMiddleware"

const router = Router()

export default () => {
	router.patch("/:todoItemId/status", authMiddleware, validationMiddleware(patchItemStatus.requestSchema), patchItemStatus.workflow)

	return router
}
