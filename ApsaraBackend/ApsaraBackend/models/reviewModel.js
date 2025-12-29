import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // ✅ auto-assigns current date when review is created
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
