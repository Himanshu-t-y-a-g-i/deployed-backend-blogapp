const { userModel } = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const userRoutes = express.Router();

userRoutes.post("/register", async (req, res) => {
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

userRoutes.post("/login", async (req, res) => {
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

module.exports = { userRoutes };