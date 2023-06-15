const { blogModel } = require("../model/blogModel");

const blogRoutes = require("express").Router();

blogRoutes.get("/", async (req, res) => {
    try {
        const blogs = await blogModel.find();
        res.send({ msg: "success", data: blogs });
    } catch (e) {
        res.send({ msg: e.message });
    }
})

blogRoutes.post("/", async (req, res) => {
    const { username, title, content, category, date, uid } = req.body;
    if (!username || !title || !content || !category || !date) {
        res.status(400).send({ msg: "invalid data format" });
    } else {
        try {
            const obj = { ...req.body, likes: 0, comments: [], uid };
            const newBlog = new blogModel(obj);
            await newBlog.save();
            res.status(200).send({ msg: "blog created", data: obj });
        } catch (e) {
            res.send({ msg: e.message });
        }
    }
})

blogRoutes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await blogModel.findByIdAndDelete(id);
        res.status(200).send({ msg: "blog deleted" });
    } catch (e) {
        res.send({ msg: e.message });
    }
})

module.exports = { blogRoutes };