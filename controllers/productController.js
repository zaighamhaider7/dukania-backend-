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

const getsingleProduct = async (req, res) => {
  const { storeUsername, productId } = req.params;

  try {
    const store = await User.findOne({ storeUsername });

    if (!store) {
      return res.status(404).json({
        msg: "Store not found",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      storeId: store._id,
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    return res.status(200).json({
      msg: "Product fetched successfully",
      product,
      store
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};



module.exports = { addProduct, getsingleProduct };