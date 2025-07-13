const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../Models/listing.js");

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

const initDB=async()=>{
   await Listing.deleteMany({});
   initdata.data=initdata.data.map((obj)=>({...obj,owner:"686f2cc80eb1444fe39ec3a7"}))
   await Listing.insertMany(initdata.data);
   console.log("data was initialized");
};

initDB();