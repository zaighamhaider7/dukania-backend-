const {register, login, checkSubscription} = require("../controllers/authController")
const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware")
const { subscriptionMiddleware } = require("../middlewares/subscriptionMiddleware")


const router = express.Router();

const registerValidation = require("../middlewares/authValidation");

router.post('/register', registerValidation, register )

router.post('/login', login )

router.get("/me", authMiddleware, subscriptionMiddleware, checkSubscription);


module.exports = router;