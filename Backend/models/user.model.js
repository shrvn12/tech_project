const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    wishlist: {type:Array, default:[]}
})

const userModel = mongoose.model("users",userSchema);

module.exports = {
    userModel
}