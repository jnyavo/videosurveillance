
var socket = {}

authServices.getSocketAuth().then(data=>{
    socket = io(window.location.host,{auth:{token:data}})
}).catch(err=>console.log(err))






function setOptionListeners()
{
    var alarm = document.getElementById('alarm_state')
    var sound = document.getElementById('sound_detection_state')
    var sensitivity = document.getElementById('sensitivity_value')
    var recording = document.getElementById('recording_state')

    alarm.addEventListener('input',(e)=>{
        videoService.sendOptions(null,{
            method:'MODIFY',
            query:'detection',
            value:alarm.checked
        }).catch(err=>{console.log(err);alarm.checked = !alarm.checked})
    })
    sound.addEventListener('input',(e)=>{
        videoService.sendOptions(null,{
            method:'MODIFY',
            query:'sound',
            value:alarm.checked
        }).catch(err=>{console.log(err);sound.checked = !sound.checked})
    })


    sensitivity.addEventListener('input',(e)=>{
        videoService.sendOptions(null,{
            method:'MODIFY',
            query:'sensitivity',
            value:sensitivity.value
        })
    })
    recording.addEventListener('change',(e)=>{
        videoService.sendRecordingState(null,{
            state:recording.value
        })
    })
}


function updateOptions()
{
    var alarm = document.getElementById('alarm_state')
    var sound = document.getElementById('sound_detection_state')
    var sensitivity = document.getElementById('sensitivity_value')
    var recording = document.getElementById('recording_state')

    videoService.sendOptions(null,{
        method:'GET',
        query:'detection',
        value:null
    }).then(data=>{
        alarm.checked = data.value
    }).catch(err=>console.log(err))

    videoService.sendOptions(null,{
        method:'GET',
        query:'sound',
        value:null
    }).then(data=>{
        sound.checked = data.value
    }).catch(err=>console.log(err))

    videoService.sendOptions(null,{
        method:'GET',
        query:'sensitivity',
        value:null
    }).then(data=>{
        sensitivity.checked = data.value
    }).catch(err=>console.log(err))

   


}

window.addEventListener("load", function () {

    // select parent of dish
    var scenary = document.getElementsByClassName('Scenary')[0];
    
    setOptionListeners()

    // create dish

    var dish = null;
    var controls = null;

    videoService.getVideoList().then(data=>{
        var {subscribers, ...lives} = data.live
        lives = Object.entries(lives).map((e)=>( {[e[0]]: e[1]} ))
        dish = new Dish(scenary,lives);

        // set controls (optional)
        controls = new Controls(dish, scenary);
        controls.append();
    
        // render dish
        dish.append();
    
        // resize the cameras
        dish.resize()
    
    }).catch(err=>{
        dish = new Dish(scenary);
        controls = new Controls(dish, scenary);
        controls.append();
        dish.append();
        dish.resize()
        console.log(err)
    })


    


    // resize event of window
    /*window.addEventListener("resize", function () {

        // resize event to dimension cameras
        dish.resize();

    });
    */

}, false);


