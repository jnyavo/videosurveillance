//importation des dependances
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//mise en place de connexion bd
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE

});


//fonction login à importer
const login =   (req) => {

    return new Promise((resolve) => {
        try {
            const {username, password} = req.body;
            
              db.query("SELECT * FROM users WHERE username = ? ",[username], async (error,results) => {
               
                if(results.length == 0 || !( await bcrypt.compare(password, results[0].password) ))
                {
                    /* req.session.message = "Username ou mots de passe incorrect";
                    res.redirect('/'); */
                    
                    resolve(false);
                }
                else
                {
                    const user = {id: results[0].id, username: username};
    
                    // Création du token
                    /* const token =  jwt.sign({ user },process.env.JWT_SECRET, {
                        expiresIn : process.env.JWT_EXPIRATION
                    }); */
    
                   
                    resolve(username);
                    /* req.session.username = username
                    res.status(200).redirect('/home'); */
                    
                }
            });
        } catch (error) {
            console.log(error);
        }
    })
    
}

exports.grant = async (req,res) =>
{
    let reponse = await login(req);
    
    if(!reponse)
    {
        req.session.message = "Username ou mots de passe incorrect";
        res.redirect('/');
    }
    else
    {
        
        req.session.username = reponse;
        res.status(200).redirect('/home'); 
    }
    

}


//Fonction register à importer : insertion dans la BD 
exports.register = async (req,res) => {
    const {lname, fname, username, email, password, cpassword} = req.body;

    //hashage du mots de passe
    let hashedPassword = await bcrypt.hash(password,8);
    console.log(hashedPassword);

    db.query("INSERT INTO users SET ?", {username: username, password: hashedPassword, lname, fname, email}, (error,results) =>{

        if (error)
        {
            if (error.code == 'ER_DUP_ENTRY')
            {
                req.session.message = "Le nom d'utlilisateur existe déjà";
                req.session.form = req.body;
                
            } 
            else
            {
                req.session.message = error.code.concat(': ',error.sqlMessage);
                req.session.form = req.body;
            }
            res.redirect('/register');
        }
        else
        {
            req.session.message = "Utilisateur enregistré";
            res.redirect('/');
        }
    });


    
};

exports.modify = async (req,res) => {
    const {lname, fname, username, email, oldpassword, password} = req.body;
    log = {body:{username,password:oldpassword}}
    if(await login(log))
    {
        entry = {lname,fname,username,email}
        if(password)
        {
            let hashedPassword = await bcrypt.hash(password,8);
            entry.password = hashedPassword;
        }
            
        console.log(entry);
    
        db.query("UPDATE users SET ? WHERE username=?", [entry,username], (error,results) =>{
    
            if (error)
            {
                if (error.code == 'ER_DUP_ENTRY')
                {
                    req.session.message = "Le nom d'utlilisateur existe déjà";
                    
                    
                } 
                else
                {
                    req.session.message = error.code.concat(': ',error.sqlMessage);
                    
                }
                res.redirect('/me');
            }
            else
            {
                req.session.message = "Utilisateur enregistré";
                res.redirect('/me');
            }
        });
    }
    


}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};


