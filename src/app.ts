import express from "express"
import passport from "passport"
import { initPassport } from "./lib/auth"
import errorMiddleware from "./middleware/errorMiddleware"
import api from "./api"

const app = express()

initPassport()
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", api())

app.use(errorMiddleware)

export default app
