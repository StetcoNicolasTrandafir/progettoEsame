const jwt = require("jsonwebtoken");
const fs = require('fs');
const { db } = require("../db");
const ERRORS = require('errors');
const { crypto } = require("../crypto");

const privateKey = fs.readFileSync("keys/private.key", "utf8");
const TIMEOUT=600;



const updateBlackList = async  (utente,categorie,req, res)=>{

    let queryString = "DELETE FROM blacklist  WHERE idUtente=?";
    const resultDelete = await db.execute(queryString, [utente], req, res);
    console.log(resultDelete);
    let result;
    for(let i=0; i < categorie.length; i++){
        queryString= "INSERT INTO blacklist(idUtente, idCategoria) VALUES (?,?)";
        result = await db.execute(queryString, [utente, categorie[i]], req, res);
    }

    return({
        data: "Blacklist aggiornata!",
    });
}




const updateQuestionState = async  (domanda,stato,req, res)=>{

    let queryString = "UPDATE domande SET disponibile=? WHERE idDomanda=?";


    const result = await db.execute(queryString, [stato,domanda], req, res);
    return({
        data: "Disponibilita domanda aggiornata!",
    });
}

const handleRequest = async  (risposta,stato,req, res)=>{

    let queryString = "UPDATE risposte SET stato=? WHERE idRisposta=?";

    const result = await db.execute(queryString, [stato,risposta], req, res);
    return({
        data: "Richiesta gestita!",
    });
}


const insertAnswer = async  (utente,testo,domanda,username,req, res)=>{

    let enrcypted= crypto.encrypt(testo);
    let queryString = "INSERT INTO risposte(testoRisposta, data,iv, domanda, utente) VALUES (?,NOW(),?,?,?)";

    const result = await db.execute(queryString, [enrcypted.content,enrcypted.iv, domanda, utente], req, res);

    let token = createToken({
        "_id": utente,
        "user": username
    });

    return({
        data: "Risposta inserita!",
        token:token
    });
}
const insertQuestion = async  (autore,testo,categoria,username,req, res)=>{

    let enrcypted= crypto.encrypt(testo);
    
    let queryString = "INSERT INTO domande(testoDomanda,data,iv,categoria,disponibile, autore) VALUES (?,NOW(),?,?,'T',?)";
    const result = await db.execute(queryString, [enrcypted.content,enrcypted.iv, categoria, autore], req, res);

    let token = createToken({
        "_id": autore,
        "user": username
    });

    return({
        data: "Domanda inserita!",
        token:token
    });
}
const getQuestions = async  (utente,req, res)=>{

    let queryString = "SELECT utenti.username, categorie.nomeCategoria, categorie.colore,domande.iv, domande.idDomanda, domande.testoDomanda, domande.data, domande.categoria, domande.disponibile, domande.autore,SQRT(POWER(((SELECT SUBSTRING_INDEX(posizione,';',1) FROM utenti WHERE idUtente=?)-SUBSTRING_INDEX(utenti.posizione,';',1)),2)";
    queryString+="+ POWER(((SELECT SUBSTRING_INDEX(posizione,';',-1) FROM utenti WHERE idUtente=?)-SUBSTRING_INDEX(utenti.posizione,';',-1)),2)";
    queryString+=") AS DISTANZA";
    queryString+=" FROM domande INNER JOIN utenti ON utenti.idUtente=domande.autore";
    queryString+=" INNER JOIN categorie ON domande.categoria=categorie.idCategoria";
    queryString+=" WHERE domande.autore!=? AND domande.categoria NOT IN (SELECT idCategoria FROM blacklist WHERE idUtente= ?) AND domande.disponibile='T'";
    queryString+=" AND domande.idDomanda NOT IN (SELECT domanda FROM risposte WHERE utente=?) "
    queryString+=" GROUP BY domande.idDomanda,domande.testoDomanda,domande.data,domande.categoria,domande.disponibile,domande.autore";
    queryString+=" ORDER BY DISTANZA ASC, domande.data DESC";
    //console.log(queryString);
    const result = await db.execute(queryString, [utente,utente,utente,utente, utente], req, res);
    result.forEach(question=>{
        question.testoDomanda= crypto.decrypt({iv: question.iv, content:question.testoDomanda });
    });
    return({
        data: result,
    });
}


const getQuestionsByCategories = async  (categorie,utente,req, res)=>{

    let queryString = "SELECT utenti.username, categorie.nomeCategoria, categorie.colore, domande.idDomanda,domande.iv, domande.testoDomanda, domande.data, domande.categoria, domande.disponibile, domande.autore,SQRT(POWER(((SELECT SUBSTRING_INDEX(posizione,';',1) FROM utenti WHERE idUtente=?)-SUBSTRING_INDEX(utenti.posizione,';',1)),2)";
    queryString+="+ POWER(((SELECT SUBSTRING_INDEX(posizione,';',-1) FROM utenti WHERE idUtente=?)-SUBSTRING_INDEX(utenti.posizione,';',-1)),2)";
    queryString+=") AS DISTANZA";
    queryString+=" FROM domande INNER JOIN utenti ON utenti.idUtente=domande.autore";
    queryString+=" INNER JOIN categorie ON domande.categoria=categorie.idCategoria";
    queryString+=" WHERE domande.autore!=? AND domande.categoria IN (?) AND domande.categoria NOT IN (SELECT idCategoria FROM blacklist WHERE idUtente= ?) AND domande.disponibile='T'";
    queryString+=" AND domande.idDomanda NOT IN (SELECT domanda FROM risposte WHERE utente=?) "
    queryString+=" GROUP BY domande.idDomanda,domande.testoDomanda,domande.data,domande.categoria,domande.disponibile,domande.autore";
    queryString+=" ORDER BY DISTANZA ASC, domande.data DESC";
    const result = await db.execute(queryString, [utente,utente,utente,categorie,utente, utente], req, res);
    result.forEach(question=>{
        question.testoDomanda= crypto.decrypt({iv: question.iv, content:question.testoDomanda });
    });
    return({
        data: result,
    });
}

const getQuestionsByUser = async  (utente,disponibile,req, res)=>{
    //let queryString = "SELECT domande.*, categorie.nomeCategoria, categorie.colore,  FROM domande, categorie WHERE domande.autore= ? AND domande.categoria=categorie.idCategoria AND domande.disponibile= ?";
    let queryString = "SELECT domande.idDomanda,domande.testoDomanda,domande.data,domande.iv,categorie.nomeCategoria,categorie.colore,COUNT(risposte.idRisposta) as numeroRisposte FROM domande LEFT JOIN risposte ON risposte.domanda=domande.idDomanda AND risposte.stato='S' ";
    queryString+="INNER JOIN categorie ON categorie.idCategoria=domande.categoria ";
    queryString+="WHERE domande.autore=? AND domande.disponibile=? ";
    queryString+="GROUP BY domande.idDomanda,domande.testoDomanda,domande.data,domande.iv,categorie.nomeCategoria,categorie.colore";
    const result = await db.execute(queryString, [utente,disponibile], req, res);
    result.forEach(question=>{
        question.testoDomanda= crypto.decrypt({iv: question.iv, content:question.testoDomanda });
    });
    return({
        data: result,
    });
}

const getAnswersByUser = async  (utente, req, res)=>{
    let queryString = "SELECT risposte.*, domande.testoDomanda, utenti.username,domande.iv AS ivDomanda, categorie.colore FROM risposte, domande, utenti, categorie WHERE utente= ? AND domande.idDomanda=risposte.domanda AND domande.autore= utenti.idUtente AND domande.categoria= categorie.idCategoria";
    const result = await db.execute(queryString, [utente], req, res);
    result.forEach(answer=>{
        answer.testoRisposta= crypto.decrypt({iv: answer.iv, content:answer.testoRisposta });
        answer.testoDomanda= crypto.decrypt({iv: answer.ivDomanda, content:answer.testoDomanda });

    });
    return({
        data: result,
    });
}

const getAnswersByQuestion = async  (domanda,stato,req, res)=>{

    let queryString = "SELECT risposte.*,domande.iv as ivDomanda, utenti.username, domande.testoDomanda FROM risposte,utenti, domande WHERE domanda= ? AND risposte.utente=utenti.idUtente AND domande.idDomanda=risposte.domanda AND risposte.stato=?";
    const result = await db.execute(queryString, [domanda, stato], req, res);
    result.forEach(answer=>{
        answer.testoRisposta= crypto.decrypt({iv: answer.iv, content:answer.testoRisposta });
        answer.testoDomanda= crypto.decrypt({iv: answer.ivDomanda, content:answer.testoDomanda });
    });
    return({
        data: result,
    });
}

const getRecivedAnswer = async  (utente, req, res)=>{
    //let queryString = "SELECT risposte.*, domande.testoDomanda, utenti.username,domande.iv AS ivDomanda, categorie.colore  FROM risposte, domande, utenti,(SELECT utenti.username AS username,utenti.idUtente as idUtente from utenti) AS tmp, categorie WHERE risposte.domanda=domande.idDomanda AND domande.autore=? AND tmp.idUtente=risposte.utente AND utenti.idUtente=domande.autore AND domande.categoria= categorie.idCategoria ";
    let queryString = "SELECT  tmp.username AS usernameRisposta, risposte.iv, risposte.testoRisposta, risposte.stato, risposte.utente as autoreRisposta,domande.testoDomanda, utenti.username,domande.iv AS ivDomanda, categorie.colore ";
    queryString+="FROM risposte INNER JOIN domande ON domande.idDomanda= risposte.domanda AND domande.autore=? ";
    queryString+=" INNER JOIN categorie ON categorie.idCategoria=domande.categoria ";
    queryString+=" INNER JOIN utenti ON utenti.idUtente=domande.autore";
    queryString+=" INNER JOIN (SELECT utenti.username AS username,utenti.idUtente as idUtente from utenti) AS tmp ON tmp.idUtente=risposte.utente"
    //queryString+=" WHERE utenti.idUtente= autoreRisposta";
    const result = await db.execute(queryString, [utente], req, res);
    result.forEach(answer=>{
        answer.testoRisposta= crypto.decrypt({iv: answer.iv, content:answer.testoRisposta });
        answer.testoDomanda= crypto.decrypt({iv: answer.ivDomanda, content:answer.testoDomanda });
    });
    return({
        data: result,
    });
}

const getMyCategories = async  (user,req, res)=>{

    let queryString = "SELECT * FROM categorie WHERE idCategoria NOT IN (SELECT idCategoria FROM blacklist WHERE idUtente=?)";
    const result = await db.execute(queryString, [user], req, res);

    return({
        data: result,
    });
}


const getCategories = async  (req, res)=>{

    let queryString = "SELECT * FROM categorie";
    const result = await db.execute(queryString, [], req, res);

    return({
        data: result,
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
    getCategories,
    getAnswersByQuestion,
    getAnswersByUser,
    getQuestionsByCategories,
    insertQuestion,
    insertAnswer,
    getQuestionsByUser,
    getQuestions,
    handleRequest,
    getMyCategories,
    updateBlackList,
    updateQuestionState,
    getRecivedAnswer
}

