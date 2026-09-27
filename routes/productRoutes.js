const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const { addProduct, getsingleProduct, getProducts, deleteProduct, singleProduct, updateProduct, addOrder, getOrders, getSingleOrder, getDashboardStats } = require("../controllers/productController")

const { authMiddleware } = require("../middlewares/authMiddleware")
const { subscriptionMiddleware } = require("../middlewares/subscriptionMiddleware")


router.post('/add', authMiddleware, subscriptionMiddleware, upload.array("productImages", 5), addProduct)

router.get('/show', authMiddleware, subscriptionMiddleware, getProducts)

router.delete("/delete/:id", authMiddleware, subscriptionMiddleware, deleteProduct);

router.get("/store/:storeUsername/product/:productId", getsingleProduct);

router.get("/edit/:id", authMiddleware, subscriptionMiddleware, singleProduct);

router.put( "/update/:id", authMiddleware, subscriptionMiddleware, upload.array("productImages", 5), updateProduct);

router.post("/orders", addOrder);

router.get("/orders", authMiddleware, subscriptionMiddleware, getOrders);

router.get("/orders/:orderId", authMiddleware, subscriptionMiddleware, getSingleOrder);

router.get("/dashboard-stats", authMiddleware, subscriptionMiddleware, getDashboardStats);

module.exports = router;