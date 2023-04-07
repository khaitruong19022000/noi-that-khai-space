const bcrypt = require("bcrypt")
const { Schema , model } = require("mongoose")

const AuthenModel = new Schema({
    usename: {
        type : String,
    },
    password: {
        type : String,
    },
}, {
    timestamps : true
}) 

AuthenModel.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next
    }
    let hash = await bcrypt.genSalt(10).then((salt => bcrypt.hash(this.password, salt)))
    this.password = hash
    next();
})


module.exports = model('authen' , AuthenModel)