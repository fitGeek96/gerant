//jshint esversion:6

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmploiSchema = new mongoose.Schema({


    timeD: {
        debut: {
            type: String
        },
        fin: {
            type: String
        }
    },
    sportD: {
        type: String,

    },

    timeL: {
        debut: {
            type: String
        },
        fin: {
            type: String
        }
    },
    sportL: {
        type: String,

    },

    timeM: {
        debut: {
            type: String
        },
        fin: {
            type: String
        }
    },
    sportM: {
        type: String,

    },

    timeMer: {
        debut: {
            type: String
        },
        fin: {
            type: String
        }
    },
    sportMer: {
        type: String,

    },

    timeJ: {
        debut: {
            type: String
        },
        fin: {
            type: String
        }
    },
    sportJ: {
        type: String,

    },

    timeV: {
        debut: {
            type: String
        },
        fin: {
            type: String
        }
    },
    sportV: {
        type: String,

    },

    timeS: {
        debut: {
            type: String
        },
        fin: {
            type: String
        }
    },
    sportS: {
        type: String,

    }

});

mongoose.model("jours", EmploiSchema);