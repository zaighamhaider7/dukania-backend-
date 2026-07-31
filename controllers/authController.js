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
            return res.status(409).json({ msg: "Email Already Exist" });
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


module.exports = { register }