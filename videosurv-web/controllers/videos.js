const fs = require('fs');
const http = require('http')
const axios = require('axios')
const { Recorder } = require('../utils/recorder');
const { unsubscribe, detectionStateSubscriber } = require('../utils/ros');





exports.sendLiveVideo = (req,res)=>
{
   
     http.get(`http://localhost:8000/live/${req.params.video}`, (stream) => {
         stream.pipe(res);
     }).on('error',(error)=>{
        res.status(500).send(error)
        console.log(error)
    })
}

exports.readRecording= (req,res)=>
{

     
    const range = req.headers.range;
    if(!range)
        res.status(400).send("Requires Range header");
    const videoPath = `public/videos/${req.params.video}`;
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    var filext = req.params.video.split('.');
    filext = filext[filext.length-1];

    const headers =
    {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": `video/${filext}`
    };

    res.writeHead(206, headers); 

} 


exports.saveLiveVideo = (req,res)=>
{

    let a = axios.default;
    a.get('http://localhost:8000/api/streams',{
        headers:{
       Authorization:`Basic ${process.env.NMS_TOKEN}`
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).send(err)
    }).then((data)=>{
        
        if (data.data.live)
        {
            var {subscribers, ...lives} = data.data.live
            lives = Object.entries(lives).map((e)=>( {[e[0]]: e[1]} ))

            lives.map(live=>{
                var name = Object.keys(live)[0]
                http.get(`http://localhost:8000/live/${name}.flv`, (stream) => {
            
                    var myFile = fs.createWriteStream(`${name}_${new Date().toISOString()}.flv`);
                    var recorder = null; 
                    if(!global.hasOwnProperty('recorders'))
                        global.recorders = {};

                    if (global.recorders[name])
                        recorder = global.recorders[name];
                    else 
                        recorder = new Recorder(null);

                    recorder.setStream(stream);
                    recorder.streamTo(myFile);

                    global.recorders[name] = recorder

        
                }).on('error',(error)=>{
                    res.status(500).send(error)
                    console.log(error)
                })
            });

            global.recorders.isRecording = true
            global.io.emit('normal-recording')
            res.status(200).send('ok')
            return
        }
        res.status(500).send('no video')


    })



   
}

exports.stopLiveVideo = (req,res)=>
{

    if(!global.hasOwnProperty('recorders'))
    {
        res.status(500).send('no video')
        return
    }

    unsubscribe().catch(err=>{console.log(err)})

    if(!global.recorders.isRecording)
    {
        res.status(200).send('ok')
        return
    }
    

    let a = axios.default;
    a.get('http://localhost:8000/api/streams',{
        headers:{
       Authorization:`Basic ${process.env.NMS_TOKEN}`
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).send(err)
    }).then((data)=>{
        
        if (data.data.live)
        {
            var {subscribers, ...lives} = data.data.live
            lives = Object.entries(lives).map((e)=>( {[e[0]]: e[1]} ))
            lives.map(live=>{
                var name = Object.keys(live)[0]
                http.get(`http://localhost:8000/live/${name}.flv`, (stream) => {

                    if (global.recorders[name])
                        global.recorders[name].stop();
                    
                }).on('error',(error)=>{
                    res.status(500).send(error)
                    console.log(error)
                })
            })
            global.io.emit('stop-recording')
            res.status(200).send('ok')
            return
        }
        res.status(500).send('no video')
    })
}

exports.videoList = (req, res) =>
{
    console.log('list')
    let a = axios.default;
    a.get('http://localhost:8000/api/streams',{
        headers:{
       Authorization:`Basic ${process.env.NMS_TOKEN}`
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).send(err)
    }).then((data)=>{
        
        res.send(data.data)
    })

}





exports.handleAlarm= (req,res)=>{
    cameraId = req.body.cameraId
    console.log(`ALARM ACTIVATED ${cameraId}`)
    if(global.hasOwnProperty('recording_mode'))
        if(global.recording_mode == 2)
        {
            http.get(`http://localhost:8000/live/${cameraId}.flv`, (stream) => 
            {

                var myFile = fs.createWriteStream(`${cameraId}_${new Date().toISOString()}.flv`);
                var recorder = new Recorder(null);
                if(!global.hasOwnProperty('recorders'))
                    global.recorders = {};

                if (global.recorders[cameraId])
                    recorder = global.recorders[cameraId];
               

                recorder.setStream(stream);
                recorder.streamTo(myFile);
                console.log('recording on alarm')
                global.recorders[cameraId] = recorder

                setTimeout(()=>{
                    recorder.stop()
                    console.log('recording stopped')
                },parseInt(process.env.RECORDING_DURATION))

                res.send('recording')
                return
            }).on('error',(error)=>{
                res.status(500).send(error)
                console.log(error)
                return
            })
        }
    res.send('ok')
    

}

exports.smartRecordingVideo =(req,res)=>
{
    global.recording_mode = 2;
    res.send('ok')
}






exports.changeRecordState = (arg,callback) =>
{
    
}
