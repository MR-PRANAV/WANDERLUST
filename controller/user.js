const user = require("../models/user.js");

module.exports.signUpRender = async (req, res) => {
res.render("users/signup");
}


module.exports.signUpSave = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new user({ email, username });
      const registerdUser = await user.register(newUser, password);
      // console.log(registerdUser);
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

module.exports.UserProfile = (req,res)=>{
  let curr_user = res.locals.currUser
  res.render("users/profile" , { curr_user });
}

