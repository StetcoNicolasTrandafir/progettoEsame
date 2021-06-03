const express = require('express')

//puntando a '../controllers' recupera il file index.js in /controllers che a sua evolta espone userController. E' fatto perché se ho più moduli sotto controllers non li devo importare uno a uno
const { questionController } = require('../controllers')

const router = express.Router()

//vado a risolvere la chiamata all'api /:id/getInfo tramite il controller userController

router.post('/insertQuestion', questionController.insertQuestion);
router.post('/insertAnswer', questionController.insertAnswer);
router.post('/getQuestions', questionController.getQuestions);
router.post('/getQuestionsByUser', questionController.getQuestionsByUser);
router.post('/getQuestionsByCategories', questionController.getQuestionsByCategories);
router.post('/getAnswersByUser', questionController.getAnswersByUser);
router.post('/getAnswersByQuestion', questionController.getAnswersByQuestion);
router.post('/getRecivedAnswer', questionController.getRecivedAnswer);
router.post('/getCategories', questionController.getCategories);
router.post('/getMyCategories', questionController.getMyCategories);
router.post('/handleRequest', questionController.handleRequest);
router.post('/getBlackList', questionController.getBlackList);
router.post('/updateBlackList', questionController.updateBlackList);
router.post('/updateQuestionState', questionController.updateQuestionState);
router.post('/addFavouriteAnswer', questionController.addFavouriteAnswer);
router.post('/removeFavouriteAnswer', questionController.removeFavouriteAnswer);




module.exports = router
