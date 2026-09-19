const Product = require("../models/Products");
const Order = require("../models/Order");

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

    const relatedProducts = await Product.find({
      storeId: store._id,
      _id: { $ne: productId }
    })
      .limit(4);

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    return res.status(200).json({
      msg: "Product fetched successfully",
      product,
      store,
      relatedProducts
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};


const addOrder = async (req, res) => {
  try {
    const {
      storeId,
      customer,
      delivery,
      items,
    } = req.body;

    if (!storeId) {
      return res.status(400).json({
        msg: "Store ID is required",
      });
    }

    if (!customer?.name) {
      return res.status(400).json({
        msg: "Customer name is required",
      });
    }

    if (!customer?.whatsappNumber) {
      return res.status(400).json({
        msg: "WhatsApp number is required",
      });
    }

    if (!delivery?.address) {
      return res.status(400).json({
        msg: "Address is required",
      });
    }

    if (!delivery?.city) {
      return res.status(400).json({
        msg: "City is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        msg: "Order items are required",
      });
    }

    const orderItems = [];

    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          msg: "Product not found",
        });
      }

      if (product.variants?.length > 0) {
        for (const variant of product.variants) {
          if (!item.variants?.[variant.name]) {
            return res.status(400).json({
              msg: `Please select ${variant.name}`,
            });
          }
        }
      }

      const price =
        product.discountPrice || product.productPrice;

      const total = price * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.productName,
        price,
        quantity: item.quantity,
        variants: item.variants || {},
        total,
      });

      totalAmount += total;
    }

    const order = await Order.create({
      storeId,
      customer,
      delivery,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    return res.status(201).json({
      msg: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = { addProduct, getsingleProduct, addOrder };