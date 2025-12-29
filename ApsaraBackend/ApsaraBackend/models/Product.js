import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }, // 🆕 added
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
     categoryName: { type: String, required: true },
    points: { type: [String], default: [] },
    materialsCare: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    images: { type: [String], required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
