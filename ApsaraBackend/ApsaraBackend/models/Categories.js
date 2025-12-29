import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bannerImage: { type: String, required: true },
    headingImage: { type: String, required: true },
    bannerHeading: { type: String, required: true },
    filters: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
