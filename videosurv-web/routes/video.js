const express = require("express");
const router = express.Router();
const videoController = require('../controllers/videos')
const {checkUserLog} = require('../middleware/auth')

router.get('/live/:video',checkUserLog, videoController.sendLiveVideo);


router.get('/list', videoController.videoList)


router.get('/start',videoController.saveLiveVideo)

router.get('/stop',videoController.stopLiveVideo)

module.exports = router;