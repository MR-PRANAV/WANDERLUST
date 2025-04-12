const user = require("../models/user.js");
const Listing = require("../models/listing");

module.exports.signUpRender = async (req, res) => {
res.render("users/signup");
}

module.exports.signUpSave = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new user({ email, username });
      const registerdUser = await user.register(newUser, password);
      console.log("THIS IS REG USER - " , registerdUser);
      req.login(registerdUser, (err)=>{
        if(err){
          return next(err)
        }
        req.flash("Success", "WELLCOME TO WANDERLUST!");
        res.redirect("/listings");
      })
    } catch (e) {
      req.flash("error", ` ${e.message} `);
      res.redirect("/signup");
    }
  }

module.exports.loginRender = async (req, res) => {
res.render("users/login");
}

module.exports.loginsave = async (req, res) => {
      let { username, password } = req.body;
      req.flash("Success", `Wellcome Back to WANDERLUST!`);
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next)=>{
        req.logout(
          (err)=>{
            if(err){
             return next(err)
            }
            req.flash("Success" , "You logged-out!")
            // res.redirect("/listings")
            res.render("home/home.ejs")
          }
        )
      }

module.exports.Profile = async (req, res) => {
  try {
    let curr_user = res.locals.currUser;
    // console.log("CUR USER ID", curr_user._id);
    let curuserlistings = await Listing.find({ owner: curr_user._id });
    // console.log("CUR USER LISTINGS", curuserlistings);
    res.render("users/profile", { curr_user, curuserlistings });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).send("Server Error");
  }
};

module.exports.allUser = async (req, res) => {
  let curr_user = res.locals.currUser;
  let allusers = await user.find({});
  res.render("users/allusers", { allusers, curr_user });
}

module.exports.Userprofile = async (req, res) => {
  let { id } = req.params;
  let userprofile = await user.findById(id);
  let curuserlistings = await Listing.find({ owner: id });
  res.render("users/userprofile", { userprofile, curuserlistings  });
}


