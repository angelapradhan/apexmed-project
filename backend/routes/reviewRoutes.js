const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');


router.post('/', reviewController.postReview);

router.get('/all', reviewController.getAllReviews);

router.get('/:doctorId', reviewController.getReviewsByDoctor);

router.delete('/:reviewId', reviewController.deleteReview);

router.get('/user/:userId', reviewController.getReviewsByUser);

module.exports = router;