const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../Models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");



//index route to show data or listings

router.get("/", wrapAsync(listingController.index));

//from to create new listings
//new & create route
// GET /listings/new
//POST /listings

router.get("/new",isLoggedIn ,listingController.renderNewForm);

//Create route
router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//show route - show individual data of listings using id
// /listings/:id - GET

router.get("/:id", wrapAsync(listingController.showListing));

//Edit & Update Route\
//GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports=router;