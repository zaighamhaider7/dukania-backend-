const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const {addProduct} = require("../controllers/productController")

const {authMiddleware} = require("../middlewares/authMiddleware")

router.post('/add', authMiddleware, upload.array("productImages", 5), addProduct )




module.exports = router;