const express = require('express')
const { chatController } = require('../controllers')

//puntando a '../controllers' recupera il file index.js in /controllers che a sua evolta espone userController. E' fatto perché se ho più moduli sotto controllers non li devo importare uno a uno
const router = express.Router();

//vado a risolvere la chiamata all'api /:id/getInfo tramite il controller userController
router.post('/getMessagesByReceiver', chatController.getMessagesByReceiver);
router.post('/sendMessage', chatController.sendMessage);
router.post('/makeMatch', chatController.makeMatch);
router.post('/getChats', chatController.getChats);
router.post('/startChat', chatController.startChat);

module.exports = router
