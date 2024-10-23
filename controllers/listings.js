const Listing = require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const all_listings = await Listing.find({});
    res.render("./listings/index.ejs", {all_listings});
    };

    module.exports.renderNewForm = (req,res) => {
        res.render("listings/new.ejs");
    };

    module.exports.showListing = async(req,res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            },
        })
        .populate("owner");
        if(!listing){
            req.flash("error", "listing you requested does not existed");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", {listing});
        };

        module.exports.createListing = async(req,res,next) => {
        let response = await geocodingClient.forwardGeocode({
                query: req.body.listing.location, //"Karnataka, India"
                limit: 1,
              })
                .send();
                
            // let{title, description, image, price, country, location} = req.body;
            let url = req.file.path;
            let filename = req.file.filename;
               let listing = req.body.listing;
               const new_listing = new Listing(listing);
               new_listing.owner = req.user._id;
               new_listing.image = {url, filename};

               new_listing.geometry = response.body.features[0].geometry;

              let savedListing =  await new_listing.save();
              console.log(savedListing);

               req.flash("success", "New Listing Created!");
               res.redirect("/listings");
            };

            module.exports.renderEditForm = async (req, res) => {
                let { id } = req.params;
                 const listing = await Listing.findById(id);
                 if(!listing){
                     req.flash("error", "listing you requested does not existed");
                     res.redirect("/listings");
                 }

                let originalImageUrl =  listing.image.url;
               originalImageUrl =  originalImageUrl.replace("upload" , "/upload/w_250");
                 res.render("listings/edit.ejs", { listing, originalImageUrl });
             };

             module.exports.updateListing = async (req,res) => {
                let {id} = req.params;
             let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

             if(typeof req.file !== "undefined"){
             let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url, filename};
            await listing.save();
        }

             //    res.redirect("/listings");
             req.flash("success", " Listing updated!");
             res.redirect(`/listings/${id}`);
             };

             module.exports.destroyListing = async(req,res) => {
                const id = req.params.id.trim();
                // let {id} = req.params;
               let deletedListing = await Listing.findByIdAndDelete(id);
               req.flash("success", " Listing Deleted");
             res.redirect("/listings");
             };