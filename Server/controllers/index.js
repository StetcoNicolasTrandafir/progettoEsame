//recupero il controller degli utenti
const userController = require('./users.controller')
const chatController = require('./chat.controller')
const questionController = require('./question.controller')
// const chatController = require('./chat.controller')

//se voglio creare un nuovo controller (es product) devo creare un nuovo file products.controller.js, importarlo qui ed esportlo in module.exports
//solo così potrò importarli negli altri files come const { userController, productController } = require('../controllers')

module.exports = {
    userController,
    questionController,
    chatController
}
