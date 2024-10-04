const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isloggedIn} = require("../middleware.js");

const validateListing= (req, res, next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else{
        next();
    }
};



//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const all_listings = await Listing.find({});
    res.render("./listings/index.ejs", {all_listings});
    }));
    
    //New Route
    router.get("/new", isloggedIn, (req,res) => {
        res.render("listings/new.ejs");
    });
    
    //Show Route
    router.get("/:id",wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "listing you requested does not existed");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
    }));

    //Create Route
router.post("/",
    isloggedIn, 
    validateListing,
     wrapAsync(async(req,res,next) => {
// let{title, description, image, price, country, location} = req.body;
   let listing = req.body.listing;
   const new_listing = new Listing(listing);
   await new_listing.save();
   req.flash("success", "New Listing Created!");
   res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isloggedIn,  wrapAsync(async (req, res) => {
   let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing you requested does not existed");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//  Update Route
router.put("/:id",
    isloggedIn, 
   validateListing, 
    wrapAsync(async (req,res) => {
   let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
//    res.redirect("/listings");
req.flash("success", " Listing updated!");
res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id", isloggedIn, wrapAsync(async(req,res) => {
   const id = req.params.id.trim();
   // let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted");
res.redirect("/listings");
}));

module.exports = router;