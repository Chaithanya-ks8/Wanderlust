const express = require("express");
const app =  express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");




const mongo_url = "mongodb://localhost:27017/wanderlust";

main().then(() => {
console.log("DB is connected");
}) .catch(err => "err");

async function main(){
    await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", (req,res) => {
res.send("I am route");
});

const validateListing= (req, res, next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else{
        next();
    }
};

app.get("/", (req,res) => {
    res.send("I am route");
    });
    
    const validateReview = (req, res, next)=> {
        let {error} = reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg)
        } else{
            next();
        }
    };

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
const all_listings = await Listing.find({});
res.render("./listings/index.ejs", {all_listings});
}));

//New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res) => {
let {id} = req.params;
const listing = await Listing.findById(id).populate("reviews");
res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings",
     validateListing,
      wrapAsync(async(req,res,next) => {
// let{title, description, image, price, country, location} = req.body;
    let listing = req.body.listing;
    const new_listing = new Listing(listing);
    await new_listing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit.ejs", { listing });
 }));

//  Update Route
app.put("/listings/:id",
    validateListing,
     wrapAsync(async (req,res) => {
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
//    res.redirect("/listings");
res.redirect(`/listings/${id}`);
}));


//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res) => {
    const id = req.params.id.trim();
    // let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
}));

//Reviews:-
//Post review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) => {
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);

listing.reviews.push(newReview);

await newReview.save();
await listing.save();

res.redirect(`/listings/${listing._id}`);
}));
//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=> {
let{id, reviewId} = req.params;

await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
await Review.findByIdAndDelete(reviewId);

res.redirect(`/listings/${id}`);
}));


// app.get("/testListing", async (req,res) => {
// let sampleListing = new Listing({
//     tittle:"My New Villa",
//     description: "By The Beach",
//     price:1200,
// location:"Wayanad",
// country:"India",
// });

// await sampleListing.save();
// console.log("sample was saved");
// res.send("successfull");
// });

app.all("*", (req,res,next) => {
next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let{statusCode=500, message = "something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
    // res.send("somethng went wrong!");
});


app.listen(8080, () => {
console.log("server is listening");
});