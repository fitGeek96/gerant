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
  .connect("mongodb://localhost/membresDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Base de donnees Membres Connected..."))
  .catch(err => console.log(err));



mongoose
  .connect("mongodb://localhost/produitsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Base de donnees Produits Connected..."))
  .catch(err => console.log(err));

// Load membre Model
require("./models/Membre");
const Membre = mongoose.model("membres");

// Load Produit Model
require("./models/Produit");
const Produit = mongoose.model("produits");



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

// Express session midleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Index Route
app.get("/", (req, res) => {
  const title = "Système de gestion de gym Anti-Stress";
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


// // Add membre Form
app.get("/membres/add", (req, res) => {
  res.render("membres/add");
});

// EMPLOI DU TEMPS

app.get("/achats/add", (req, res) => {
  res.render("achats/add");
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


// Edit membre Form
app.get("/achats/edit/:id", (req, res) => {
  Membre.findOne({
    _id: req.params.id
  }).then(produit => {
    res.render("produits/edit", {
      produit: produit
    });
  });
});



// Trouver membre Form
app.get("/membres/trouver", (req, res) => {

  const userID = req.query.q;



  if (userID) {
    Membre.find({
        ID: userID
      },
      function (err, foundmembres) {
        if (err) {
          console.log(err);
        } else {
          res.render("membres/trouver", {
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