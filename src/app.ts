import express from "express"
import passport from "passport"
import { initPassport } from "./lib/auth"
import errorMiddleware from "./middleware/errorMiddleware"
import api from "./api"
import apiDocs from "./api-docs"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"

extendZodWithOpenApi(z)

const app = express()

initPassport()
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", api())
app.use("/api-docs", apiDocs())

app.use(errorMiddleware)

export default app
