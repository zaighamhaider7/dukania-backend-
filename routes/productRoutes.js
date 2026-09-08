const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const {addProduct, getsingleProduct, addOrder} = require("../controllers/productController")

const {authMiddleware} = require("../middlewares/authMiddleware")

router.post('/add', authMiddleware, upload.array("productImages", 5), addProduct )

router.get("/store/:storeUsername/product/:productId", getsingleProduct);

router.post("/orders", addOrder);



module.exports = router;