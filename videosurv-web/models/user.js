const {db} = require('../utils/mysql')
const Table = require('./table')
const bcrypt = require("bcryptjs");

module.exports = class User extends Table
{
    

    tablename = 'users';

    /**
     * 
     * @param {Object} fields object containing the fields
     */
    constructor(fields)
    {
        super(fields)
        if (Object.keys(fields).length == 0)
            this.fields = 
            {
                id:null,
                username:null,
                password:null,
                superuser:null,
                email:null,
                lname:null,
                fname:null
            }
    }
    
    update(fields=null)
    {
        if (fields)
            this.setFields(fields)
        var updateData = this.fields
        if(this.fields.password == null)
            delete updateData.password
        
            
        
        return new Promise((resolve,reject)=>
        {
            db.query(`UPDATE ${this.tablename} SET ? WHERE username=?`,[updateData,updateData.username],
            (err,res)=>this.callback(err,res,resolve,reject))
        })
    }
    create(fields=null)
    {
        if (fields==null)
            fields = this.fields
        
        const {password,...all} = fields
        
        return new Promise((resolve,reject)=>{
            bcrypt.hash(password.toString(),8)
            .then(hashedPassword=>super.create({...all,password:hashedPassword})
                                        .then(data=>resolve(data))
                                        .catch(err=>reject(err)))
            .catch(err=>reject(err))
        })
        

        
            
        
    }

}