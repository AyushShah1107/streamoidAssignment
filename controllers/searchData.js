import { Product } from "../models/product.model.js";

 const searchProduct = async (req, res) => {
  try {
    const { brand, color, minPrice, maxPrice, category } = req.query;

    const filter = {};

    if (brand) filter.Brand = brand;
    if (color) filter.Color = color;
    if (category) filter.Category = category;
    if (minPrice || maxPrice) {
      filter.Price = {};
      if (minPrice) filter.Price.$gte = Number(minPrice);
      if (maxPrice) filter.Price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export {searchProduct}