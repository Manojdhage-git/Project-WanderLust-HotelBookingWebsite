const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../Models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");



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
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    //      let result=listingSchema.validate(req.body);

    // if(result.error){
    //     throw new ExpressError(400,result.error)
    // }

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for list")
    // }

    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;


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
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    console.log(listing.owner);

    if (!listing) {
        req.flash('error', "The listing you requested does not exist.");
       return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { listing });
}));

//Edit & Update Route\
//GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
      if (!listing) {
        req.flash('error', "The listing you requested does not exist.");
       return res.redirect("/listings"); 
    }
     console.log("Listing loaded for edit:", listing); 
    res.render("listings/edit.ejs", { listing })

}));

//update route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    
let listing= await Listing.findById(id);


    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","New Listing Updated!")
    res.redirect(`/listings/${id}`);

}));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error","New Listing Deleted!")
    res.redirect("/listings");
}));

module.exports=router;