const express = require('express');
const usersRoute = require('./users.route');
const chatRoute = require('./chat.route');
const questionRoute = require('./question.route');

const routerUser = express.Router();
//il modulo router va a delegare la dichiarazione delle chiamate relative all'utente (middleware '/user') al modulo userRoute
routerUser.use('/user', usersRoute);

const routerQuestion = express.Router();
routerQuestion.use('/question', questionRoute);

const routerChat = express.Router();
routerChat.use('/chat', chatRoute );


//se voglio un altro middlewere (es: product) devo creare un altro file products.route.js, importarlo e inserire qui solo router.user('/product', productRoute);
module.exports = [
    routerUser,
    routerChat,
    routerQuestion
];
// module.exports = routerQuestion;
//module.exports = routerChat;
