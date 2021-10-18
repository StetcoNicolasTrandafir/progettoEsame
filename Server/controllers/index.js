//recupero il controller degli utenti
const userController = require('./users.controller')
const chatController = require('./chat.controller')
const questionController = require('./question.controller')

module.exports = {
    userController,
    questionController,
    chatController
}
