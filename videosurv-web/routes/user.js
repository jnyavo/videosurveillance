const express = require("express");
const authControler = require("../controllers/auth");
const {checkUserLog} =require('../middleware/auth')
const router = express.Router();
const userController = require('../controllers/users');


router.get('/:id',checkUserLog,userController.getUser)
router.get('/all',checkUserLog,userController.getUsers)
router.post('/',checkUserLog,userController.addUser)
router.put('/',checkUserLog,userController.updateUser)
router.delete('/',checkUserLog,userController.delete)


module.exports = router