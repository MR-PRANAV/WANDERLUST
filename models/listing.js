const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
        title: {
                type: String,
                required: true
        },
        description: String,
        image: {
                filename: String,
                url: {
                        type: String,
                        default: "https://media.istockphoto.com/id/1028621094/photo/service-bell-on-hotel-reception-desk.jpg?s=2048x2048&w=is&k=20&c=-YJfkchCeNBeSOyAgj6PdWO1turxXOjCoLjOLbtRRRY=",
                        set: (v) => v == "" ? "https://media.istockphoto.com/id/1028621094/photo/service-bell-on-hotel-reception-desk.jpg?s=2048x2048&w=is&k=20&c=-YJfkchCeNBeSOyAgj6PdWO1turxXOjCoLjOLbtRRRY=" : v
                }
        },
        price: Number,
        location: String,
        country: String,
        // date: { type: Date, default: Date.now }
})

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
