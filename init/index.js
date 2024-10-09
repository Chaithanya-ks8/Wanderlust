const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const mongo_url = "mongodb://localhost:27017/wanderlust";

main().then(() => {
console.log("DB is connected");
}) .catch(err => "err");

async function main(){
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await listing.deleteMany({});//66fbbde4c166c805c66dbcf5
    initData.data = initData.data.map((obj) =>({...obj,owner:"66fbbde4c166c805c66dbcf5"}) )
    await listing.insertMany(initData.data);
    console.log("initialized");
};
initDB();