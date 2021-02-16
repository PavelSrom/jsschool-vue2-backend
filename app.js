const jsonServer = require("json-server")
const cors = require("cors")
const server = jsonServer.create()
const router = jsonServer.router("data/db.json")
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(cors())
server.use(router)

server.listen(process.env.PORT || 5000, () => {
  console.log("JSON Server is running")
})
