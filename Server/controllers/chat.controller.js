const { chatService } = require("../services")
const jwt = require("jsonwebtoken");
const fs = require('fs');
const privateKey = fs.readFileSync("keys/private.key", "utf8");
const ERRORS = require('errors');


ERRORS.create({
    code: 603,
    name: 'TOKEN_EXPIRED',
    defaultMessage: 'Token is expired'
});

ERRORS.create({
    code: 604,
    name: 'TOKEN_DOESNT_EXIST',
    defaultMessage: 'Token doesnt exist'
});

const getMessagesByReceiver= async (req, res, next)=>{
    let ctrlToken = await controllaToken(req, res);

    let utente = ctrlToken.payload._id;
    let destinatario = req.body.destinatario;

    try {
        const risultato = await chatService.getMessagesByReceiver(utente, destinatario,ctrlToken.payload.user, req, res);
        res.send(risultato);
        next();
    } catch(e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}


const sendMessage= async (req, res, next)=>{
    let ctrlToken = await controllaToken(req, res);

    let utente = ctrlToken.payload._id;
    let destinatario = req.body.destinatario;
    let testo = req.body.testo;

    try {
        const risultato = await chatService.sendMessage(testo,utente, destinatario,ctrlToken.payload.user, req, res);
        res.send(risultato);
        next();
    } catch(e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const getChats = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    try {
        const risultato = await chatService.getChats(utente, req, res);
        res.send(risultato);
        next();
    } catch(e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const startChat = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    let utenteRisposta = req.body.utenteRisposta;
    let domanda = req.body.domanda;
    let risposta = req.body.risposta;

    try {
        const risultato = await chatService.startChat(utente,utenteRisposta,domanda,risposta,ctrlToken.payload.user, req, res);
        res.send(risultato);
        next();
    } catch(e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const makeMatch = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);

    let utente = ctrlToken.payload._id;
    let utenteRisposta = req.body.utenteRisposta;

    try {
        const risultato = await chatService.makeMatch(utente, utenteRisposta,ctrlToken.payload.user, req, res);
        res.send(risultato);
        next();
    } catch(e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}



//FUNZIONI COMUNI
async function controllaToken(req, res) {
    let ctrlToken = {
      allow: false,
      payload: {}
    };
  
    // lettura token
    if (req.headers["token"] == undefined) {
      error(req, res, new ERRORS.TOKEN_DOESNT_EXIST({}));
    } else {
      let token = req.headers["token"].split(' ')[1];
      //console.log("TOKEN => "+token);


      
      console.log(token + " - " + typeof (token));
      if (token != "undefined"&&token!="null") {


          let result;
          try{
              result = await jwt.verify(token, privateKey);
          }
          catch (ex){
              console.log(ex);
          }
        console.log(result);
              

        ctrlToken.allow = true;
        if (result) {
          //ctrlToken.allow=true;
          ctrlToken.payload = result;
        } else {
          ctrlToken.payload = {
            "err_iat": true,
            "message": "Token scaduto"
          };
          error(req, res, new ERRORS.TOKEN_EXPIRED({}));
        }
      }
    }
    return ctrlToken;
  }

function error(req, res, err) {
    res.status(err.code).send(err.message);
}


module.exports = {
    makeMatch,
    sendMessage,
    getMessagesByReceiver,
    getChats,
    startChat,
}
