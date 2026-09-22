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

const getProducts = async (req, res) => {
  try {
    const storeId = req.user.id;
    const limit = parseInt(req.query.limit) || 0;

    const products = await Product.find({ storeId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      msg: "Products fetched successfully",
      products,
    });

  } catch (error) {

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const storeId = req.user.id;

    const product = await Product.findOne({
      _id: id,
      storeId: storeId,
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      storeId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    res.status(200).json({
      msg: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      productName,
      productPrice,
      discountPrice,
      description,
      stocks,
      variants,
      existingImages,
    } = req.body;

    const product = await Product.findOne({
      _id: id,
      storeId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }


    if (!productName || !productName.trim()) {
      return res.status(400).json({
        msg: "Product Name is required",
      });
    }

    if (
      productPrice === undefined ||
      productPrice === null ||
      productPrice === ""
    ) {
      return res.status(400).json({
        msg: "Product Price is required",
      });
    }

    let oldImages = [];

    if (existingImages) {
      try {
        oldImages = JSON.parse(existingImages);
      } catch (error) {
        return res.status(400).json({
          msg: "Invalid existing images data",
        });
      }
    }

    if (!Array.isArray(oldImages)) {
      oldImages = [];
    }


    const newImages = req.files
      ? req.files.map((file) => file.path)
      : [];

    const finalImages = [...oldImages, ...newImages];

    if (finalImages.length === 0) {
      return res.status(400).json({
        msg: "Product must have at least one image",
      });
    }

    if (finalImages.length > 5) {
      return res.status(400).json({
        msg: "You can upload maximum 5 images",
      });
    }

    let formattedVariants = [];

    if (variants) {
      try {
        formattedVariants = JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({
          msg: "Invalid variants data",
        });
      }
    }


    product.productName = productName.trim();
    product.productPrice = productPrice;

    product.discountPrice =
      discountPrice !== undefined && discountPrice !== ""
        ? discountPrice
        : undefined;

    product.description =
      description !== undefined
        ? description
        : "";

    product.stocks =
      stocks !== undefined && stocks !== ""
        ? stocks
        : undefined;

    product.productImages = finalImages;

    product.variants = formattedVariants;

    await product.save();

    res.status(200).json({
      msg: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error",
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

const getOrders = async (req, res) => {
  try {
    const storeId = req.user._id;

    const limit = parseInt(req.query.limit) || 0;


    const orders = await Order.find({ storeId })
      .sort({ createdAt: -1 })
      .limit(limit);


    res.status(200).json({
      msg: "Orders fetched successfully",
      orders,
    });
  } catch (error) {

    res.status(500).json({
      msg: "Failed to fetch orders",
    });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const storeId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      storeId,
    });

    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
      });
    }

    res.status(200).json({
      msg: "Order fetched successfully",
      order,
    });
  } catch (error) {

    res.status(500).json({
      msg: "Failed to fetch order",
    });
  }
};



const getDashboardStats = async (req, res) => {
  try {
    const storeId = req.user.id;

    const totalProducts = await Product.countDocuments({
      storeId,
    });

    const totalOrders = await Order.countDocuments({
      storeId,
    });

    const inStockProducts = await Product.countDocuments({
      storeId,
      $or: [
        { stocks: { $gt: 0 } },
        { stocks: null },
      ],
    });

    const outOfStockProducts = await Product.countDocuments({
      storeId,
      stocks: 0,
    });

    return res.status(200).json({
      msg: "Dashboard stats fetched successfully",
      stats: {
        totalProducts,
        totalOrders,
        inStockProducts,
        outOfStockProducts,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = { addProduct, getsingleProduct, getProducts, deleteProduct, singleProduct, updateProduct, addOrder, getOrders, getSingleOrder, getDashboardStats };