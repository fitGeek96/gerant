//jshint esversion:6

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembreSchema = new mongoose.Schema({

  ID: {
    type: Number,
    required: true
  },

  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  ddn: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  typeS: {
    type: [],
    required: true
  },
  typeC: {
    type: []
  },
  sexe: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  }
});

mongoose.model("membres", MembreSchema);