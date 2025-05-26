import dotenv from "dotenv"
dotenv.config()
import { clerkMiddleware } from '@clerk/express';
import express from "express"
import cors from 'cors'
import connectDB from "./src/config/db.js"
import taskRouter from "./src/routers/taskRouter.js"

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())

connectDB()

app.use('/api/task', taskRouter)

app.get('/', (req, res) => {
    res.send("Welcome to the TaskMaster.")
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
})

export default app
