const mongoose = require("mongoose");

const concertSchema = new mongoose.Schema({
    tit: {
        type: String,
        required: true
    },
    sdt: {
        type: [String],  // 陣列（Array）類型
        default: []
    },
    prc: {
        type: [Number],  // 陣列（Array）類型
        default: []
    },
    pdt: {
        type: [String],  // 陣列（Array）類型
        default: []
    },
    loc: {
        type: [String],  // 陣列（Array）類型
        default: []
    },
    cit: {
        type: String
    },
    int: {
        type: String
    },
    web: {
        type: String
    },
    url: {
        type: String
    },
    pin: {
        type: String
    },
    tim: {
        type: Date,
    }
});

module.exports = mongoose.model('Concert', concertSchema, 'data');
