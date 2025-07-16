const Listing=require("../Models/listing");
const Review=require("../Models/review");


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review Created!")
    console.log("New review saved:", newReview);
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
let{id,reviewId}=req.params;
Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
req.flash("success","New Review Deleted!")
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`);
}