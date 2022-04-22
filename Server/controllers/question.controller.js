const {
    questionService
} = require("../services")
const jwt = require("jsonwebtoken");
const fs = require('fs');
const privateKey = fs.readFileSync("keys/private.key", "utf8");
const ERRORS = require('errors');


//Gestione errori del TOKEN
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

const insertAnswer = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);

    let utente = ctrlToken.payload._id;
    let testo = req.body.testo;
    let domanda = req.body.domanda;

    try {
        const risultato = await questionService.insertAnswer(utente, testo, domanda, ctrlToken.payload.user, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const insertQuestion = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);

    let autore = ctrlToken.payload._id;
    let testo = req.body.testo;
    let categoria = req.body.categoria;

    try {

        const risultato = await questionService.insertQuestion(autore, testo, categoria, ctrlToken.payload.user, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}


const updateQuestionState = async (req, res, next) => {

    let domanda = req.body.domanda;
    let stato = req.body.stato;
    try {
        const risultato = await questionService.updateQuestionState(domanda, stato, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}



const updateBlackList = async (req, res, next) => {
    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    let categorie = req.body.categorie;
    try {
        const risultato = await questionService.updateBlackList(utente, categorie, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}


const getQuestions = async (req, res, next) => {
    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    try {
        const risultato = await questionService.getQuestions(utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}
const getQuestionsByCategories = async (req, res, next) => {
    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    let categorie = req.body.categorie;

    try {
        const risultato = await questionService.getQuestionsByCategories(categorie, utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const getQuestionsByUser = async (req, res, next) => {
    let ctrlToken = await controllaToken(req, res);

    let utente = ctrlToken.payload._id;
    let disponibile = req.body.disponibile;
    try {
        const risultato = await questionService.getQuestionsByUser(utente, disponibile, req, res);

        res.send(risultato);
        console.log("GET QUESTION");
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const getRecivedAnswer = async (req, res, next) => {
    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;

    try {
        const risultato = await questionService.getRecivedAnswer(utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}


const getAnswersByUser = async (req, res, next) => {
    let ctrlToken = await controllaToken(req, res);

    let utente = ctrlToken.payload._id;
    try {
        const risultato = await questionService.getAnswersByUser(utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const getAnswersByQuestion = async (req, res, next) => {

    let domanda = req.body.domanda;
    let stato = req.body.stato;

    try {
        const risultato = await questionService.getAnswersByQuestion(domanda, stato, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const getBlackList = async (req, res, next) => {
    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    try {
        const risultato = await questionService.getBlackList(utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}


const getCategories = async (req, res, next) => {

    try {
        const risultato = await questionService.getCategories(req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const getMyCategories = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;

    try {
        const risultato = await questionService.getMyCategories(utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}



const removeFavouriteAnswer = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    let risposta = req.body.risposta;

    try {
        const risultato = await questionService.removeFavouriteAnswer(risposta, utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}


const addFavouriteAnswer = async (req, res, next) => {

    let ctrlToken = await controllaToken(req, res);
    let utente = ctrlToken.payload._id;
    let risposta = req.body.risposta;

    try {
        const risultato = await questionService.addFavouriteAnswer(risposta, utente, req, res);
        res.send(risultato);
        next();
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}



const handleRequest = async (req, res, next) => {

    let risposta = req.body.risposta;
    let stato = req.body.stato;

    try {
        const risultato = await questionService.handleRequest(risposta, stato, req, res);
        res.send(risultato);
        next();
    } catch (e) {
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
        
        //console.log(token + " - " + typeof (token));
        
        if (token != "undefined" && token != "null") {


            let result;
            try {
                result = await jwt.verify(token, privateKey);
            } catch (ex) {
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
    getRecivedAnswer,
    getBlackList,
    removeFavouriteAnswer,
    addFavouriteAnswer
}