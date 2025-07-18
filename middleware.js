const Listing=require("./Models/listing");
const { listingSchema} = require("./schema.js")
const ExpressError = require("./Utils/ExpressError.js")


module.exports.isLoggedIn=(req,res,next)=>{
      //authenticate
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;
    
let listing= await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
}
    next();
}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

}

