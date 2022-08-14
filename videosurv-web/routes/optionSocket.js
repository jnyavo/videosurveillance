const rosControllers = require('../controllers/ros')
const videoControllers = require('../controllers/videos')

module.exports = socket => {
    console.log(socket.handshake.address + ' connected to socket');
    socket.on("camera-options",rosControllers.sendToCameraService)
    socket.on('recording-state',videoControllers.changeRecordState)
}