import http from "node:http"
import app from "./app"

const PORT = 8000

const httpServer = http.createServer(app)

httpServer.listen(PORT).on("listening", () => {
	console.log(`[${new Date().toISOString()}] REST server started in ${process.env.NODE_ENV} mode at port ${PORT}`)
})

export default httpServer
