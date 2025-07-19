const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { default: expressError } = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require("./models/user");
if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}

const { islogged_in, isOwner, validateListing } = require("./MW.js");

  const Listing = require("./models/listing");  

const Booking = require("./models/booking.js");
// REQUIRING LISTING MODEL IN app.js FROM [ models --> listing.js ] 



// REQUIRING LISTINGS ALL ROUTES IN app.js FROM [ Routes --> listing.js ] 
const listingsRouter = require("./routes/listing.js");
// REQUIRING REVIEWS ALL ROUTES IN app.js FROM [ routes --> review.js ] 
const reviewsRouter = require("./routes/review.js");
// REQUIRING USER ALL ROUTES IN app.js FROM [ routes --> user.js ] 
const userRouter = require("./routes/user.js");



const app = express();
let port = 8080;

//--------MONGO DB CONECTION S--------
const ATLAS_DB_URL = process.env.ATLAS_DB_URL
mongoose.set('strictPopulate', false);
main()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(ATLAS_DB_URL);
  
}
//--------MONGO DB CONECTION E--------

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// --------SESSION CREATION S-------
const store = MongoStore.create({
  mongoUrl: ATLAS_DB_URL,
  crypto: {
    secret: process.env.SESSION_SECRET
  },
  touchAfter: 24 * 3600
})

store.on("error", ()=>{
  console.log("ERROR IN MONGO SESSION STORE")
})

const sessionOption = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 ,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
}
app.use(session(sessionOption));
// --------SESSION CREATION E-------

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate())); // Fix: Use User.authenticate() provided by passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --------LOCALS CREATION S-------
app.use((req, res, next)=>{
  res.locals.success = req.flash("Success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user
  next();
})

app.use((req, res, next) => {
  res.locals.curr_user = req.user; // `req.user` is set by Passport.js after authentication
  next();
});
// --------LOCALS CREATION E-------

// LISTINGS ALL ROUTES FORM [ Routes --> listing.js ] TO [ app.js ]
app.use("/listings", listingsRouter)
// ---------------------------------------------
// REVIEWS ALL ROUTES FORM [ Routes --> review.js ] TO [ app.js ]
app.use("/listings/:id/reviews", reviewsRouter)
// ---------------------------------------------
// USER ALL ROUTES FORM [ Routes --> user.js ] TO [ app.js ]
app.use("/", userRouter)
// ---------------------------------------------


app.get("/search", async (req, res) => {


  const search = req.query

  console.log("booking data in route", search)

    const { location, checkIn, checkOut, people } = req.query;
    const Listing = require("./models/listing");
    const Booking = require("./models/booking");

    // Find listings in location with enough capacity
    let listings = await Listing.find({
        location: { $regex: new RegExp(location, 'i') },
        capacity: { $gte: Number(people) }
    });

    // Filter out listings that are already booked for those dates
    const availableListings = [];
    for (let listing of listings) {
        const overlapping = await Booking.findOne({
            listing: listing._id,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
            ]
        });
        if (!overlapping) availableListings.push(listing);
    }

    // console.log(availableListings)

    res.render("listings/index", { listings: availableListings, bookingdata: search });
});




app.get("/listings/:id/book", islogged_in, async (req, res) => {
 
  const { id } = req.params;
  // console.log("Booking ID:", id);
  const bookingdata = req.query.bookingdata ? JSON.parse(req.query.bookingdata) : null;

  console.log(" booking data in get booking page route ", bookingdata)

const listing = await Listing.findById(id).populate("owner");
  if (!listing) { 
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  // console.log("Listing:", listing);
  res.render("bookings/new.ejs", { listing, currUser: req.user , bookingdata });

});




// /bookings/<%= listing._id %>
app.post("/bookings/:id", islogged_in, async (req, res) => {
  console.log( "POST /bookings/:id" )
  try {
    const { id } = req.params;
    const { checkIn, checkOut, people } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Validate people count
    if (Number(people) < 1 || Number(people) > listing.capacity) {
      req.flash("error", `Number of people must be between 1 and ${listing.capacity}.`);
      return res.redirect(`/listings/${id}/book`);
    }

    // Validate dates
    if (!checkIn || !checkOut || new Date(checkIn) >= new Date(checkOut)) {
      req.flash("error", "Invalid check-in/check-out dates.");
      return res.redirect(`/listings/${id}/book`);
    }

  

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      listing: listing._id,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
      ]
    });
    if (overlapping) {
      req.flash("error", "Location/Venue is not available for the selected dates.");
      return res.redirect(`/listings/${id}/book`);
    }

  // Validate min 10 days between today and check-in
    const today = new Date();
    today.setHours(0,0,0,0); // Ignore time part
    const checkInDate = new Date(checkIn);
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 10) {
      req.flash("error", "Check-in date must be at least 10 days from today.");
      return res.redirect(`/listings/${id}/book`);
    }


    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      people: Number(people),
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      // expiresAt: new Date(Date.now() + 1 * 60 * 1000), // Expires in 1 minute
    });

    await booking.save();
    req.flash("success", "Booking created successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Booking error:", err);
    req.flash("error", "Booking failed: " + err.message);
    res.redirect(`/listings/${req.params.id}/book`);
  }
});



//  <form action="/bookings/<%= BOOKING._id %>?_method=DELETE" method="POST" class="d-inline">
  
// Delete booking route (permanent deletion)
app.delete("/bookings/:id", islogged_in, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/profile");
    }
    // Only the user who made the booking can delete it
    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You are not authorized to delete this booking.");
      return res.redirect("/profile");
    }
    await Booking.findByIdAndDelete(req.params.id);
    req.flash("success", "Booking deleted successfully.");
    res.redirect("/profile");
  } catch (err) {
    console.error("Delete booking error:", err);
    req.flash("error", "Failed to delete booking.");
    res.redirect("/profile");
  }
});


// /payments/<%= BOOKING._id %>
// Payment route
app.get("/payments/:id", islogged_in, async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)

              const listing = await Listing.findById(booking.listing);
              if (!listing) {
                req.flash("error", "Listing not found.");
                return res.redirect("/profile");
              }

              const user = await User.findById(booking.user)
              if (!user) {
                req.flash("error", "User not found.");
                return res.redirect("/profile");
              }

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/profile");
    }
    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You are not authorized to pay for this booking.");
      return res.redirect("/profile");
    }

    // ------------------------------------------------------------
    // console.log("Booking found:", booking);
    // console.log("Listing found:", listing);
    // console.log("User found:", user);
        // OUTPUT DATA
        // Booking found: {
        //   _id: new ObjectId("687b67eab270dbdd4b731b40"),
        //   listing: new ObjectId("68790afd5c96f56ad7ca99ed"),
        //   user: new ObjectId("685fc20296c83909aa2519f8"),
        //   checkIn: 2025-08-03T00:00:00.000Z,
        //   checkOut: 2025-08-04T00:00:00.000Z,
        //   people: 3,
        //   status: 'pending',
        //   createdAt: 2025-07-19T09:39:54.217Z,
        //   updatedAt: 2025-07-19T10:03:51.804Z,
        //   __v: 0,
        //   expiresAt: 2025-07-20T10:03:51.801Z
        // }
        // Listing found: {
        //   image: {
        //     url: 'https://res.cloudinary.com/dip72tu62/image/upload/v1752763137/wanderlust_DEV/fcptflq0vu7yp0llchoc.jpg',
        //     filename: 'wanderlust_DEV/fcptflq0vu7yp0llchoc'
        //   },
        //   geometry: { type: 'Point', coordinates: [ 73.40442, 18.754004 ] },
        //   _id: new ObjectId("68790afd5c96f56ad7ca99ed"),
        //   title: 'Mountain Retreat',
        //   description: 'MT RES',
        //   price: 1500,
        //   location: 'Lonavala',
        //   country: 'India',
        //   tag: 'Mountain',
        //   review: [],
        //   owner: new ObjectId("685fc20296c83909aa2519f8"),
        //   capacity: 20,
        //   __v: 0
        // }
        // User found: {
        //   profilePhoto: {
        //     url: 'https://res.cloudinary.com/dip72tu62/image/upload/v1752733354/wanderlust_DEV/eqa1v5zwje7cinhwfqq5.jpg',
        //     filename: 'wanderlust_DEV/eqa1v5zwje7cinhwfqq5'
        //   },
        //   _id: new ObjectId("685fc20296c83909aa2519f8"),
        //   email: 'pranavpatil020389@gmail.com',
        //   isAdmin: false,
        //   username: '_mr_pranav____',
        //   __v: 0
        // }
    // Render the payment page with booking details
    // res.render("payments/payment.ejs", { booking, listing, user });
// -----------------------------------------------------------

    //just change the status to conformed
    booking.status = 'confirmed';
    
    //booking.expiresAt is removed as it is not needed after payment
    booking.expiresAt = undefined; // Remove the TTL index field

    await booking.save();
    req.flash("success", "Payment successful.");
    res.redirect("/profile");

  } catch (err) {
    console.error("Payment error:", err);
    req.flash("error", "Failed to process payment.");
    res.redirect("/profile");
  }
});


//TEMP ROUTE FOR UNPAY
// /payments/<%= BOOKING._id %>/makeunpay
app.get("/payments/:id/makeunpay", islogged_in, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/profile");
    }
    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You are not authorized to unpay for this booking.");
      return res.redirect("/profile");
    }
    
    // Change the status to pending
    booking.status = 'pending';

    // Set expiresAt to 24 hours from the original creation date
    booking.expiresAt = new Date(booking.createdAt.getTime() + 24 * 60 * 60 * 1000);

    await booking.save();
    req.flash("success", "Payment reverted to pending.");
    res.redirect("/profile");
  } catch (err) {
    console.error("Unpay error:", err);
    req.flash("error", "Failed to revert payment.");
    res.redirect("/profile");
  }
});



// HOME ROUTE
app.get("/", (req, res) => {
  res.render("home/home.ejs");
});

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SOMETHING WENT WRONG!" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});







