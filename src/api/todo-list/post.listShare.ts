import { User } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { prisma } from "../../lib/prisma"

export const requestSchema = z.object({
	body: z.object({
		userId: z.string()
	}),
	query: z.object({}).optional(),
	params: z.object({
		todoListId: z.string()
	})
})

export const responseSchema = z.object({
	message: z.string(),
	todoList: z
		.object({
			id: z.string(),
			title: z.string(),
			ownerIds: z.array(z.string())
		})
		.optional()
})

type RequestType = z.infer<typeof requestSchema>
type ResponseType = z.infer<typeof responseSchema>

export const workflow = async (req: Request, res: Response<ResponseType>, next: NextFunction) => {
	try {
		const { params, body, user: authUser } = req as typeof req & RequestType & { user: User }

		const { userId } = body
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

		const user = await prisma.user.findUnique({ where: { id: userId } })
		if (!user) {
			return res.status(404).json({
				message: "User not found"
			})
		}

		const newUserListOwnership = await prisma.userTodoList.findUnique({
			where: {
				userId_todoListId: {
					userId,
					todoListId
				}
			}
		})
		if (newUserListOwnership) {
			return res.status(409).json({
				message: "User already has access to this todo list"
			})
		}

		await prisma.userTodoList.create({
			data: {
				userId,
				todoListId
			}
		})

		const allOwners = await prisma.userTodoList.findMany({ where: { todoListId } })

		return res.json({
			message: "Todo list shared successfully",
			todoList: {
				id: todoList.id,
				title: todoList.title,
				ownerIds: allOwners.map(userTodoList => userTodoList.userId)
			}
		})
	} catch (error) {
		return next(error)
	}
}
