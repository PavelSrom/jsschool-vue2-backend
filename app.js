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

const createSchema = Joi.object({
  title: Joi.string().required(),
  details: Joi.string().required(),
  completed: Joi.boolean().required(),
})

const updateSchema = Joi.object({
  completed: Joi.boolean().required(),
})

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH")
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Content-Type, Authorization, X-Requested-With"
  )

  try {
    if (req.method === "POST") {
      const { error } = createSchema.validate(req.body)
      if (error)
        return res.status(400).send({ message: "Invalid request", error })
    }

    if (req.method === "PATCH") {
      const { error } = updateSchema.validate(req.body)
      if (error)
        return res.status(400).send({ message: "Invalid request", error })
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
