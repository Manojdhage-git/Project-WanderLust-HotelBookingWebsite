const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../Project-WanderLust-HotelBookingWebsite/Modules/listing")


//Home route
app.get("/", (req, res) => {
    res.send("Welcome to WanderLust Hotel Booking!");
});

//testing listing of info
app.get("/testListing", async (req,res)=>{
    let sampleListing=new Listing({
        title:"My new Villa",
        description :"By the beach",
        price:1000,
        location:"calangute,goa",
        country:"India"
    });

    await sampleListing.save();
    console.log("sample was send");
    res.send("success testing");
})

app.listen(8080,() => {
    console.log("Server is listening to port 8080");
});