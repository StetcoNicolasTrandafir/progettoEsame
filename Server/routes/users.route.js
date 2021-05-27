const express = require('express')

//puntando a '../controllers' recupera il file index.js in /controllers che a sua evolta espone userController. E' fatto perché se ho più moduli sotto controllers non li devo importare uno a uno
const { userController } = require('../controllers')

const router = express.Router()


router.post('/prova', userController.prova);
//vado a risolvere la chiamata all'api /:id/getInfo tramite il controller userController
router.post('/login', userController.login);
router.post('/getUser', userController.getUser);
router.post('/controlloToken', userController.controlloToken);
router.post('/signUp', userController.signUp);
router.post('/processUpFile', userController.processUpFile);
router.post('/changePassword', userController.changePassword);
router.post('/updateUser', userController.updateUser);
router.post('/provaCrittografia', userController.provaCrittografia);


module.exports = router




