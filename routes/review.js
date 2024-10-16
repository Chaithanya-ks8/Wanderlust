const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js");
const mongoose = require("mongoose");

const reviewController = require("../controllers/reviews.js");


const validateObjectId = (req, res, next) => {
    const { id, reviewId } = req.params;


    const trimmedId = id ? id.trim() : null;
    const trimmedReviewId = reviewId ? reviewId.trim() : null;

   
    if (!mongoose.Types.ObjectId.isValid(trimmedId) || (trimmedReviewId && !mongoose.Types.ObjectId.isValid(trimmedReviewId))) {
        req.flash("error", "Invalid review or listing ID");
        return res.redirect(`/listings/${trimmedId}`);
    }
    next();
};

router.post(
    "/",
    isloggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


router.delete(
    "/:reviewId",
    isloggedIn,
    isReviewAuthor,
    validateObjectId,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;