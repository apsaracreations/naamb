import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // logo image path
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
