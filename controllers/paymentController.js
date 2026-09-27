const Payment = require("../models/Payment");

const User = require("../models/Users");

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

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("userId", "storeName whatsappNumber")
            .sort({ createdAt: -1 });

        res.status(200).json({
            payments,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Failed to get payments",
        });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({
                msg: "Invalid payment status",
            });
        }

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({
                msg: "Payment not found",
            });
        }

        payment.status = status;
        await payment.save();

        if (status === "approved") {
            await User.findByIdAndUpdate(payment.userId, {
                plan: "basic",
                subscriptionStatus: "active",
                subscriptionEndsAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
            });
        }

        if (status === "rejected") {
            await User.findByIdAndUpdate(payment.userId, {
                plan: "free",
                subscriptionStatus: "expired",
                subscriptionEndsAt: null,
            });
        }

        res.status(200).json({
            msg: `Payment ${status} successfully`,
            payment,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Failed to update payment status",
        });
    }
};

module.exports = {
    createPayment, getMyPayment, getAllPayments, updatePaymentStatus
};