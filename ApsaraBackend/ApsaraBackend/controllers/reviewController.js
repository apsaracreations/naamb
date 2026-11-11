import Review from "../models/reviewModel.js";

const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const format = (r, includeContact) => ({
  _id: r._id,
  userId: r.userId,
  name: r.name,
  companyName: r.companyName,
  ...(includeContact && { phone: r.phone, email: r.email }),
  review: r.review,
  date: new Date(r.date || r.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
});

// 🟢 Add Review (logged-in customers; user id comes from the token)
export const addReview = async (req, res) => {
  try {
    const review = text(req.body.review, 2000);
    const name = text(req.body.name, 100);
    if (!review || !name) return res.status(400).json({ message: "Name and review are required" });

    const newReview = await Review.create({
      userId: req.user.id,
      name,
      companyName: text(req.body.companyName, 150),
      phone: text(req.body.phone, 20),
      email: text(req.body.email, 254),
      review,
    });
    res.status(201).json({ message: "Review added successfully", newReview: format(newReview, false) });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ message: "Please fill in all fields" });
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🟡 Public list: no phone numbers or emails
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews.map((r) => format(r, false)));
  } catch (error) {
    console.error("Fetch Review Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔒 Admin list: includes contact details
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews.map((r) => format(r, true)));
  } catch (error) {
    console.error("Fetch Review Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔴 Delete Review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
