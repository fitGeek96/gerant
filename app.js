//jshint esversion:6

const express = require("express");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");
const methodOverride = require("method-override");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const moment = require("moment");

// HTMLDivElement

// true

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose



mongoose
  .connect("mongodb://localhost/BDD", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Base de donnees   Connected..."))
  .catch(err => console.log(err));







// Load membre Model
require("./models/Membre");
const Membre = mongoose.model("membres");

// Load Produit Model
require("./models/Produit");
const Produit = mongoose.model("produits");


// Load Emploi Model
require("./models/Emploi");
const Emploi = mongoose.model("jours");

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "views")));

// Body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride("_method"));



// Index Route
app.get("/", (req, res) => {
  const title = "Bienvenue au Salle des sports Anti-Stress";
  res.render("index", {
    title: title
  });
});

// membre Index Page
app.get("/membres", (req, res) => {
  Membre.find({})
    .sort({
      date: "desc"
    })
    .then(membres => {
      res.render("membres/membres", {
        membres: membres
      });
    });



});

// Produits Index Page
app.get("/achats", (req, res) => {
  Produit.find({})
    .sort({
      date: "desc"
    })
    .then(produits => {
      res.render("achats/achats", {
        produits: produits
      });
    });



});


// emplois  Page
app.get("/emplois", (req, res) => {


  Emploi.find({}).sort({
      date: "desc"
    })
    .then(jours => {
      res.render("emplois/emploi", {
        jours: jours,
      });
    });

});


// // Add membre Form
app.get("/membres/add", (req, res) => {
  res.render("membres/add");
});

// EMPLOI DU TEMPS

app.get("/achats/add", (req, res) => {
  res.render("achats/add");
});


// EMPLOI DU TEMPS

app.get("/emplois/add", (req, res) => {
  const title = "Modification d'Emploi du temps d'entrainement";

  res.render("emplois/add", {
    tit: title
  });
});


// Edit membre Form
app.get("/membres/edit/:id", (req, res) => {
  Membre.findOne({
    _id: req.params.id
  }).then(membre => {
    res.render("membres/edit", {
      membre: membre
    });
  });
});


// Edit produit Form
app.get("/achats/edit/:id", (req, res) => {
  Produit.findOne({
    _id: req.params.id
  }).then(produit => {
    res.render("achats/edit", {
      produit: produit
    });
  });
});


// Edit emploi Form
app.get("/emplois/edit/:id", (req, res) => {
  Emploi.findOne({
    _id: req.params.id
  }).then(jour => {
    res.render("emplois/edit", {
      jour: jour
    });
  });
});




// Trouver membre Form
app.get("/trouver", (req, res) => {

  const userID = req.query.q;

  if (userID) {
    Membre.find({
        ID: userID
      },
      function (err, foundmembres) {
        if (err) {
          console.log(err);
        } else {
          res.render("trouver", {
            membres: foundmembres
          });
        }
      });

  }



});


// MEMBRE Process Form

app.post("/membres", (req, res) => {
  const newUser = {
    ID: req.body.ID,
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    ddn: req.body.ddn,
    phone: req.body.tele,
    typeS: req.body.typeS,
    typeC: req.body.typeC,
    sexe: req.body.sexe,
    avatar: req.body.avatar
  };

  newUser.ddn = moment(req.body.ddn).format("D-MM-YYYY");

  new Membre(newUser).save().then(membre => {
    res.redirect("/membres");
  });
});



// Produit Process Form

app.post("/achats", (req, res) => {
  const newProduit = {
    nom: req.body.nom,
    categorie: req.body.categorie,
    np: req.body.np,
    qte: req.body.qte,
    avatarP: req.body.avatarP

  };

  new Produit(newProduit).save().then(produit => {
    res.redirect("/achats");
  });
});

// Emploi Process Form

app.post("/emplois", (req, res) => {
  const newTraining = {
    timeD: {
      debut: req.body.timeDd,
      fin: req.body.timeDf
    },
    sportD: req.body.sportD,
    timeL: {
      debut: req.body.timeLd,
      fin: req.body.timeLf
    },
    sportL: req.body.sportL,
    timeM: {
      debut: req.body.timeMd,
      fin: req.body.timeMf
    },
    sportM: req.body.sportM,
    timeMer: {
      debut: req.body.timeMerd,
      fin: req.body.timeMerf
    },
    sportMer: req.body.sportMer,
    timeJ: {
      debut: req.body.timeJd,
      fin: req.body.timeJf
    },
    sportJ: req.body.sportJ,
    timeV: {
      debut: req.body.timeVd,
      fin: req.body.timeVf
    },
    sportV: req.body.sportV,
    timeS: {
      debut: req.body.timeSd,
      fin: req.body.timeSf
    },
    sportS: req.body.sportS

  };

  new Emploi(newTraining).save().then(jour => {
    res.redirect("/emplois");
  });
});


// // Edit Form process
app.put("/membres/:id", (req, res) => {
  Membre.findOne({
    _id: req.params.id
  }).then(membre => {
    // new values
    membre.ID = req.body.ID;
    membre.nom = req.body.nom;
    membre.prenom = req.body.prenom;
    membre.ddn = moment(req.body.ddn).format("D-MM-YYYY");
    membre.email = req.body.email;
    membre.phone = req.body.tele;
    membre.typeS = req.body.typeS;
    membre.typeC = req.body.typeC;
    membre.sexe = req.body.sexe;

    membre.save().then(membre => {
      res.redirect("/membres");
    });
  });
});


// // Edit Form process Produits
app.put("/achats/:id", (req, res) => {
  Produit.findOne({
    _id: req.params.id
  }).then(produit => {
    // new values

    produit.nom = req.body.nom;
    produit.categorie = req.body.categorie;
    produit.qte = req.body.qte;
    produit.np = req.body.np;


    produit.save().then(produit => {
      res.redirect("/achats");
    });
  });
});

// // Edit Form process Produits
app.put("/emplois/:id", (req, res) => {
  Emploi.findOne({
    _id: req.params.id
  }).then(jour => {
    // new values

    jour.timeD.debut = req.body.timeDd;
    jour.timeD.fin = req.body.timeDf;
    jour.sportD = req.body.sportD;

    jour.timeL.debut = req.body.timeLd;
    jour.timeL.fin = req.body.timeLf;
    jour.sportL = req.body.sportL;

    jour.timeM.debut = req.body.timeMd;
    jour.timeM.fin = req.body.timeMf;
    jour.sportM = req.body.sportM;

    jour.timeMer.debut = req.body.timeMerd;
    jour.timeMer.fin = req.body.timeMerf;
    jour.sportMer = req.body.sportMer;

    jour.timeJ.debut = req.body.timeJd;
    jour.timeJ.fin = req.body.timeJf;
    jour.sportJ = req.body.sportJ;

    jour.timeV.debut = req.body.timeVd;
    jour.timeV.fin = req.body.timeVf;
    jour.sportV = req.body.sportV;

    jour.timeS.debut = req.body.timeSd;
    jour.timeS.fin = req.body.timeSf;
    jour.sportS = req.body.sportS;


    jour.save().then(jour => {
      res.redirect("/emplois");
    });
  });
});

// // Delete membre
app.delete("/membres/:id", (req, res) => {
  Membre.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect("/membres");
  });
});

// // Delete Produit
app.delete("/achats/:id", (req, res) => {
  Produit.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect("/achats");
  });
});




app.listen(3000, function () {
  console.log("Server started on 3000");
});