const { types, date } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
      
        comment : String,
        rating :{
                type : Number,
                min : 1,
                max : 5,
        },
        created_at : {
                type : Date,
                default : Date.now()
        },
        auther:{
                type : schema.Types.ObjectId, 
               ref : "User"
        }

})

module.exports = mongoose.model("Review", reviewSchema);