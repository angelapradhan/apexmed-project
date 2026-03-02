const Review = require('../models/reviewModel');

// 1. Post a new review
exports.postReview = async (req, res) => {
  try {
    const { doctorId, userId, userName, comment } = req.body; // <-- doctorId lincha
    
    const newReview = await Review.create({
      doctorId, // <-- seedha doctorId halne
      userId,
      userName,
      comment
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Failed to post review", error: error.message });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure this model matches the table structure
    const reviews = await Review.findAll({
      where: { userId: userId }, // Verify data types match
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(reviews);
  } catch (error) {
    // This is likely where the 500 error is caught
    console.error("Database Error:", error); 
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// 2. Get reviews for a specific doctor
exports.getReviewsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params; // <-- doctorId lincha
    
    const reviews = await Review.findAll({
      where: { doctorId },
      order: [['createdAt', 'DESC']], // Naya review mathi dekhauna
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// 3. Delete a review (Admin View)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const deleted = await Review.destroy({
      where: { id: reviewId }
    });

    if (deleted) {
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};