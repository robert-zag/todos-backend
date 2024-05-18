import { Request, NextFunction, Response } from "express"

export default function errorMiddleware(err: Error, req: Request, res: Response, _next: NextFunction) {
	if (process.env.NODE_ENV === "development") {
		console.error(err)
	}

	// TODO: handle production errors

	return res.status(500).json({
		error: "Internal server error",
		details: {
			path: `[${req.method}] ${req.originalUrl}`,
			message: err.message
		}
	})
}
