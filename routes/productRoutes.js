const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const { addProduct, getsingleProduct, getProducts, deleteProduct, singleProduct, updateProduct, addOrder, getOrders, getSingleOrder, getDashboardStats } = require("../controllers/productController")

const { authMiddleware } = require("../middlewares/authMiddleware")

router.post('/add', authMiddleware, upload.array("productImages", 5), addProduct)

router.get('/show', authMiddleware, getProducts)

router.delete("/delete/:id", authMiddleware, deleteProduct);

router.get("/store/:storeUsername/product/:productId", getsingleProduct);

router.get("/edit/:id", authMiddleware, singleProduct);

router.put( "/update/:id", authMiddleware, upload.array("productImages", 5), updateProduct);

router.post("/orders", addOrder);

router.get("/orders", authMiddleware, getOrders);

router.get("/orders/:orderId", authMiddleware, getSingleOrder);

router.get("/dashboard-stats", authMiddleware, getDashboardStats);

module.exports = router;