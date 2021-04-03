const express = require('express');
const bcrypt = require('bcrypt');
const https = require('https');
const ERRORS = require('errors');
const bodyParser = require('body-parser');
const fs = require('fs');
const mySql = require('mysql');
const app = express();

const port = 1337;
let con;
let saltRounds = 10;
 
// code 601 - query execution error
ERRORS.create({
    code: 601,
    name: 'QUERY_EXECUTE',
    defaultMessage: 'An error occured during the query execution'
});

ERRORS.create({
    code: 600,
    name: 'DB_CONNECTION',
    defaultMessage: 'An error occured when connecting to database'
});

ERRORS.create({
    code: 602,
    name: 'HASH',
    defaultMessage: 'An error occured crypting your data'
});



app.listen(port, function () {
    console.log("Server running on port: " + port);
});


app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({
    extended: true
}));

app.post("/api/signUp", function (req, res, next) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let user = req.body.user;
    let mail = req.body.mail;
    let nome = req.body.nome;
    let cognome = req.body.cognome;
    let foto = req.body.foto;
    let sesso = req.body.sesso;
    let descrizione = req.body.descrizione;
    let posizione = req.body.posizione;
    let dataNascita = req.body.dataNascita;
    let password = req.body.password;

    con.connect(function (err) {
        if (err) {
            console.log("Errore di connessione al DB");
            error(req, res, new ERRORS.DB_CONNECTION({}));
        } else {

            //controllo univocità mail
            let queryMail = "SELECT idUtente FROM utenti WHERE mail='" + mail + "'";
            con.query(queryMail, function (errCtrMail, resultMail) {
                if (errCtrMail) {
                    console.log(errCtrMail);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {

                    if (resultMail.length == 0) {

                        //controllo univocità username
                        let queryUser = "SELECT idUtente FROM utenti WHERE username='" + user + "'";
                        con.query(queryUser, function (errCtrUser, resultUser) {
                            if (errCtrUser) {
                                console.log(errCtrUser);
                                error(req, res, new ERRORS.QUERY_EXECUTE({}));
                            } else {
                                if (resultUser.length == 0) {
                                    bcrypt.hash(password, saltRounds, (err, hash) => {
                                        if (err)
                                            error(req, res, new ERRORS.HASH({}));
                                        else {
                                            //una volta assicurati che non vi sono altri utenti con quell' user e password, si procede alla registrazione
                                            let queryString = "INSERT INTO utenti(username, password, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita) VALUES ('" + user + "','" + hash + "','" + nome + "','" + cognome + "','" + mail + "','" + foto + "','" + posizione + "','" + sesso + "','" + descrizione + "'," + dataNascita + ")";
                                            con.query(queryString, function (errQuery, result) {
                                                if (errQuery) {
                                                    console.log(errQuery);
                                                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                                                } else
                                                    res.send("Signed up!");
                                            });
                                        }
                                    });
                                } else
                                    res.send("Username non disponibile, scegline un altro");
                            }
                        });
                    } else
                        res.send("Ti sei già registrato con questa mail");
                }
            });
        }
    });


});

app.post("/api/login", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let mail = req.body.mail;
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        con.connect(function (err) {
            if (err) {
                console.log("Errore di connessione al DB");
                res.send("Errore di connessione al DB");
            } else {
                let queryString = "SELECT * FROM utenti WHERE mail='" + mail + "'";
                con.query(queryString, function (errQuery, result) {
                    if (errQuery) {
                        console.log(errQuery);
                        res.send("Errore nella query: " + errQuery)
                    } else {

                        // result[0] perchè si da per scontata l'univocità della mail
                        bcrypt.compare(password, result[0].password, function (errCompare, resultCompare) {
                            if (errCompare)
                                res.send("Errore compare hash");
                            else {
                                console.log("loggato");
                                res.send(result);
                            }
                        });
                    }
                });
            }
        });
    });
});



app.post("/api/insertQuestion", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let autore = req.body.autore;
    let testo = req.body.testo;
    let categoria = req.body.categoria;
    let disponibile = 'T';

    let queryString = "INSERT INTO domande(testoDomanda, data,categoria,disponibile, autore) VALUES ('" + testo + "',NOW()," + categoria + ",'" + disponibile + "'," + autore + ")";
    con.query(queryString, function (errQuery, result) {
        if (errQuery) {
            //console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send("Domanda inserita con successo");
    });
});



app.post("/api/insertAnswer", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let utente = req.body.utente;
    let testo = req.body.testo;
    let domanda = req.body.domanda;


    let queryString = "INSERT INTO risposte(testoRisposta, data, domanda, utente) VALUES ('" + testo + "',NOW()," + domanda + "," + utente + ")";
    con.query(queryString, function (errQuery, result) {
        if (errQuery) {
            //console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send("Risposta inserita con successo");
    });
});



app.post("/api/getQuestionByUser", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let autore = req.body.autore;

    let queryString = "SELECT * FROM domande WHERE autore= " + autore + " ";
    con.query(queryString, function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send(result);
    });
});



app.post("/api/getQuestionsByCategory", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let categoria = req.body.categoria;

    let queryString = "SELECT * FROM domande WHERE categoria= " + categoria + " ";
    con.query(queryString, function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send(result);
    });
});


app.post("/api/getAnswerByUser", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let utente = req.body.utente;

    let queryString = "SELECT * FROM risposte WHERE utente= " + utente + " ";
    con.query(queryString, function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send(result);
    });
});



app.post("/api/getAnswerByQuestion", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let domanda = req.body.domanda;

    let queryString = "SELECT * FROM risposte WHERE domanda= " + domanda + " ";
    con.query(queryString, function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send(result);
    });
});



function error(req, res, err) {
    res.status(err.code).send(err.message);
}