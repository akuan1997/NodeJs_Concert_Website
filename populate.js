require('dotenv').config();

const connectDB = require('./db/connect');
const Concert = require('./models/concert');

const jsonProducts = require('./concert_3_5_23.json');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Concert.deleteMany()  // 刪除Product集合中的所有資料
        await Concert.create(jsonProducts)  // 插入新的資料 (jsonProducts)
        console.log("DB Connected");
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()