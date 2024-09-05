const express = require("express");
const app =  express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



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

//Index Route
app.get("/listings", async (req, res) => {
const all_listings = await Listing.find({});
res.render("./listings/index.ejs", {all_listings});
});

//New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async(req,res) => {
let {id} = req.params;
const listing = await Listing.findById(id);
res.render("listings/show.ejs", {listing});
});

//Create Route
app.post("/listings", async(req,res) => {
// let{title, description, image, price, country, location} = req.body;
let listing = req.body.listing;
const new_listing = new Listing(listing);
await new_listing.save();
res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit.ejs", { listing });
 });

//  Update Route
app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
//    res.redirect("/listings");
res.redirect(`/listings/${id}`);
});


//Delete Route
app.delete("/listings/:id", async(req,res) => {
    const id = req.params.id.trim();
    // let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
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


app.listen(8080, () => {
console.log("server is listening");
});