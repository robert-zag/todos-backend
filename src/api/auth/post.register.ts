import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { hash } from "bcrypt"

export const requestSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(6)
	}),
	query: z.object({}).optional(),
	params: z.object({}).optional()
})

export const responseSchema = z.object({
	message: z.string(),
	user: z
		.object({
			id: z.string(),
			email: z.string()
		})
		.optional()
})

type RequestType = z.infer<typeof requestSchema>
type ResponseType = z.infer<typeof responseSchema>

export const workflow = async (req: Request, res: Response<ResponseType>, next: NextFunction) => {
	try {
		const { body: requestBody } = req as typeof req & RequestType

		const existingUser = await prisma.user.findUnique({ where: { email: requestBody.email } })
		if (existingUser) {
			return res.status(409).json({
				message: "Email already in use"
			})
		}

		const password = await hash(requestBody.password, 12)
		const user = await prisma.user.create({
			data: {
				email: requestBody.email.toLowerCase(),
				password
			}
		})

		return res.status(201).json({
			user: {
				email: user.email,
				id: user.id
			},
			message: "User registered successfully"
		})
	} catch (error) {
		return next(error)
	}
}
