const express=require("express");
const router=express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const multer = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage});

const Listing = require("../Models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");


router.route("/")
//index route to show data or listings
.get(wrapAsync(listingController.index))
//Create route
.post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));



//from to create new listings
//new & create route
// GET /listings/new
//POST /listings

router.get("/new",isLoggedIn ,listingController.renderNewForm);





router.route("/:id")
//show route - show individual data of listings using id
// /listings/:id - GET
.get( wrapAsync(listingController.showListing))
//update route
.put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
// deleteroute
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));




//Edit & Update Route\
//GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports=router;