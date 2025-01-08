const mongoose = require('mongoose');
const initData = require('./data.js');

const listing = require("../models/listing.js");

main()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(" ERROR IS" +err));    
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
        await listing.deleteMany({});
        await listing.insertMany(initData.data);
        console.log("Data inserted");
}

initDB();