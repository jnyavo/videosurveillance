const rosnodejs = require('rosnodejs')

rosnodejs.initNode('/webServer').then(()=>{
    console.log('ROS Node initialised')
}).catch(err=>console.log(err))


if(!global.hasOwnProperty('nh'))
    global.nh = rosnodejs.nh


exports.videoServiceClient =(id=null)=>rosnodejs.nh.serviceClient(`/video_service${id ? id:''}`,'video_pkg/videosrv')
exports.detectionStateSubscriber =(callback=(msg,len,nodeUri)=>{})=>global.nh.subscribe('/detection_state','std_msgs/String',callback)
exports.unsubscribe = ()=>global.nh.unsubscribe('/detection_state')