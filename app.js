const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../Project-WanderLust-HotelBookingWebsite/Modules/listing")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); 

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

//create db

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//request data parse
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Home route
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});



//index route to show data or listings

app.get("/listings",async(req,res)=>{
        const allListings=await Listing.find({});
        res.render("listings/index.ejs",{allListings});
});

//from to create new listings
//new & create route
// GET /listings/new
//POST /listings

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//Create route
app.post("/listings",async (req,res)=>{
    // let {title,description,image,price,country,location}=req.body;
   const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})


//show route - show individual data of listings using id
// /listings/:id - GET

app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//Edit & Update Route\
//GET /listings/:id/edit
app.get("/listings/:id/edit",async (req,res)=>{
       let {id}=req.params;
       const listing=await Listing.findById(id);
       res.render("listings/edit.ejs",{listing})

})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

})

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
     let {id}=req.params;
     let deletedListing=await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
})
app.listen(8080,() => {
    console.log("Server is listening to port 8080");
});