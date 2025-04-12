const express = require("express");
const router = express
  .Router
  // {mergeParams : true}
  ();


const user = require("../models/user.js");
const { default: wrapAsync } = require("../utils/wrapAsync");
const passport = require("passport");

const userController = require("../controller/user.js")
// const autncontroller = require("./routes/auth.js")

const {saveRedirectUrl} = require("../MW.js")
const { islogged_in, isOwner, validateListing } = require("../MW.js");


router
  .route("/signup")
  // SIGNUP FORM RENDER
  .get( userController.signUpRender )
    // SIGNUP USER SAVE
  .post(
    wrapAsync(userController.signUpSave)
  );

router
  .route("/login")
   // LOGIN FORM RENDER
  .get( userController.loginRender)
  // LOGIN FORM USER IN TO SITE
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
    }),
    wrapAsync(userController.loginsave)
);

// LOGOUT USER FROM SITE
router.get("/logout" , userController.logout)


router.get("/profile" , userController.Profile)

router.get("/user" ,  userController.allUser)

router.get("/userprofile/:id" , islogged_in,  userController.Userprofile)

  


module.exports = router;
