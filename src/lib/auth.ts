import passport from "passport"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { prisma } from "./prisma"

export const initPassport = () => {
	const options = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET as string
	}

	passport.use(
		new JwtStrategy(options, async (jwt_payload, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } })
				if (user) {
					return done(null, { id: user.id, email: user.email })
				} else {
					return done(null, false)
				}
			} catch (err) {
				return done(err, false)
			}
		})
	)
}
