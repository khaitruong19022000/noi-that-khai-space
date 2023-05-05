const { Schema , model } = require("mongoose")

const maGiamGiaModel = new Schema({
    name : {
        type : String,
    },
    status : {
        type : String,
    },
    gioi_han_tien_giam : {
        type : Number,
    },
    loai : {
        type : String,
    },
    rate: {
        type : Number,
    },
    soLuong : {
        type : Number,
    },
    ngaybatdau: {
        type : Date,
    },
    ngayketthuc: {
        type : Date,
    },

}, {
    timestamps : true
}) 


module.exports = model('maGiaGiams' , maGiamGiaModel)