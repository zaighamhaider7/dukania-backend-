const express = require("express");
const router = express.Router();
const upload = require("../fileuploads/multer")

const {createStore, getStore} = require("../controllers/storeController")

const {authMiddleware} = require("../middlewares/authMiddleware")

router.post('/create', authMiddleware, upload.single("logo"), createStore )

router.get('/:storeUsername', getStore )


module.exports = router;