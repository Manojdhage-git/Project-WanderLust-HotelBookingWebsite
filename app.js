const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../Project-WanderLust-HotelBookingWebsite/Modules/listing")
const path=require("path");

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

//Home route
app.get("/", (req, res) => {
    res.send("Welcome to WanderLust Hotel Booking!");
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



app.listen(8080,() => {
    console.log("Server is listening to port 8080");
});