const {videoServiceClient} = require('../utils/ros')

exports.sendToCameraService = (args,callback) => {

    const {cameraId,options} = args

    var request = JSON.stringify({
        Authorization:process.env.ROS_AUTH,
        METHOD:options.method,
        query:options.query
    })
    var parameters = JSON.stringify({
        value:options.value
    })
    console.log('calling service')
    
    videoServiceClient(cameraId).call({request,parameters}).then(data=>{
        console.log(data);
        callback(data)
    }).catch(err=>{
        console.log(err)
        callback({error:err})
    })
 
}

