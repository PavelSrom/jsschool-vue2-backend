const jsonServer = require("json-server")
const rateLimit = require("express-rate-limit")
const cors = require("cors")
const Joi = require("joi")
const server = jsonServer.create()
const router = jsonServer.router("data/db.json")
const middlewares = jsonServer.defaults()

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
})

const validationSchema = Joi.object({
  title: Joi.string().required(),
  details: Joi.string().required(),
  completed: Joi.boolean().required(),
})

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  try {
    if (["POST", "PATCH"].includes(req.method)) {
      const { error } = validationSchema.validate(req.body)
      if (error) return res.status(400).send({ message: "Invalid request" })
    }

    next()
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
})

server.use(middlewares)
server.use(cors())
server.use(limiter)
server.use(router)

server.listen(process.env.PORT || 5000, () => {
  console.log("JSON Server is running")
})
