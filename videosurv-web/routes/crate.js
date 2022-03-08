const express = require("express");
const { Client } = require('pg')

const router = express.Router();
const url = `postgresql://crate@${process.env.CRATE}:5432/doc`;

router.get('/equipement', async (req,res)=>{
    
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    
    try {
        const client = new Client({connectionString: url});
        await client.connect();
        var query = "SELECT *  FROM ( SELECT *, ROW_NUMBER() OVER(PARTITION BY id ORDER BY timestamp DESC) Corr FROM equipement_historique ) AS CTE WHERE Corr = 1 ";
        let resultat  = await client.query(query)
        client.end();
        res.send(resultat);
    } catch (error) {
        res.send(error);
    }
    

        
});

router.get("/equipement/:id", async (req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    try {
        const client = new Client({connectionString: url});
        await client.connect();
        between = "";
        
        if(req.query.fin)  
            if (req.query.debut)
                between = `AND timestamp::bigint BETWEEN ${req.query.debut} AND ${req.query.fin}`;
            else
                between = `AND timestamp::bigint < ${req.query.fin}`;
        else 
            if(req.query.debut)
                between = `AND timestamp::bigint > ${req.query.debut}`;
            


            
        var query = `SELECT id,position,salle,timestamp::bigint as timestamp FROM equipement_historique WHERE id=? ${between} ORDER BY TIMESTAMP DESC LIMIT 100`;
        let resultat  = await client.query(query,[req.params.id]);
        client.end();
        res.send(resultat);
    } catch (error) {
        res.send(query);
        
    }
})

router.post('/suppression', async (req,res)=>{
    
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    
    try {
        const client = new Client({connectionString: url});
        await client.connect();
        const {id_equipement} = req.body;
        var query = "DELETE FROM equipement_historique WHERE id=?";
        let resultat  = await client.query(query,[id_equipement])
        client.end();
        res.send(resultat);
        console.log("suppression de " + id_equipement);
    } catch (error) {
        res.send(error);
        console.log(error);
        
    }
    

        
});

router.delete("/equipement/:id", async (req,res)=>{
    if(!req.session.username)
    {
        //l'utilisateur ne s'est pas loggé
        res.status(401).redirect('/');
        return;
    }
    try {
        const client = new Client({connectionString: url});
        await client.connect();
        between = "";
        
        if(req.query.fin)  
            if (req.query.debut)
                between = `AND timestamp::bigint BETWEEN ${req.query.debut} AND ${req.query.fin}`;
            else
                between = `AND timestamp::bigint < ${req.query.fin}`;
        else 
            if(req.query.debut)
                between = `AND timestamp::bigint > ${req.query.debut}`;
            


            
        var query = `DELETE FROM equipement_historique WHERE id=? ${between}`;
        let resultat  = await client.query(query,[req.params.id]);
        client.end();
        res.send(resultat);
    } catch (error) {
        res.send(query);
        
    }
})


module.exports = router;