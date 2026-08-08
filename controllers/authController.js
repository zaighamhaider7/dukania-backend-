const User = require("../models/Users")

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");




const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const emailExist = await User.findOne({ email });

        if (emailExist) {
            return res.status(409).json({
                field: "email",
                msg: "Email already exists",
            });
        }
        else {
            const hashPass = await bcrypt.hash(password, 10)
            const userData = await User.create({
                name, email, password: hashPass
            });
            res.status(201).json({
                msg: "User Register Succesfully",
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error",
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(409).json({
                field: "email",
                msg: "Email is required"
            });
        }
        if (!password) {
            return res.status(409).json({
                field: "password",
                msg: "Password is required"
            });
        }

        const emailExist = await User.findOne({ email });

        if (!emailExist) {
            return res.status(409).json({
                field: "email",
                msg: "Email Not Exist"
            });
        }

        const ismatch = await bcrypt.compare(password, emailExist.password);

        if (!ismatch) {
            return res.status(409).json({
                field: "password",
                msg: "Invalid Password"
            });
        }

        const token = await emailExist.generatetoken();

        res.status(201).json({
            msg: "Login Succesfully",
            userData: {
                id: emailExist._id,
                name: emailExist.name,
                email: emailExist.email,
                storeName: emailExist.storeName,
                storeUsername: emailExist.storeUsername
            },
            token: token
        })
    } catch (error) {
        console.log(error);
    }
}


module.exports = { register, login }