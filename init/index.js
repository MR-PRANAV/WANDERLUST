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
        initData.data = initData.data.map((obj) =>({...obj, owner: '67a5d1d544461154b02fcde4'}))

        await listing.insertMany(initData.data);
        console.log("Data inserted");
}

initDB();