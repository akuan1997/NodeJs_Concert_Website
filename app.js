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
        const data = await concertModel.find()
        res.status(200).json({data, nbHits: data.length})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get("/api/more-data", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 預設第一頁
        const limit = parseInt(req.query.limit) || 21; // 每頁 21 筆
        const skip = (page - 1) * limit;

        const data = await concertModel.find()
            .sort({"tim": -1}) // 依 tim 降序排列
            .skip(skip) // 跳過前面幾筆
            .limit(limit); // 取出指定數量的資料

        const total = await concertModel.countDocuments(); // 總筆數
        const totalPages = Math.ceil(total / limit); // 總頁數

        res.status(200).json({
            data,
            page,
            totalPages,
            nbHits: data.length
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


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