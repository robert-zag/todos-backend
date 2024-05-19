import { Router } from "express"

import * as postList from "./post.list"
import * as getList from "./get.list"
import * as postItem from "./post.item"
import * as postListShare from "./post.listShare"

import validationMiddleware from "../../middleware/validationMiddleware"
import authMiddleware from "../../middleware/authMiddleware"

const router = Router()

export default () => {
	router.post("/", authMiddleware, validationMiddleware(postList.requestSchema), postList.workflow)
	router.get("/:todoListId", validationMiddleware(getList.requestSchema), getList.workflow)
	router.post("/:todoListId/item", authMiddleware, validationMiddleware(postItem.requestSchema), postItem.workflow)
	router.post("/:todoListId/share", authMiddleware, validationMiddleware(postListShare.requestSchema), postListShare.workflow)

	return router
}
