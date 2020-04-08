//jshint esversion:6

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({


    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model("users", UserSchema);