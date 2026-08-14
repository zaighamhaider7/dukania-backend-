const Product = require("../models/Products");

const User = require("../models/Users");


const addProduct = async (req, res) => {
  const {
    productName,
    productPrice,
    discountPrice,
    description,
    stocks,
    variants,
  } = req.body;

  try {
    const productImages = req.files?.map((file) => file.path) || [];

    const productData = await Product.create({
      storeId: req.user._id,
      productName,
      productPrice,
      discountPrice,
      description,
      stocks,
      variants: variants ? JSON.parse(variants) : [],
      productImages,
    });

    return res.status(201).json({
      msg: "Product added successfully",
      product: productData,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};


module.exports = { addProduct };