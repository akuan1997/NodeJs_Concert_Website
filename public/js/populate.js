require('dotenv').config();

const connectDB = require('../../db/connect');
const Concert = require('../../models/concert');

const jsonConcertData = require('../../concertData/concert_zh.json');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Concert.deleteMany()  // 刪除Product集合中的所有資料
        await Concert.create(jsonConcertData)  // 插入新的資料 (jsonProducts)
        console.log("DB Connected");
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()