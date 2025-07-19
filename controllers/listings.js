const Listing = require("../Models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    //      let result=listingSchema.validate(req.body);

    // if(result.error){
    //     throw new ExpressError(400,result.error)
    // }

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for list")
    // }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;


    // if(!newListing.title){
    //     throw new ExpressError(400,"title is missing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"Description is missing");
    // }
    //  if(!newListing.location){
    //     throw new ExpressError(400,"location is missing");
    // }
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}



module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    console.log(listing.owner);

    if (!listing) {
        req.flash('error', "The listing you requested does not exist.");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', "The listing you requested does not exist.");
        return res.redirect("/listings");
    }
    console.log("Listing loaded for edit:", listing);
    res.render("listings/edit.ejs", { listing })

}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Update basic listing fields first
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // Only try to access req.file if it exists
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error", "New Listing Deleted!")
    res.redirect("/listings");
}

