const { Schema , model } = require("mongoose")

const CategoryProductModel = new Schema({
    name : {
        type : String,
    },
    status : {
        type : String,
    },
    ordering : {
        type : Number,
    },
    content : {
        type : String,
    },
    created: {
        user_id: Number,
        user_name: String,
        time: Date,
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date,
    }
}, {
    timestamps : true
}) 


module.exports = model('categoryproducts' , CategoryProductModel)