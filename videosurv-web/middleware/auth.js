const jwt = require("jsonwebtoken");


exports.checkUserLog = (req,res,next) =>
{
    if(!req.session.username)
    {
        //l'utilisateur s'est pas déjà loggé
        res.status(403)
        res.send('not authenticated')
        return;
    }
    next()
}

exports.checkSocketAuth = (socket,next)=>
{
    
    jwt.verify(socket.handshake.auth.token,process.env.JWT_SECRET,function (err,decoded){
        if(err)
        {
            next(new Error('not authenticated'))
            return
        }
        
        next()

    })
}

exports.checkCredentials = (req,res,next)=>{
    var auth = req.get('Authorization')
  
    if (auth)
    {
        auth = auth.split(' ')[1];
        jwt.verify(auth,process.env.ROS_JWT_SECRET || 'secret',function(err,decoded){
            if(err)
            {
                res.status(403).send('not authenticated')
                return
            }
            next()
        })
    }
    else
        res.status(403).send('not authenticated')
}
