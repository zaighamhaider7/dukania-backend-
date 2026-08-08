const {CloudinaryStorage} = require ("multer-storage-cloudinary");

const multer = require ("multer");

const cloudinary = require ("./cloudinary.js");

const storage = new CloudinaryStorage({

cloudinary, params:{

    folder:"mern-services",
    allowed_formats:
    ["jpg","jpeg","png"]

}

})

const upload = multer({
    storage
})

module.exports= upload