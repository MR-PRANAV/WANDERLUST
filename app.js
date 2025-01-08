const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/listing'); // Import the Listing model
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js").default
const ExpressError = require("./utils/expressError.js");
const { default: expressError } = require('./utils/expressError.js');
const {listingSchema} = require("./schema.js")

const app = express();
let port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));  
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));    
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const validateListing = (req, res, next)=>{

  let {error} = listingSchema.validate(req.body)
  console.log(req.body)
  if(error){
    console.log("IF START")
    let {errorMsg} = error.details.map((el) => el.message).join(",");
    console.log(errorMsg)
    throw new expressError(400 , errorMsg)
  }else{
    console.log("ELSE START")
    next()
  }
}

// INDEX ROUTE
app.get("/listings", wrapAsync(async (req, res) => {
       const listings = await Listing.find({});
       res.render("listings/index", { listings });
}));

// (CREATE) NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// (CREATE) CREATE ROUTE
app.post("/listings",
  validateListing,
  wrapAsync( async (req, res , next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
}));

// (READ) SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const listingItem = await Listing.findById(req.params.id);
    res.render("listings/show", { listing: listingItem });
}));

// (UPDATE) EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let listingItem = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing: listingItem });
}));

// (UPDATE) UPDATE ROUTE
app.put("/listings/:id", 
  validateListing , 
  wrapAsync( async (req, res) => {
  console.log("UPDATED");
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing})
  res.redirect(`/listings/${id}`);
}));

// (DELETE) DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletetlisting =  await Listing.findByIdAndDelete(id);
  console.log(deletetlisting);
  res.redirect("/listings");
}));

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Hello Wellcome To Wanderlust!");
})

app.all("*" , (req, res, next)=>{
  next(new expressError(404 , "Page Not Found!"))
})

app.use((err ,req , res , next)=>{
  let {statusCode = 500 , message = "SOMETHING WENT WRONG!"} = err
  res.status(statusCode).render("error" , {message})
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});