const Review = require('../models/reviewModel');
const Doctor = require('../models/services');
const User = require('../models/user');

// post a review
exports.postReview = async (req, res) => {
  try {
    const { doctorId, userId, userName, comment } = req.body; 
    
    const newReview = await Review.create({
      doctorId, 
      userId,
      userName,
      comment
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Failed to post review", error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username', 'email'] 
                },
                {
                    model: Doctor,
                    attributes: ['doctorName']
                }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reviews = await Review.findAll({
      where: { userId: userId },
      include: [{
        model: Doctor,
        attributes: ['doctorName', 'specialization', 'doctorImage']
      }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Database Error:", error); 
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

exports.getReviewsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params; 
    
    const reviews = await Review.findAll({
      where: { doctorId },
      order: [['createdAt', 'DESC']], 
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// delete review
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