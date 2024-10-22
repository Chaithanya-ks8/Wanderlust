const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});




// "/" Route:-
router.route("/")
//Index Route
.get( wrapAsync(listingController.index))
 //Create Route
.post( 
   isloggedIn, 
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.createListing));


 //New Route
 router.get("/new", isloggedIn, listingController.renderNewForm);


// "/:id" Route:-
     router.route("/:id")
 //Show Route
    .get(wrapAsync(listingController.showListing))
//  Update Route
    .put(isloggedIn, 
         isOwner,
         upload.single("listing[image]"),
   validateListing, 
    wrapAsync(listingController.updateListing))
 //Delete Route
    .delete( isloggedIn, 
            isOwner,
   wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", 
    isloggedIn, 
    isOwner,
     wrapAsync(listingController.renderEditForm));


module.exports = router;