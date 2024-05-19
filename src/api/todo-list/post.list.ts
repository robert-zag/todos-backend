import { NextFunction, Request, Response } from "express"
import { prisma } from "./../../lib/prisma"
import { z } from "zod"
import { User } from "@prisma/client"

export const requestSchema = z.object({
	body: z.object({
		title: z.string().min(1),
		ownerIds: z.array(z.string()).optional()
	}),
	query: z.object({}).optional(),
	params: z.object({}).optional()
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
		const { body, user: authUser } = req as typeof req & RequestType & { user: User }

		const { title, ownerIds } = body

		if (!authUser) {
			return res.status(401).json({
				message: "You need to be logged in"
			})
		}

		let finalOwnerIds: string[] = []
		if (ownerIds) {
			const owners = await prisma.user.findMany({
				where: {
					id: { in: ownerIds }
				}
			})

			if (owners.length !== ownerIds.length) {
				return res.status(404).json({
					message: "User not found"
				})
			}

			// the creator should be an owner, no matter what is passed in the ownerIds array
			finalOwnerIds = ownerIds.includes(authUser.id) ? ownerIds : [...ownerIds, authUser.id]
		} else {
			finalOwnerIds = [authUser.id]
		}

		const todoList = await prisma.todoList.create({
			data: {
				title,
				owners: {
					create: finalOwnerIds.map((ownerId: string) => ({
						user: {
							connect: { id: ownerId }
						}
					}))
				}
			}
		})

		return res.json({
			message: "Todo list created successfully",
			todoList: {
				id: todoList.id,
				title: todoList.title,
				ownerIds: finalOwnerIds
			}
		})
	} catch (error) {
		return next(error)
	}
}
