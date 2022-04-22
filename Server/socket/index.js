const { crypto } = require("../crypto");
const { db } = require("../db");
const ERRORS = require('errors');
ERRORS.create({
    code: 602,
    name: 'HASH',
    defaultMessage: 'An error occured crypting your data'
});


async function sendMessage(text, utente, destinatario, req,){
    let enrcypted= crypto.encrypt(text);
    let queryString = "INSERT INTO messaggi(testoMessaggio, data,mittente,destinatario, iv) VALUES (?,NOW(),?,?,?)";
    let params= [enrcypted.content, utente, destinatario, enrcypted.iv];

    const result = await db.execute(queryString, params, req, res);

    return({
        data: "Messaggio inviato!",
    });
}

const sendAnswer = async  (testo,domanda,utente,req, res)=>{

    let enrcypted= crypto.encrypt(testo);
    let queryString = "INSERT INTO risposte(testoRisposta, data,iv, domanda, utente) VALUES (?,NOW(),?,?,?)";

    const result = await db.execute(queryString, [enrcypted.content,enrcypted.iv, domanda, utente], req, res);

    return({
        data: "Risposta inserita!",
    });
}
const view = async  (from, to,req, res)=>{

    let queryString = "UPDATE messaggi SET letto='T' WHERE mittente=? AND destinatario=? AND letto='F'";

    const result = await db.execute(queryString, [from, to], req, res);

    return({
        data: "Visualizzato!",
    });
}
view

module.exports = {
    sendMessage,
    sendAnswer,
    view
}
