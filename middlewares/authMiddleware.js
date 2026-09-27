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

        if (!userData) {
            return res.status(401).json({
                msg: "User not found",
            });
        }

        // Trial expired
        if (
            userData.subscriptionStatus === "trial" &&
            userData.trialEndsAt &&
            new Date() >= userData.trialEndsAt
        ) {
            userData.subscriptionStatus = "expired";
            await userData.save();

            return res.status(403).json({
                msg: "Your free trial has expired",
                trialExpired: true,
            });
        }

        // Subscription expired
        if (
            userData.subscriptionStatus === "active" &&
            userData.subscriptionEndsAt &&
            new Date() >= userData.subscriptionEndsAt
        ) {
            userData.subscriptionStatus = "expired";
            await userData.save();

            return res.status(403).json({
                msg: "Your subscription has expired",
                subscriptionExpired: true,
            });
        }

        // Already expired
        if (userData.subscriptionStatus === "expired") {
            return res.status(403).json({
                msg: "Your trial or subscription has expired",
                trialExpired: true,
                subscriptionExpired: true,
            });
        }

        req.user = userData;
        req.token = token;
        req.userId = userData._id;

        next();

    } catch (error) {
        console.log(error);
    }

}


module.exports = { authMiddleware }