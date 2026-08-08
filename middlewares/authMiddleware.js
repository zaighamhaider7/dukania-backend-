const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const authMiddleware = async (req, res, next) => {

    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({
            msg: "unathorized User"
        })
    }

    try {
        const jwtToken = token.replace("Bearer", "").trim();
        const isverified = jwt.verify(jwtToken, process.env.JWT_SECRET,);

        const userData = await User.findById(isverified.userid).select({
            password: 0
        });

        req.user = userData;
        req.token = token;
        req.userId = userData._id;

        next();

    } catch (error) {
        console.log(error);
    }

}


module.exports = { authMiddleware }