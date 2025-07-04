const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema} = require("../schema.js")
const ExpressError = require("../Utils/ExpressError.js")
const Listing = require("../Models/listing.js")

//validations for schema in the form of middlewarew
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }

}

//index route to show data or listings

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//from to create new listings
//new & create route
// GET /listings/new
//POST /listings

router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    //      let result=listingSchema.validate(req.body);

    // if(result.error){
    //     throw new ExpressError(400,result.error)
    // }

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for list")
    // }

    const newListing = new Listing(req.body.listing);


    // if(!newListing.title){
    //     throw new ExpressError(400,"title is missing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"Description is missing");
    // }
    //  if(!newListing.location){
    //     throw new ExpressError(400,"location is missing");
    // }

    await newListing.save();
    res.redirect("/listings");
}));


//show route - show individual data of listings using id
// /listings/:id - GET

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Edit & Update Route\
//GET /listings/:id/edit
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })

}));

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);

}));

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports=router;