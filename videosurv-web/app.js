
//Importation des librairies
const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const hbs = require("hbs");
const NodeMediaServer = require('node-media-server');

//Importation des configurations dans le fichier .env
dotenv.config({
    path: "./.env"
});

//Création de la connection BD
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE

});

const publicDir = path.join(__dirname, './public');



//Connection à la BD
db.connect( (error) => {
    if (error)
        console.log(error);
    else
        console.log("Msql connecté")
} );

//Creation du serveur web
const app = express();

//utiliser le dossier 'public'
app.use(express.static(publicDir));

//rendre lisible les données POST
app.use(express.urlencoded({ extended: false }));

//rendre lisible les données json reçu
app.use(express.json());

//utiliser cookie-parser pour la gestion des cookies
app.use(cookieParser());

//initialisation de la session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

//Utilisation de hbs pour l'affichage html
app.set('view engine', 'hbs');

//Specification de l'emplacement des partials
hbs.registerPartials(__dirname + '/views/partials');

/*
app.get("/", (req,res) => {
    res.render("index");
});
app.get("/register", (req,res) => {
    res.render("register");
})
*/


//Utilisation du fichier route pages.js pour si l'utilisateur veut aller dans '/'
app.use("/", require("./routes/pages"));

//Utilisation du fichier route auth.js pour si l'utilisateur veut aller dans '/auth'
app.use("/auth", require("./routes/auth"));

//Route pour les requetes crate
app.use("/crate",require("./routes/crate"));

//Route pour les requetes sql
app.use("/sql",require("./routes/sql"));


app.use("/video",require("./routes/video"));

app.listen(5000, () => {
    console.log("Server started on Port 5000");
});




const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: 'localhost'
  }
};

var nms = new NodeMediaServer(config)
nms.run();