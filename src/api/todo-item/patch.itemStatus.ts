import { NextFunction, Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import { z } from "zod"
import { ItemStatus, User } from "@prisma/client"

export const requestSchema = z.object({
	body: z.object({
		status: z.nativeEnum(ItemStatus)
	}),
	query: z.object({}).optional(),
	params: z.object({
		todoItemId: z.string()
	})
})

export const responseSchema = z.object({
	message: z.string(),
	todoItem: z
		.object({
			id: z.string(),
			title: z.string(),
			text: z.string(),
			deadLine: z.date(),
			todoListId: z.string(),
			status: z.nativeEnum(ItemStatus)
		})
		.optional()
})

type RequestType = z.infer<typeof requestSchema>
type ResponseType = z.infer<typeof responseSchema>

export const workflow = async (req: Request, res: Response<ResponseType>, next: NextFunction) => {
	try {
		const { params, body, user: authUser } = req as typeof req & RequestType & { user: User }

		const { status } = body
		const { todoItemId } = params

		if (!authUser) {
			return res.status(401).json({
				message: "You need to be logged in"
			})
		}

		const existingTodoItem = await prisma.todoItem.findUnique({ where: { id: todoItemId } })
		if (!existingTodoItem) {
			return res.status(404).json({
				message: "Todo item not found"
			})
		}

		const userListOwnership = await prisma.userTodoList.findUnique({
			where: {
				userId_todoListId: {
					userId: authUser.id,
					todoListId: existingTodoItem.todoListId
				}
			}
		})
		if (!userListOwnership) {
			return res.status(403).json({
				message: "You do not have access to this todo list"
			})
		}

		if (status === existingTodoItem.status) {
			return res.status(400).json({
				message: "Todo item is already in this status"
			})
		}

		const todoItem = await prisma.todoItem.update({
			where: { id: todoItemId },
			data: {
				status
			}
		})

		return res.json({
			message: "Todo item status updated successfully",
			todoItem: {
				id: todoItem.id,
				title: todoItem.title,
				text: todoItem.text,
				deadLine: todoItem.deadLine,
				todoListId: todoItem.todoListId,
				status: todoItem.status
			}
		})
	} catch (error) {
		return next(error)
	}
}
