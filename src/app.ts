import express, { Application, Request, Response } from 'express'
import cors from 'cors';
import { booksRoutes } from './app/controllers/book.controller'
import { borrowRoutes } from './app/controllers/borrow.controller'
const app: Application = express()

app.use(cors())
app.use(express.json())
app.use('/api/books', booksRoutes)
app.use('/api/borrow', borrowRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to our library")
})

export default app

