// const express = require("express");
// const router = express.Router({mergeParams:true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
// const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware.js");


// //Reviews:-
// //Post review route
// router.post("/",
//     isloggedIn,
//      validateReview, wrapAsync(async(req,res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;
//     listing.reviews.push(newReview);
    
//     await newReview.save();
//     await listing.save();

//      req.flash("success", "New review created!");
//     res.redirect(`/listings/${listing._id}`);
//     }));
//     //delete review route
//     router.delete("/:reviewId",
//         isloggedIn,
//         isReviewAuthor,
//          wrapAsync(async(req,res)=> {
//     let{id, reviewId} = req.params;
//     id = id.trim();
//     reviewId = reviewId.trim();
    
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);

//      req.flash("success", "review deleted");
//     res.redirect(`/listings/${id}`);
//     }));

//     module.exports = router;


//bvc
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js");
const mongoose = require("mongoose");


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
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const trimmedId = id.trim();

      
        const listing = await Listing.findById(trimmedId);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

     
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New review created!");
        res.redirect(`/listings/${listing._id}`);
    })
);


router.delete(
    "/:reviewId",
    isloggedIn,
    isReviewAuthor,
    validateObjectId,
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        const trimmedId = id.trim();
        const trimmedReviewId = reviewId.trim();


        const listing = await Listing.findById(trimmedId);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

  
        const review = await Review.findById(trimmedReviewId);
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${trimmedId}`);
        }

  
        await Listing.findByIdAndUpdate(trimmedId, { $pull: { reviews: trimmedReviewId } });
        await Review.findByIdAndDelete(trimmedReviewId);

        req.flash("success", "Review deleted");
        res.redirect(`/listings/${trimmedId}`);
    })
);

module.exports = router;