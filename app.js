require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const concertModel = require('./models/concert')

const cors = require("cors");
const port = 3000;

// middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// 路由 - 示範資料 API
app.get("/api/data", async (req, res) => {
    try {
        const data = await concertModel.find().limit(6);
        // res.status(200).json(data);
        res.status(200).json({ data, nbHits: data.length })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

const start = async (req, res) => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        const start = async (req, res) => {
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
        console.log(error)
    }
}

start()