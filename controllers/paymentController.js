const Payment = require("../models/Payment");

const createPayment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                msg: "Payment screenshot is required",
            });
        }

        const { plan, amount } = req.body;

        if (!plan || !amount) {
            return res.status(400).json({
                msg: "Plan and amount are required",
            });
        }

        const payment = await Payment.create({
            userId: req.userId,
            plan,
            amount,
            screenshot: req.file.path,
            status: "pending",
        });

        res.status(201).json({
            msg: "Payment submitted successfully",
            payment,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Something went wrong",
        });
    }
};

const getMyPayment = async (req, res) => {
    try {

        const payment = await Payment.findOne({
            userId: req.userId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            payment,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            msg: "Failed to get payment status",
        });
    }
};

module.exports = {
    createPayment, getMyPayment
};