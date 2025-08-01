const Listing=require("../Models/listing");
const Review=require("../Models/review");


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review Created!")
    console.log("New review saved:", newReview);
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Pull reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete review document
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
