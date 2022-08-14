
const videoService = 
{
    getVideoList: () =>
{
    return new Promise((resolve,reject)=>{
        axios.get(`${window.location.protocol}//${window.location.host}/video/list`).then(data=>resolve(data.data))
            .catch(err=>reject(err))
    })
}
,
    sendOptions: (videoId,options) =>
{
    
    return new Promise((resolve,reject)=>{
        socket.emit('camera-options',{cameraId:videoId,options},(data)=>{
            if (data.error)
            {
                reject(data.error);
                return;
            }
            resolve(data)
        })
    })
    
}
,

    sendRecordingState:(videoId,options)=>new Promise((resolve,reject)=>{
        socket.emit('recording-state',{cameraId:videoId,options},(data)=>{
            if(data.error)
            {
                reject(data.error);
                return
            }
            resolve(data);
        })
    })
    
}



