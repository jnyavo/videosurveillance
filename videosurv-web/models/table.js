const {db} = require('../utils/mysql')

module.exports = class Table
{
    
    fields =
    {
        id:null
    }
    tablename = 'table'
/**
 * 
 * @param {Object} fields object containing the fields
 */
    constructor(fields)
    {
        this.setFields(fields)
        
    }

    setFields(fields)
    {
        
        this.fields = fields
        
        
    }
    getFields()
    {
        return this.fields
    }
    callback = (err,res,resolve,reject) =>
    {
        if (err)
            reject(err)
        resolve(res)
            
    }

    findOne(id)
    {
        
        // l'id doit être le premier attribut
        var idname = Object.keys(this.fields)[0]

        return new Promise((resolve,reject)=>
        {
            db.query(`SELECT * FROM ${this.tablename} WHERE ${idname}=?`,[id],
            (err,res)=>this.callback(err,res,resolve,reject))
        })
        
    }

    findAll(where=null)
    {
        return new Promise((resolve,reject)=>
        {
            if (where && (Object.keys(where).length > 0))
            {    
                db.query(`SELECT * FROM ${this.tablename} WHERE ?`,where,
                (err,res)=>this.callback(err,res,resolve,reject))
            }
            else
                db.query(`SELECT * FROM ${this.tablename}`,
                (err,res)=>this.callback(err,res,resolve,reject))
        })
    }

    update(fields=null)
    {
        if (fields == null)
            fields = this.fields
        
            // l'id doit être le premier attribut
        idname = Object.keys(this.fields)[0]
        
        return new Promise((resolve,reject)=>
        {
            db.query(`UPDATE ${this.tablename} SET ? WHERE ${idname}=?`,[fields,fields[idname]],
            (err,res)=>this.callback(err,res,resolve,reject))
        })
    }

    delete(where)
    {
        return new Promise((resolve,reject)=>
        {
            
            db.query(`DELETE FROM ${this.tablename} WHERE ?`,where,
            (err,res)=>this.callback(err,res,resolve,reject))
            
        })
    }
    create(fields=null)
    {
        if (fields == null)
            fields = this.fields

        return new Promise((resolve,reject)=>{
            db.query(`INSERT INTO ${this.tablename} SET ?`,fields,
            (err,res)=>this.callback(err,res,resolve,reject))
        })
    }
}