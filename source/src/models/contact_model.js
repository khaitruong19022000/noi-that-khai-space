const { Schema , model } = require("mongoose")

const ContactModel = new Schema({
    email : {
        type : String,
    }
}, {
    timestamps : true
}) 


module.exports = model('contacts' , ContactModel)