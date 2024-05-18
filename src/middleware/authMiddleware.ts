import { User } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import passport from "passport"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("jwt", { session: false }, (err: Error, user?: User) => {
		if (err) {
			return next(err)
		}
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" })
		}
		req.user = user
		return next()
	})(req, res, next)
}
