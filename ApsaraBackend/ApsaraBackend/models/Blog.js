import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // banner or thumbnail image
    heading: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
      createdAt: {
    type: Date,
    default: Date.now,
  },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
