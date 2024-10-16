const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
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
};

module.exports.destroyReview = async (req, res) => {
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
};