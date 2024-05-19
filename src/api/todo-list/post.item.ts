import { NextFunction, Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import { z } from "zod"
import { ItemStatus, User } from "@prisma/client"

export const requestSchema = z.object({
	body: z.object({
		title: z.string().min(1),
		text: z.string().min(1),
		deadLine: z.string().refine(date => !isNaN(Date.parse(date)), { message: "Invalid date format" })
	}),
	query: z.object({}).optional(),
	params: z.object({
		todoListId: z.string()
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

		const { title, text, deadLine } = body
		const { todoListId } = params

		if (!authUser) {
			return res.status(401).json({
				message: "You need to be logged in"
			})
		}

		const todoList = await prisma.todoList.findUnique({ where: { id: todoListId } })
		if (!todoList) {
			return res.status(404).json({
				message: "Todo list not found"
			})
		}

		const userListOwnership = await prisma.userTodoList.findUnique({
			where: {
				userId_todoListId: {
					userId: authUser.id,
					todoListId
				}
			}
		})
		if (!userListOwnership) {
			return res.status(403).json({
				message: "You do not have access to this todo list"
			})
		}

		const todoItem = await prisma.todoItem.create({
			data: {
				title,
				text,
				deadLine: new Date(deadLine),
				todoListId,
				createdById: authUser.id
			}
		})

		return res.json({
			message: "Todo item created successfully",
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
