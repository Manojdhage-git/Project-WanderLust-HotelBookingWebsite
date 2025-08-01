if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js")
const session = require("express-session");
const mongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");


const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");



const dbUrl=process.env.ATLASDB_URL;



main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    })


//create db

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));//request data parse
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,


})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})
//Sessson and Cookies
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};





app.use(session(sessionOptions));
app.use(flash());


//authenticate
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;

  
  next();
});

//demo for authentication
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"delta-student"
//     });
//   let registeredUser= await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })


app.use("/listings", listingsRouter);
app.use("/listings/:id", reviewsRouter);
app.use("/",userRouter)


// More explicit pattern matching
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});