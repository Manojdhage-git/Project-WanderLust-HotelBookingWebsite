const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const { reviewSchema } = require("../schema.js")
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

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
router.post("/reviews",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete("/reviews/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;