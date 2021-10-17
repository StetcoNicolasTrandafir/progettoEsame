const express = require('express')

//puntando a '../controllers' recupera il file index.js in /controllers che a sua evolta espone userController. E' fatto perché se ho più moduli sotto controllers non li devo importare uno a uno
const { userController } = require('../controllers')

const router = express.Router()


router.post('/prova/1', userController.prova);


router.post('/signUp/personalData', userController.signUpPersonalData);
// router.post('/signUp/ID', userController.signUpID);
router.post('/signUp/profile', userController.signUpProfile);
router.post('/signUp/undo', userController.undoSignUp);
router.post('/login', userController.login);
router.post('/getUser', userController.getUser);
router.post('/controlloToken', userController.controlloToken);
router.post('/processUpFile', userController.processUpFile);
router.post('/changePassword', userController.changePassword);
router.post('/updateUser', userController.updateUser);
router.post('/updatePosition', userController.updatePosition);
router.post('/updatePicture', userController.updatePicture);
router.post('/provaCrittografia', userController.provaCrittografia);


module.exports = router




