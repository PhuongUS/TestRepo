const mongoose = require('mongoose');

const TheTripSchema = new mongoose.Schema({
    userID: {
        type: String,
        default: 0
    },
    phoneCustomer:{
        type:String,
        default:0
    },
    money:{
        type:String,
        default:0
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('TheTrip', TheTripSchema);
