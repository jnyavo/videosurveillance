const express = require("express");
const router = express.Router();
const mysql = require("mysql");

//mise en place de connexion bd
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE

});
/*
router.get("/test",(req,res)=>{
    db.query("INSERT INTO categorie SET ?", {libelle: "testtest"},(error,result)=>{
        if(error)
            console.log(error);
        else
            console.log(result);
    });
})
*/
router.get("/equipement", (req,res) => {
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.redirect('/');
        return;
    }

    db.query("SELECT * FROM equipement",(error,results)=>{
        res.send(JSON.stringify(results));
    });
});

router.get("/categorie",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.redirect('/');
        return;
    }
    db.query("SELECT * FROM categorie",(error,results)=>{
        res.send(JSON.stringify(results));
    });
});

router.get("/categorie/:id",(req,res)=>{
  
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.redirect('/');
        return;
    }

   
    db.query("SELECT * FROM categorie WHERE id_categorie=?",[req.params.id],(error,results)=>{
        res.send(JSON.stringify(results));
    })
})

router.delete("/categorie/:id",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.redirect('/');
        return;
    }
    db.query("DELETE FROM categorie WHERE id_categorie=?",[req.params.id],(error,results)=>{
        if(error)
            res.status(400).send(JSON.stringify(error));
        else
            res.send(JSON.stringify(results));
    })
})

router.put("/categorie",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.redirect('/');
        return;
    }
    const {id_categorie,libelle} = req.body;
    db.query("UPDATE categorie SET ? WHERE ?",[{libelle},{id_categorie}],(error,results) =>{
        res.send(JSON.stringify(results));
    })
})

router.post("/suppression",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.redirect('/');
        return;
    }
    const {id_equipement} = req.body;
    
    db.query("DELETE FROM equipement WHERE id_equipement=?",[id_equipement],(error,results)=>{
        if(error)
        {
            res.send(error);
        }
        else
            res.redirect('/liste');
    });
});


router.post("/equipment",(req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.redirect('/');
        return;
    }
    const {ins_id,ins_categorie,nouveau_categorie,ins_libelle} = req.body;
    
    
    if(parseInt(ins_categorie) != 0)
        db.query("INSERT INTO equipement SET ?",{id_equipement: ins_id,id_categorie: ins_categorie,libelle: ins_libelle },(error,results)=>{
        
            if (error)
            {
                if (error.code == 'ER_DUP_ENTRY')
                {
                    db.query("UPDATE equipement SET ?",{id_categorie: ins_categorie,libelle: ins_libelle},(error,results)=>{
                        if(error)
                        {
                            console.log(error);
                            res.send(JSON.stringify(error));
                        }
                        else
                        {
                            res.status(200).send(JSON.stringify(results));
                            console.log(results);
                        }
                            
                    });
                    
                } 
                else
                {
                    res.send(JSON.stringify(error));
                }
            }
            else
                res.status(200).send(JSON.stringify(results));
        });
    else
        db.query("INSERT INTO categorie SET ?", {libelle: nouveau_categorie},(error,result)=>{
            if(error)
                res.send(JSON.stringify(error));
            else
            {
                db.query("INSERT INTO equipement SET ?",{id_equipement: ins_id,id_categorie: result.insertId ,libelle: ins_libelle },(error,results)=>{
            
                    if (error)
                    {
                        if (error.code == 'ER_DUP_ENTRY')
                        {
                            db.query("UPDATE equipement SET ?",{id_categorie: result.insertId ,libelle: ins_libelle},(error,results)=>{
                                if(error)
                                {
                                    res.send(JSON.stringify(error));
                                }
                                else
                                    res.status(200).send(JSON.stringify(results));
                            });
                            
                        } 
                        else
                        {
                            res.send(JSON.stringify(error));
                        }
                    }
                    else
                        res.status(200).send(JSON.stringify(results));
                });
            }
                
        });
});

module.exports = router;

