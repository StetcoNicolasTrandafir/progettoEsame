const jwt = require("jsonwebtoken");
const fs = require('fs');
const { db } = require("../db");
const ERRORS = require('errors');
const { crypto } = require("../crypto");


ERRORS.create({
    code: 602,
    name: 'HASH',
    defaultMessage: 'An error occured crypting your data'
});

const TIMEOUT=600;
const privateKey = fs.readFileSync("services/keys/private.key", "utf8");

const getMessagesByReceiver = async  (utente, destinatario, username, req, res)=>{

    let queryString = "SELECT * FROM messaggi WHERE (mittente= ? AND destinatario = ?) OR (mittente=? AND destinatario = ?) ORDER BY data ASC";
    let params= [utente, destinatario, destinatario, utente];

    const result = await db.execute(queryString, params, req, res);

    let token = createToken({
        "_id": utente,
        "user": username
    });

    result.forEach(mex=>{
        console.log(mex.testoMessaggio)
        mex.testoMessaggio= crypto.decrypt({iv: mex.iv, content:mex.testoMessaggio });
        console.log(mex.testoMessaggio)
    });
    /*for(i; i<result.length; i++){
        console.log(result[i].testoMessaggio)
        result[i].testoMessaggio= crypto.decrypt({iv: res[i].iv, content:res[i].testoMessaggio });
        console.log(result[i].testoMessaggio)
    }*/
    console.log("LUNGHEZZA===>",result.length);
    return({
        data: result,
        token:token
    });
}

const getChats = async  (utente, destinatario, username, req, res)=>{

    let queryString = "SELECT DISTINCT matched.*, utenti.idUtente, utenti.username, utenti.nome, utenti.cognome, utenti.foto FROM matched, utenti WHERE (matched.idUtenteDomanda=? OR matched.idUtenteRisposta=?) AND (utenti.idUtente != ?) AND (utenti.idUtente=matched.idUtenteRisposta OR utenti.idUtente=matched.idUtenteDomanda)";
    let params= [utente, utente, utente];


    const result = await db.execute(queryString, params, req, res);
    return({
        data: result
    });
}


const makeMatch = async  (utente, utenteRisposta, username, req, res)=>{

    let queryCtrl= "SELECT matchedId FROM matched WHERE (idUtenteDomanda=? AND idUtenteRisposta=?) OR (idUtenteDomanda=? AND idUtenteRisposta=?)";
    const ctrl=await db.execute(queryCtrl, [utente, utenteRisposta,utenteRisposta,utente]);
    console.log(ctrl);
    if(ctrl.length==0){
    let queryString = "INSERT INTO matched (idUtenteDomanda, idUtenteRisposta, matched , data) VALUES (?,?, 'T', NOW())";
    let params= [utente, utenteRisposta];
    const result = await db.execute(queryString, params, req, res);

    let token = createToken({
        "_id": utente,
        "user": username
    });
    return({
        data: "Match effettuato!",
        token:token
    });
    }else
        return ({
            data:"Match già esistente"
        })
}

const startChat = async  (utenteDomanda, utenteRisposta,domanda, risposta, username, req, res)=>{
    let domandaCriptata= crypto.encrypt(domanda);
    let rispostaCriptata= crypto.encrypt(risposta);
    let queryString = "INSERT INTO messaggi(testoMessaggio, data,mittente,destinatario, iv) VALUES (?, NOW(), ?,?,?),(?, NOW(), ?,?,?)";
    let params= [domandaCriptata.content, utenteDomanda, utenteRisposta,domandaCriptata.iv, rispostaCriptata.content, utenteRisposta, utenteDomanda,rispostaCriptata.iv];
    const result = await db.execute(queryString, params, req, res);

    let token = createToken({
        "_id": utenteDomanda,
        "user": username
    });
    return({
        data: "Chat iniziata",
        token:token
    });
}



const sendMessage = async  (testo,utente, destinatario,user, req, res)=>{

    let enrcypted= crypto.encrypt(testo);
    let queryString = "INSERT INTO messaggi(testoMessaggio, data,mittente,destinatario, iv) VALUES (?,NOW(),?,?,?)";
    let params= [enrcypted.content, utente, destinatario, enrcypted.iv];

    const result = await db.execute(queryString, params, req, res);

    let token = createToken({
        "_id": utente,
        "user": user
    });
    return({
        data: "Messaggio inviato!",
        token:token
    });
}

//FUNZIONI COMUNI
function createToken(obj) {
    let token = jwt.sign({
            '_id': obj._id,
            'user': obj.user,
            'iat': Math.floor(Date.now() / 1000),
            'exp': Math.floor(Date.now() / 1000 + TIMEOUT)
        },
        privateKey
    );
    return token;
}

function error(req, res, err) {
    res.status(err.code).send(err.message);
}

module.exports = {
    TIMEOUT,
    makeMatch,
    sendMessage,
    getMessagesByReceiver,
    getChats,
    startChat
  }