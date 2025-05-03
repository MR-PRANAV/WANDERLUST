const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js").default;
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");

const adminController = require("../controller/admin.js");

const { islogged_in, isOwner, validateListing, isAdmin } = require("../MW.js");

const multer = require("multer");
// const { storage } = require("../cloudinary/index.js");
// const upload = multer({ storage });     

// Admin dashboard route
router.get("/", islogged_in, isAdmin, adminController.renderAdminDashbord);

module.exports = router;
