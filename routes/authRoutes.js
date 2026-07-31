const {register} = require("../controllers/authController")
const express = require("express");

const router = express.Router();

const registerValidation = require("../middlewares/authValidation");

router.post('/register', registerValidation, register )

module.exports = router;