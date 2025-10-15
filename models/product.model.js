import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  Index: {
    type: Number,
    required: true,
  },
  Name: {
    type: String,
    default: "",
  },
  Description: {
    type: String,
    default: "",
  },
  Brand: {
    type: String,
    default: "",
  },
  Category: {
    type: String,
    default: "",
  },
  Price: {
    type: Number,
    required: true,
  },
  Currency: {
    type: String,
    default: "USD",
  },
  Stock: {
    type: Number,
    default: 0,
  },
  EAN: {
    type: String,
    default: "",
  },
  Color: {
    type: String,
    default: "",
  },
  Size: {
    type: String,
    default: "",
  },
  Availability: {
    type: String,
    enum: ["in_stock", "out_of_stock", "pre_order", "discontinued"],
    default: "in_stock",
  },
  InternalID: {
    type: String,
    alias: "Internal ID", // allow reading/writing as 'Internal ID' too
  },
}, { timestamps: true });

// Optional index for faster queries
productSchema.index({ Brand: 1, Category: 1 });

const Product = mongoose.model("Product", productSchema);

export { Product };
