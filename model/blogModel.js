const mongoose = require("mongoose");

const schema = mongoose.Schema({
    uid: String,
    username: String,
    title: String,
    content: String,
    category: String,
    date: String,
    likes: Number,
    comments: Array
})

const blogModel = mongoose.model("blog", schema);

module.exports = { blogModel };