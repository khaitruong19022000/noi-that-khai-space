const { Schema , model } = require("mongoose")

const MenuModel = new Schema({
    parent: {
        type : String,
    },
    name: {
        type : String,
    },
    status : {
        type : String,
    },
    link:{
        type : String,
    },
    child:[{
        name_child: {
            type : String,
        },
        link_child:{
            type : String,
        },
    }],
}, {
    timestamps : true
}) 


module.exports = model('menu' , MenuModel)