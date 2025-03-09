const concertModel = require("../models/concert");
const asyncWrapper = require("../middleware/async");

const getAllData = asyncWrapper(async (req, res) => {
    const data = await concertModel.find()
    res.status(200).json({data, nbHits: data.length})
});

const getMoreData = asyncWrapper(async (req, res) => {
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
});

module.exports = {
    getAllData,
    getMoreData,
}