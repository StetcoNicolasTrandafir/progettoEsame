const express = require('express')

//puntando a '../controllers' recupera il file index.js in /controllers che a sua evolta espone userController. E' fatto perché se ho più moduli sotto controllers non li devo importare uno a uno
const { userController } = require('../controllers')

const router = express.Router()


router.post('/prova/1', userController.prova);


router.post('/signUp/checkCredentials', userController.signUpCheckCredentials);
router.post('/signUp/insertUser', userController.signUpInsertUser);
router.post('/login', userController.login);
router.post('/getUser', userController.getUser);
router.post('/controlloToken', userController.controlloToken);
router.post('/processUpFile', userController.processUpFile);
router.post('/changePassword', userController.changePassword);
router.post('/updateUser', userController.updateUser);
router.post('/updatePosition', userController.updatePosition);
router.post('/updatePicture', userController.updatePicture);



module.exports = router




