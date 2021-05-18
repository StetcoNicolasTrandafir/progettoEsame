const jwt = require("jsonwebtoken");
const fs = require('fs');
const { db } = require("../db");
const ERRORS = require('errors');
const privateKey = fs.readFileSync("keys/private.key", "utf8");
const TIMEOUT=600;






const handleRequest = async  (risposta,stato,req, res)=>{

    let queryString = "UPDATE risposte SET stato=? WHERE idRisposta=?";

    const result = await db.execute(queryString, [risposta,stato], req, res);
    return({
        data: "Richiesta gestita!",
    });
}
const insertAnswer = async  (utente,testo,domanda,username,req, res)=>{

    let queryString = "INSERT INTO risposte(testoRisposta, data, domanda, utente) VALUES (?,NOW(),?,?)";

    const result = await db.execute(queryString, [testo, domanda, utente], req, res);

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

    let queryString = "INSERT INTO domande(testoDomanda, data,categoria,disponibile, autore) VALUES (?,NOW(),?,'T',?)";
    const result = await db.execute(queryString, [testo, categoria, autore], req, res);

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

    let queryString = "SELECT domande.*, utenti.username, categorie.nomeCategoria, categorie.colore FROM domande, utenti, categorie WHERE domande.autore!=? AND (utenti.idUtente=domande.autore AND domande.categoria=categorie.idCategoria) AND categoria NOT IN (SELECT idCategoria FROM blacklist WHERE idUtente= ?) AND domande.disponibile='T' ORDER BY domande.data DESC";
    const result = await db.execute(queryString, [utente,utente], req, res);
    return({
        data: result,
    });
}


const getQuestionsByCategories = async  (categorie,req, res)=>{

    let queryString = "SELECT domande.*, categorie.* FROM domande, categorie WHERE domande.categoria IN (?) AND categorie.idCategoria= domande.categoria";
    const result = await db.execute(queryString, [categorie], req, res);
    return({
        data: result,
    });
}

const getQuestionsByUser = async  (utente,disponibile,req, res)=>{
    let queryString = "SELECT domande.*, categorie.nomeCategoria, categorie.colore  FROM domande, categorie WHERE domande.autore= ? AND domande.categoria=categorie.idCategoria AND domande.disponibile= ?";
    const result = await db.execute(queryString, [utente,disponibile], req, res);
    return({
        data: result,
    });
}

const getAnswersByUser = async  (utente,req, res)=>{
    let queryString = "SELECT risposte.*, domande.testoDomanda, utenti.username, categorie.colore FROM risposte, domande, utenti, categorie WHERE utente= ? AND domande.idDomanda=risposte.domanda AND domande.autore= utenti.idUtente AND domande.categoria= categorie.idCategoria";
    const result = await db.execute(queryString, [utente], req, res);
    return({
        data: result,
    });
}

const getAnswersByQuestion = async  (domanda,req, res)=>{

    let queryString = "SELECT risposte.*, utenti.username, domande.testoDomanda FROM risposte,utenti, domande WHERE domanda= ? AND risposte.utente=utenti.idUtente AND domande.idDomanda=risposte.domanda";
    const result = await db.execute(queryString, [domanda], req, res);
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
    console.log("====================================================================111")
    let token = jwt.sign({
            '_id': obj._id,
            'user': obj.user,
            'iat': Math.floor(Date.now() / 1000),
            'exp': Math.floor(Date.now() / 1000 + TIMEOUT)
        },
        privateKey
    );
    console.log("====================================================================2222")
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
    handleRequest
}

