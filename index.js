const express = require("express");
const { connection } = require("./mongoose/connection");
const { blogRoutes } = require("./routes/blogRoutes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authentication } = require("./middleware/authentication");
const cors = require("cors");
const { userModel } = require("./model/userModel");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is up and running");
})

app.post("/api/register", async (req, res) => {
    const { username, avatar, email, password } = req.body;
    if (!username, !avatar, !email, !password) {
        res.status(400).send({ msg: "invalid data format" });
    } else {
        try {
            const emailCheck = await userModel.findOne({ email });
            const userCheck = await userModel.findOne({ username });
            if (emailCheck || userCheck) {
                res.status(400).send({ msg: "user already present" });
            } else {
                const newUser = new userModel({ username, avatar, email, password: bcrypt.hashSync(password, 4) });
                await newUser.save();
                res.status(200).send({ msg: "new user created", data: { username, avatar, email } });
            }
        } catch (e) {
            res.send({ msg: e.message });
        }
    }
})

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email, !password) {
        res.status(400).send({ msg: "invalid data format" });
    } else {
        try {
            const emailCheck = await userModel.findOne({ email });
            if (!emailCheck) {
                res.status(400).send({ msg: "user not found" });
            } else {
                const verify = bcrypt.compareSync(password, emailCheck.password);
                if (!verify) {
                    res.status(400).send({ msg: "incorrect password" });
                } else {
                    res.status(200).send({ msg: "user logged in", token: jwt.sign({ uid: emailCheck._id }, "blogapp") });
                }
            }
        } catch (e) {
            res.send({ msg: e.message });
        }
    }
})

app.use(authentication);

app.use("/api/blogs", blogRoutes);

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log(`Database connection established`);
    } catch (e) {
        console.log(e.message);
    }
    console.log("Server is live at port", process.env.PORT);
})