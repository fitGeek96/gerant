//jshint esversion:6
const express = require("express");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const path = require("path");
const moment = require("moment");

var current = moment();

const {
  ensureAuthenticated
} = require("./helpers/auth");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
const app = express();

// Load membre Model
require("./models/Membre");
const Membre = mongoose.model("membres");

// Load Produit Model
require("./models/Produit");
const Produit = mongoose.model("produits");

// Load Emploi Model
require("./models/Emploi");
const Emploi = mongoose.model("jours");

// Load User Model
require("./models/User");
const User = mongoose.model("users");

// DB Config
const db = require("./config/database");

// Moment countdown
require("moment-countdown");


// Connect to mongoose

mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Base de donnees Connected..."))
  .catch(err => console.log(err));

require("./config/passport")(passport);

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

// passport middlewqre
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get("/", ensureAuthenticated, (req, res) => {
  const title = "Bienvenue au Salle des sports Anti-Stress";
  res.render("index", {
    title: title
  });
});

// membre Index Page
app.get("/membres", ensureAuthenticated, (req, res) => {
  Membre.find({}).sort({
      date: "desc"
    })
    .then(membres => {
      membres.forEach((membre) => {

        const nbr_jour_rest = (moment(membre.fin)).diff(current, 'days');

        // console.log(moment(membre.fin).add(1, 'M').format("D-MM-YYYY"));
        if (nbr_jour_rest > 0) {

          membre.checkDate = true;
          membre.nbr_jour_rest = nbr_jour_rest;

        } else {
          membre.checkDate = false;
          membre.nbr_jour_rest = nbr_jour_rest;


        }
      });
      res.render("membres/membres", {
        membres: membres,
      });



    });
});






// Produits Index Page
app.get("/achats", ensureAuthenticated, (req, res) => {
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
app.get("/emplois", ensureAuthenticated, (req, res) => {
  Emploi.find({})
    .sort({
      date: "desc"
    })
    .then(jours => {
      res.render("emplois/emploi", {
        jours: jours
      });
    });
});

// // Add membre Form
app.get("/membres/add", ensureAuthenticated, (req, res) => {
  res.render("membres/add");
});

// EMPLOI DU TEMPS

app.get("/achats/add", ensureAuthenticated, (req, res) => {
  res.render("achats/add");
});

// EMPLOI DU TEMPS

app.get("/emplois/add", ensureAuthenticated, (req, res) => {
  const title = "Modification d'Emploi du temps d'entrainement";

  res.render("emplois/add", {
    tit: title
  });
});

// Edit membre Form
app.get("/membres/edit/:id", ensureAuthenticated, (req, res) => {
  Membre.findOne({
    _id: req.params.id
  }).then(membre => {
    res.render("membres/edit", {
      membre: membre
    });
  });
});

// Edit produit Form
app.get("/achats/edit/:id", ensureAuthenticated, (req, res) => {
  Produit.findOne({
    _id: req.params.id
  }).then(produit => {
    res.render("achats/edit", {
      produit: produit
    });
  });
});

// Edit emploi Form
app.get("/emplois/edit/:id", ensureAuthenticated, (req, res) => {
  Emploi.findOne({
    _id: req.params.id
  }).then(jour => {
    res.render("emplois/edit", {
      jour: jour
    });
  });
});

// Trouver membre Form
app.get("/trouver", ensureAuthenticated, (req, res) => {
  const userID = req.query.q;

  if (userID) {
    Membre.find({
      ID: userID
    }).then(membres => {
      membres.forEach((membre) => {

        const nbr_jour_rest = (moment(membre.fin)).diff(current, 'days');

        // console.log(moment(membre.fin).add(1, 'M').format("D-MM-YYYY"));
        if (nbr_jour_rest > 0) {

          membre.checkDate = true;
          membre.nbr_jour_rest = nbr_jour_rest;

        } else {
          membre.checkDate = false;
          membre.nbr_jour_rest = nbr_jour_rest;


        }
      });
      res.render("membres/membres", {
        membres: membres,
      });



    });

  }

});

// MEMBRE Process Form

app.post("/membres", ensureAuthenticated, (req, res) => {
  const newUser = {
    ID: req.body.ID,
    fin: req.body.fin,
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    ddn: moment(req.body.ddn).format("D-MM-YYYY"),
    phone: req.body.tele,
    typeS: req.body.typeS,
    typeC: req.body.typeC,
    sexe: req.body.sexe,
    avatar: req.body.avatar
  };



  new Membre(newUser).save().then(membre => {
    console.log(moment(req.body.jours).format("D-MM-YYYY"));

    res.redirect("/membres");
  });
});

// Produit Process Form

app.post("/achats", ensureAuthenticated, (req, res) => {
  const newProduit = {
    nom: req.body.nom,
    categorie: req.body.categorie,
    np: req.body.np,
    qte: req.body.qte,
    prix: req.body.prix,

    avatarP: req.body.avatarP
  };

  new Produit(newProduit).save().then(produit => {
    res.redirect("/achats");
  });
});

// Emploi Process Form

app.post("/emplois", ensureAuthenticated, (req, res) => {
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
app.put("/membres/:id", ensureAuthenticated, (req, res) => {
  Membre.findOne({
    _id: req.params.id
  }).then(membre => {
    // new values
    membre.ID = req.body.ID;
    membre.fin = req.body.fin;
    membre.nom = req.body.nom;
    membre.prenom = req.body.prenom;
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
app.put("/achats/:id", ensureAuthenticated, (req, res) => {
  Produit.findOne({
    _id: req.params.id
  }).then(produit => {
    // new values

    produit.nom = req.body.nom;
    produit.categorie = req.body.categorie;
    produit.qte = req.body.qte;
    produit.prix = req.body.prix;

    produit.np = req.body.np;

    produit.save().then(produit => {
      res.redirect("/achats");
    });
  });
});

// // Edit Form process Produits
app.put("/emplois/:id", ensureAuthenticated, (req, res) => {
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
app.delete("/membres/:id", ensureAuthenticated, (req, res) => {
  Membre.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect("/membres");
  });
});

// // Delete Produit
app.delete("/achats/:id", ensureAuthenticated, (req, res) => {
  Produit.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect("/achats");
  });
});

// user login route

app.get("/users/login", (req, res) => {
  res.render("users/login");
});

// user register route

app.get("/users/register", (req, res) => {
  res.render("users/register");
});

// login form post
app.post("/users/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// user register form post

app.post("/users/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password_2) {
    errors.push({
      text: "Les mots de passe ne correspondent pas"
    });
  }
  if (req.body.password.length < 4) {
    errors.push({
      text: "le mot de passe doit contenir au moins 4 caractères"
    });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      username: req.body.username,
      password: req.body.password,
      password_2: req.body.password_2
    });
  } else {
    User.findOne({
      username: req.body.username
    }).then(user => {
      if (user) {
        errors.push({
          text: "Ce nom d'utilisateur est déjà enregistré."
        });
        res.render("users/register", {
          errors: errors
        });
      } else {
        const newUser = {
          username: req.body.username,
          password: req.body.password
        };

        bcrypt.genSalt(10, function (req, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            new User(newUser).save().then(user => {
              res.redirect("/users/login");
            });
          });
        });
      }
    });
  }
});

// LOG OUT USER

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/users/login");
});


// Programmes entrainement //

app.get("/membres/pec", ensureAuthenticated, (req, res) => {
  const title = "Programme d'entrainements des pectoraux";
  res.render("membres/pec", {
    title: title
  });
});

app.get("/membres/dorso", ensureAuthenticated, (req, res) => {
  const title = "Programme d'entrainements de Dorso";
  res.render("membres/dorso", {
    title: title
  });
});

app.get("/membres/epaule", ensureAuthenticated, (req, res) => {
  const title = "Programme d'entrainements des epaules";
  res.render("membres/epaule", {
    title: title
  });
});

app.get("/membres/jambe", ensureAuthenticated, (req, res) => {
  const title = "Programme d'entrainements des jambes";
  res.render("membres/jambe", {
    title: title
  });
});

app.get("/membres/bras", ensureAuthenticated, (req, res) => {
  const title = "Programme d'entrainements des Bras";
  res.render("membres/bras", {
    title: title
  });
});


app.get("/membres/abs", ensureAuthenticated, (req, res) => {
  const title = "Programme d'entrainements des Abdos";
  res.render("membres/abs", {
    title: title
  });
});


// regime alinebtaire

app.get("/emplois/ecto", ensureAuthenticated, (req, res) => {
  const title = "Regime alimentaire pour Ectomorphe";
  res.render("emplois/ecto", {
    title: title
  });
});

app.get("/emplois/meso", ensureAuthenticated, (req, res) => {
  const title = "Regime alimentaire pour Mesomorphe";
  res.render("emplois/meso", {
    title: title
  });
});

app.get("/emplois/endo", ensureAuthenticated, (req, res) => {
  const title = "Regime alimentaire pour Endomorphe";
  res.render("emplois/endo", {
    title: title
  });
});

app.get("/emplois/norm", ensureAuthenticated, (req, res) => {
  res.render("emplois/ecto", {
    title: title
  });
});


app.get("/payer", ensureAuthenticated, (req, res) => {
  const title = "Plan du paiement";
  res.render("payer/payer", {
    title: title
  });
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});