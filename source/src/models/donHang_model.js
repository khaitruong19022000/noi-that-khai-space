const { Schema , model } = require("mongoose")

const donHangModel = new Schema({
    idUserName : {
        type : String,
    },
    diaChi : {
        type : String,
    },
    sdt : {
        type : String,
    },
    sanpham : [
        String,
    ],
    ghiChu : {
        type : String,
    },
    phuongThucThanhToan: {
        type : String,
    },
    NgayDat : {
        type : Date,
    },
    tongTien : {
        type : Number,
    },
    status: {
        type : String,
    },
}, {
    timestamps : true
}) 


module.exports = model('donHangs' , donHangModel)