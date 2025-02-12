const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.reviewRoute = async (req, res) => {
        //   console.log(req.params.id)
        let listing = await Listing.findById(req.params.id);
        //   console.log(req.body.review)
        let newReview = new Review(req.body.review);
        newReview.auther = req.user._id;
        // console.log(newReview);
        listing.review.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("Success", "New Review Added ⭐");
        res.redirect(`/listings/${listing.id}`);
      }


module.exports.deleteReview = async (req, res) => {
        const { id, revid } = req.params;
        try {
        const result = await Listing.findByIdAndUpdate(
        id,
        { $pull: { review: revid } },
        { new: true }
        );
        if (!result) {
        return res.status(404).send("Listing not found");
        }
        await Review.findByIdAndDelete(revid);
        req.flash("Success", "Review Deleted 😔");
        res.redirect(`/listings/${id}`);
        } catch (error) {
        // console.error("Error removing review reference:", error);
        res
        .status(500)
        .send("An error occurred while removing the review reference");
        }
}