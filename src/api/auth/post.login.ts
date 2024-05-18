import { NextFunction, Request, Response } from "express"
import { prisma } from "./../../lib/prisma"
import { compare } from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"

export const requestSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(6)
	}),
	query: z.object({}).optional(),
	params: z.object({}).optional()
})

export const responseSchema = z.object({
	token: z.string().optional(),
	message: z.string()
})

type RequestType = z.infer<typeof requestSchema>
type ResponseType = z.infer<typeof responseSchema>

export const workflow = async (req: Request, res: Response<ResponseType>, next: NextFunction) => {
	try {
		const { body: requestBody } = req as typeof req & RequestType

		const userWithEmail = await prisma.user.findUnique({ where: { email: requestBody.email.toLowerCase() } })
		const isPasswordValid = userWithEmail && (await compare(requestBody.password, userWithEmail.password))
		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid credentials"
			})
		}

		const token = jwt.sign({ id: userWithEmail.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
		return res.json({ token, message: "Logged in successfully" })
	} catch (error) {
		return next(error)
	}
}
