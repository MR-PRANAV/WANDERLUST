const mongoose = require("mongoose");
const review = require("./review.js");
const { required } = require("joi");
const schema = mongoose.Schema;

const listingSchema = new schema({
        title: {
                type: String,
                required: true
        },
        description: String,
        image: {
               url : String,
               filename: String
        },
        price: Number,
        location: String,
        country: String,
        review : [
                {
                        type : schema.Types.ObjectId,
                        ref : "Review"
                }
        ],
        owner : {
                type : schema.Types.ObjectId, 
                ref : "User"
        },
        geometry: {
                type: {
                  type: String, // Don't do `{ location: { type: String } }`
                  enum: ['Point'], // 'location.type' must be 'Point'
                  required: true
                },
                coordinates: {
                  type: [Number],
                  required: true
                }
              }
})


const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
