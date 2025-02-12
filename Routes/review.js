const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js").default;
const ExpressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const Review = require("../models/review");

const reviewController = require("../controller/review.js")

const { validateReview, islogged_in, isReviewAuthor } = require("../MW.js");

// (POST) REVIEWS ROUTE
router.post(
  "/",
  islogged_in,
  validateReview,
  wrapAsync(reviewController.reviewRoute)
);

// (DELETE) REVIEWS ROUTE
router.delete(
  "/:revid",
  islogged_in,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
