import { Request, Response, NextFunction } from "express"
import { ZodError, ZodSchema } from "zod"

export default (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
	try {
		schema.parse({
			body: req.body,
			query: req.query,
			params: req.params
		})
		next()
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({
				error: "Request validation failed",
				details: error.issues.map(issue => ({
					path: issue.path.join("."),
					message: issue.message
				}))
			})
		}
		next(error)
	}
}
