require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const ConcertRouter = require('./routes/concert')
const connectDB = require('./db/connect')
// const concertModel = require('./models/concert')

const cors = require("cors");
const port = 3000;

// middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api", ConcertRouter)

const start = async () => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()