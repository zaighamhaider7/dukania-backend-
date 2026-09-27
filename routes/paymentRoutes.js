const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const {createPayment, getMyPayment} = require("../controllers/paymentController")

const {authMiddleware} = require("../middlewares/authMiddleware")

router.post('/create', authMiddleware, upload.single("screenshot"), createPayment )

router.get( "/my-payment", authMiddleware, getMyPayment );

module.exports = router;
