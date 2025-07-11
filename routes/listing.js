const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema} = require("../schema.js")
const ExpressError = require("../Utils/ExpressError.js")
const Listing = require("../Models/listing.js")
const {isLoggedIn}=require("../middleware.js");

//validations for schema in the form of middlewarew
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error);
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

router.get("/new",isLoggedIn ,(req, res) => {
    // console.log(req.user);

  
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
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
}));


//show route - show individual data of listings using id
// /listings/:id - GET

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash('error', "The listing you requested does not exist.");
       return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { listing });
}));

//Edit & Update Route\
//GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
      if (!listing) {
        req.flash('error', "The listing you requested does not exist.");
       return res.redirect("/listings"); 
    }
    res.render("listings/edit.ejs", { listing })

}));

//update route
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","New Listing Updated!")
    res.redirect(`/listings/${id}`);

}));

//Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error","New Listing Deleted!")
    res.redirect("/listings");
}));

module.exports=router;