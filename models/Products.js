const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    productImages: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    stocks: {
      type: Number,
      default: null,
      min: 0,
    },

    variants: [
      {
        name: {
          type: String,
          trim: true,
        },

        options: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;