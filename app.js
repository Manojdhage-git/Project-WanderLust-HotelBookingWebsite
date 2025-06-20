const express=require("express");
const app=express();
const mongoose=require("mongoose");

//create db
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})


app.get("/", (req, res) => {
    res.send("Welcome to WanderLust Hotel Booking!");
});

app.listen(8080,() => {
    console.log("Server is listening to port 8080");
});