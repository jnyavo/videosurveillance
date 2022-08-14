
//Importation des librairies
const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const hbs = require("hbs");
const NodeMediaServer = require('node-media-server');
const {Server} = require('socket.io');
const http = require('http');
const socketRouter = require('./routes/optionSocket');
const cors = require('cors')
const localtunnel = require('localtunnel');
const { checkSocketAuth } = require("./middleware/auth");

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
        console.log("Msql connected")
} );

//Creation du serveur web
const app = express();

app.use(cors())

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


//Utilisation du fichier route pages.js pour si l'utilisateur veut aller dans '/'
app.use("/", require("./routes/pages"));

//Utilisation du fichier route auth.js pour si l'utilisateur veut aller dans '/auth'
app.use("/auth", require("./routes/auth"));


app.use("/video",require("./routes/video"));


app.use('/user',require('./routes/user'));

app.use('/alarm',require('./routes/alarm'))


const server = http.createServer(app);
const io = new Server(server)

if (!global.hasOwnProperty('io'))
  global.io = io


io.use(checkSocketAuth)

io.on('connection',socketRouter);




server.listen(process.env.PORT || 5000,()=>{
  console.log("Server started on Port 5000");
})





const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    hostname:'127.0.0.1',
    port: 8000,
    allow_origin: '127.0.0.1'
  },
  auth: {
    api : true,
    api_user: 'admin',
    api_pass: 'nms2018',
  }
};

var nms = new NodeMediaServer(config)
nms.run();
nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});



//Localtunnel pour visibilité en ligne
localtunnel({subdomain:process.env.TUNNEL_SUBDOMAIN,port:5000}).then((tunnel)=>{
  console.log(`tunnel ready at ${tunnel.url}`)
}).catch(error=>console.log(error))
