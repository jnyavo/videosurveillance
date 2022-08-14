const User = require('../models/user')

const success = (data,res)=>
{
    res.send(data)
}
const error = (err,res)=>
{
    res.status(400)
    res.send(err)

}

exports.getUser = async (req,res) =>
{
    
    new User({}).findOne(req.params.id)
        .then(data=>success(data,res))
        .catch(err=>error(err,res))
}

exports.getUsers = (req,res) =>
{
    new User({}).findAll(req.query)
        .then(data=>success(data,res))
        .catch(err=>error(err,res))

    
}

exports.delete= (req,res) =>
{
    new User({}).delete(req.query)
        .then(data=>success(data,res))
        .catch(err=>error(err,res))
}

exports.updateUser = (req,res) =>
{
    new User({}).update(req.body)
        .then(data=>success(data,res))
        .catch(err=>error(err,res))
}

exports.addUser = (req,res) =>
{
    
    new User(req.body).create()
        .then(data=>success(data,res))
        .catch(err=>error(err,res))
}