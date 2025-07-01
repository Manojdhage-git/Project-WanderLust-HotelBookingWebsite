const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,


    },
    description: {
        type: String,

    },
    image: {
        filename: {
            type: String,
            default: "default.jpg",

        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1749838065282-32db54bed154?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    }
    ,
    price: {
        type: Number,

    },
    location: {
        type: String,

    },
    country: {
        type: String,

    },

    reviews: {
        type: Schema.Types.ObjectId,
        

    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;