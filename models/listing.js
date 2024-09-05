const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
description:{
        type: String
    },

    image:{
        filename:String,
         url:String
       
        // type: String,
        // default: "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
        // set: (v) => 
        //     v==="" 
        // ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" 
        // : v,
    },

    price:{
        type: Number
    },

    location:{
        type: String
    },


    country:{
        type: String
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;