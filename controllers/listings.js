const Listing = require("../models/listing");

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
            // let{title, description, image, price, country, location} = req.body;
               let listing = req.body.listing;
               const new_listing = new Listing(listing);
               new_listing.owner = req.user._id;
               await new_listing.save();
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
                 res.render("listings/edit.ejs", { listing });
             };

             module.exports.updateListing = async (req,res) => {
                let {id} = req.params;
               await Listing.findByIdAndUpdate(id, {...req.body.listing});
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