const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const {createStore, getStore, getMyStore, updateStore} = require("../controllers/storeController")

const {authMiddleware} = require("../middlewares/authMiddleware")
const { subscriptionMiddleware } = require("../middlewares/subscriptionMiddleware")


router.post('/create', authMiddleware,subscriptionMiddleware, upload.single("logo"), createStore )

router.get( "/my-store", authMiddleware, subscriptionMiddleware, getMyStore );

router.get('/:storeUsername', getStore )

router.put( "/update", authMiddleware, subscriptionMiddleware, upload.single("logo"), updateStore );

module.exports = router;