import { ItemStatus } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { prisma } from "../../lib/prisma"

export const requestSchema = z.object({
	body: z.object({}).optional(),
	query: z.object({}).optional(),
	params: z.object({
		todoListId: z.string()
	})
})

export const responseSchema = z.object({
	message: z.string().optional(),
	todoList: z
		.object({
			id: z.string(),
			title: z.string(),
			todoItems: z.array(
				z.object({
					id: z.string(),
					title: z.string(),
					text: z.string(),
					deadLine: z.date(),
					todoListId: z.string(),
					status: z.nativeEnum(ItemStatus)
				})
			)
		})
		.optional()
})

type RequestType = z.infer<typeof requestSchema>
type ResponseType = z.infer<typeof responseSchema>

export const workflow = async (req: Request, res: Response<ResponseType>, next: NextFunction) => {
	try {
		const { params } = req as typeof req & RequestType

		const { todoListId } = params

		const todoList = await prisma.todoList.findUnique({ where: { id: todoListId } })
		if (!todoList) {
			return res.status(404).json({
				message: "Todo list not found"
			})
		}

		const todoItems = await prisma.todoItem.findMany({
			where: {
				todoListId
			}
		})

		return res.json({
			todoList: {
				id: todoList.id,
				title: todoList.title,
				todoItems: todoItems.map(todoItem => ({
					id: todoItem.id,
					title: todoItem.title,
					text: todoItem.text,
					deadLine: todoItem.deadLine,
					todoListId: todoItem.todoListId,
					status: todoItem.status
				}))
			}
		})
	} catch (error) {
		return next(error)
	}
}
