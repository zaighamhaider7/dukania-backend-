const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const {createStore, getStore, getMyStore, updateStore} = require("../controllers/storeController")

const {authMiddleware} = require("../middlewares/authMiddleware")

router.post('/create', authMiddleware, upload.single("logo"), createStore )

router.get( "/my-store", authMiddleware, getMyStore );

router.get('/:storeUsername', getStore )

router.put( "/update", authMiddleware, upload.single("logo"), updateStore );

module.exports = router;