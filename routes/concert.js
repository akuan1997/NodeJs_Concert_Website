const express = require("express");
const router = express.Router();

const {
    getAllData,
    getMoreData,
} = require("../controller/concert")

router.route("/data").get(getAllData);
router.route("/more-data").get(getMoreData);

module.exports = router;