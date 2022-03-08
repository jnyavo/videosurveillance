const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE

});

//Affichage de index.hbs 
router.get("/", (req,res) => {
    if(req.session.username)
    {
        //l'utilisateur s'est  déjà loggé
        res.redirect('/home');
        return;
    }

    res.render("index", {message: req.session.message});
    req.session.message = null;
});

//Affichage de register.hbs
router.get("/register", (req,res) => {
    res.render("register",{
        message: req.session.message, 
        form: req.session.form
    });
    req.session.message = null;
    req.session.form = null;
});

//Affichage page principale
router.get("/home",(req,res) => {
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }

    res.render('home', {username: req.session.username});
});

router.get("/register-admin",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    res.render('register-admin',{username: req.session.username});
});
router.get("/me",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    db.query("SELECT * FROM users WHERE username=?",[req.session.username],(error,results)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log(results);
            res.render('register-admin',{username: req.session.username, form: results[0],message: req.session.message});
        }
        
    });
    
});

router.get("/liste",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    
    db.query("SELECT equipement.id_equipement, categorie.libelle AS libelle_categorie, equipement.libelle as libelle_equipement FROM equipement INNER JOIN categorie ON equipement.id_categorie = categorie.id_categorie",(error,results)=>{
        if(error)
        {
            console.log(error);
            res.render('liste',{username: req.session.username});
        }
        else
        {
            res.render('liste',{username: req.session.username,equipements: results});
        }
            
    });
    
});

router.get("/liste-categorie",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    db.query("SELECT * FROM categorie",(error,results)=>{
        res.render("liste-categorie",{categories: results});
    })
})

router.get("/equipement",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    res.render("historique",{username: req.session.username, id:req.query.id});
})

module.exports = router;

