//jshint esversion:6

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmploiSchema = new mongoose.Schema({


    timeD: {
        type: [],
    },
    sportD: {
        type: String,

    },

    timeL: {
        type: [],
    },
    sportL: {
        type: String,

    },

    timeM: {
        type: [],
    },
    sportM: {
        type: String,

    },

    timeMer: {
        type: [],
    },
    sportMer: {
        type: String,

    },

    timeJ: {
        type: [],
    },
    sportJ: {
        type: String,

    },

    timeV: {
        type: [],
    },
    sportV: {
        type: String,

    },

    timeS: {
        type: [],
    },
    sportS: {
        type: String,

    }

});

mongoose.model("jours", EmploiSchema);