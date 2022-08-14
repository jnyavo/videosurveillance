const express = require("express");
const authControler = require("../controllers/auth");
const { checkUserLog } = require("../middleware/auth");
const router = express.Router();

router.post('/register', authControler.register);
router.post('/login', authControler.grant);
router.get('/logout',authControler.logout);
router.post('/modify',authControler.modify);
router.get('/socketauth',checkUserLog,authControler.sendSocketAuth)

module.exports = router;