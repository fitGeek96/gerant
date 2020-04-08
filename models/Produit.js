//jshint esversion:6

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProduitSchema = new mongoose.Schema({


    nom: {
        type: String,
        required: true
    },
    qte: {
        type: Number,
        required: true

    },
    categorie: {
        type: String,
        required: true
    },
    np: {
        type: String,
        required: true

    },
    prix: {
        type: Number,
        required: true

    },
    avatarP: {
        type: String,
    }
});

mongoose.model("produits", ProduitSchema);