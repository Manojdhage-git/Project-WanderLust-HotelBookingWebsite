const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Project-WanderLust-HotelBookingWebsite/Models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./Utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./Models/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    })

//create db

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));//request data parse
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Home route
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});

//validations for schema in the form of middlewarew
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }

}

//validate schema
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }

}


//index route to show data or listings

app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//from to create new listings
//new & create route
// GET /listings/new
//POST /listings

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Create route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
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

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Edit & Update Route\
//GET /listings/:id/edit
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })

}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);

}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//REVIEW POST ROUTE
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New review saved:", newReview);
    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTE
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
let{id,reviewId}=req.params;
Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`);
}))

// More explicit pattern matching:
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});