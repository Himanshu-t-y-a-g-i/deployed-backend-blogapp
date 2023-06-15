const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: String,
    avatar: String,
    email: String,
    password: String
})

const userModel = mongoose.model("user", schema);

module.exports = { userModel };