const bcrypt = require("bcrypt")
const { Schema , model } = require("mongoose")

const AuthenModel = new Schema({
    username: {
        type : String,
    },
    status : {
        type : String,
    },
    password: {
        type : String,
    },
    hoten: {
        type : String,
    },
    phone: {
        type : String,
    },
    email: {
        type : String,
    },
    role: {
        type : String,
    },
    boss: {
        type : String,
    }
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