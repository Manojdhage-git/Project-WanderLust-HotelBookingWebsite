const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../Utils/ExpressError.js");
const { reviewSchema } = require("../schema.js")
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js")

//validate schema
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }

}

//REVIEW POST ROUTE
router.post("/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New review saved:", newReview);
    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTE
router.delete("/reviews/:reviewId",wrapAsync(async(req,res)=>{
let{id,reviewId}=req.params;
Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`);
}))

module.exports=router;