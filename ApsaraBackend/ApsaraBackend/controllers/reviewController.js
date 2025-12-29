import Review from "../models/reviewModel.js";

// 🟢 Add Review
export const addReview = async (req, res) => {
  try {
    const { userId, name, companyName, phone, email, review } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Login required" });
    }

    const newReview = new Review({
      userId,
      name,
      companyName,
      phone,
      email,
      review,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully", newReview });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🟡 Fetch All Reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    const formattedReviews = reviews.map((r) => ({
      _id: r._id,
      userId: r.userId,
      name: r.name,
      companyName: r.companyName,
      phone: r.phone,
      email: r.email,
      review: r.review,
      date: new Date(r.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error("Fetch Review Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔴 Delete Review
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
