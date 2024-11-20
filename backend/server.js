import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import indexRoutes from './routes/index.routes.js'
import connectToMongoDB from './db/connectToMongoDB.js'

const PORT = process.env.PORT || 5000

const app = express()


app.use(cookieParser())

dotenv.config()
app.use(express.json())

app.listen(PORT, () => {
    connectToMongoDB()
    console.log("Server Running on port", PORT)

})

app.use(indexRoutes)
