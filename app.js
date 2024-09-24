const express = require("express");
const app =  express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
   
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("*", (req,res,next) => {
next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let{statusCode=500, message = "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});


app.listen(8080, () => {
console.log("server is listening");
});

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