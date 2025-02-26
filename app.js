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
const passportLocal = require("passport-local")
const user = require("./models/user.js")

if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}

// REQUIRING LISTINGS ALL ROUTES IN app.js FROM [ Routes --> listing.js ] 
const listingsRouter = require("./Routes/listing.js");
// REQUIRING REVIEWS ALL ROUTES IN app.js FROM [ Routes --> review.js ] 
const reviewsRouter = require("./Routes/review.js");
// REQUIRING USER ALL ROUTES IN app.js FROM [ Routes --> user.js ] 
const userRouter = require("./Routes/user.js");
const { error } = require("console");


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
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// --------LOCALS CREATION S-------
app.use((req, res, next)=>{
  res.locals.success = req.flash("Success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user
  next();
})
// --------LOCALS CREATION E-------

// LISTINGS ALL ROUTES FORM [ Routes --> listing.js ] TO [ app.js ]
app.use("/listings", listingsRouter)
// ---------------------------------------------
// REVIEWS ALL ROUTES FORM [ Routes --> review.js ] TO [ app.js ]
app.use("/listings/:id/reviews", reviewsRouter)
// ---------------------------------------------
// USER ALL ROUTES FORM [ Routes --> user.js ] TO [ app.js ]
app.use("/", userRouter)

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