const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    storeName: {
      type: String,
      default: "",
      trim: true,
    },

    storeUsername: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: "",
    },

    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    plan: {
      type: String,
      enum: ["free", "basic"],
      default: "free",
    },

    subscriptionStatus: {
      type: String,
      enum: ["trial", "active", "expired"],
      default: "trial",
    },

    trialEndsAt: {
      type: Date,
      default: null,
    },

    subscriptionEndsAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generatetoken = function () {
  return jwt.sign(
    {
      userid: this._id,
      email: this.email,
    },process.env.JWT_SECRET,
    
    {
      expiresIn: "1d",
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;