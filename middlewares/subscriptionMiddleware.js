const User = require("../models/Users");

const subscriptionMiddleware = async (req, res, next) => {
    try {
        const userData = req.user;

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

        next();

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Subscription check failed",
        });
    }
};

module.exports = { subscriptionMiddleware };