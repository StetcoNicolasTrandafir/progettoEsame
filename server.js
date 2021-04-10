const express = require('express');
const bcrypt = require('bcrypt');
const https = require('https');
const ERRORS = require('errors');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const mySql = require('mysql');

const app = express();

const port = 1337;
let con;
let saltRounds = 10;

const TIMEOUT = 30;

const privateKey = fs.readFileSync("keys/private.key", "utf8");

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



app.listen(port, function () {
    console.log("Server running on port: " + port);
});


app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({
    extended: true
}));

function createToken(obj) {
    let token = jwt.sign({
            '_id': obj._id,
            'user': obj.user,
            'iat': obj.iat || Math.floor(Date.now() / 1000),
            'exp': obj.exp || Math.floor(Date.now() / 1000 + TIMEOUT)
        },
        privateKey
    );
    return token;
}

function controllaToken(req, res) {
    let ctrlToken = {
        allow: false,
        payload: {}
    };
    // lettura token
    if (req.headers["token"] == undefined) {
        error(req,res,new ERRORS.TOKEN_DOESNT_EXIST({}));
    } else {
        const token = req.headers["token"].split(' ')[1];
        console.log(token + " - " + typeof (token));
        if (token != "null") {
            jwt.verify(token, privateKey, function (err, data) {
                ctrlToken.allow = true;
                if (!err) {
                    //ctrlToken.allow=true;
                    ctrlToken.payload = data;
                } else {
                    ctrlToken.payload = {
                        "err_iat": true,
                        "message": "Token scaduto"
                    };
                }
            });
        }
        return ctrlToken;
    }
}



app.post("/api/controlloToken", function (req, res, next) {
    let ctrlToken = controllaToken(req, res);
    if (ctrlToken.allow && !ctrlToken.payload.err_iat) {
        res.send({
            "data": "TOKEN OK",
            token: ctrlToken.payload
        });
    } else {
        error(req, res, new ERRORS.TOKEN_EXPIRED({}));
    }
});


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
                                            let queryString = "INSERT INTO utenti(username, password, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita) VALUES ('" + user + "','" + hash + "','" + nome + "','" + cognome + "','" + mail + "','" + foto + "','" + posizione + "','" + sesso + "','" + descrizione + "',STR_TO_DATE('" + dataNascita + "', '%d-%m-%Y'))";
                                            con.query(queryString, function (errQuery, result) {
                                                if (errQuery) {
                                                    console.log(errQuery);
                                                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                                                } else {
                                                    let token = createToken({
                                                        "_id": result.insertId,
                                                        "user": user
                                                    });
                                                    console.log("token " + token);
                                                    //console.log(result.insertId);
                                                    res.send({
                                                        "token": token,
                                                        "result": "Signed up!"
                                                    });
                                                }
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
                error(req, res, new ERRORS.DB_CONNECTION({}));
            } else {
                let queryString = "SELECT * FROM utenti WHERE mail='" + mail + "'";
                con.query(queryString, function (errQuery, result) {
                    if (errQuery) {
                        console.log(errQuery);
                        error(req, res, new ERRORS.QUERY_EXECUTE({}));
                    } else {

                        // result[0] perchè si da per scontata l'univocità della mail
                        bcrypt.compare(password, result[0].password, function (errCompare, resultCompare) {
                            if (errCompare)
                                error(req, res, new ERRORS.HASH({}));
                            else {
                                let token = createToken({
                                    "_id": result[0].idUtente,
                                    "user": result[0].username
                                });
                                console.log("token " + token);
                                res.send({
                                    "token": token,
                                    "result": result
                                });
                            }
                        });
                    }
                });
            }
        });
    });
});



app.post("/api/insertQuestion", function (req, res) {

    let ctrlToken = controllaToken(req, res);
    if (ctrlToken.allow) {
        if (!ctrlToken.payload.err_iat) {

            con = mySql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "social"
            });

            let autore = ctrlToken.payload._id;
            let testo = req.body.testo;
            let categoria = req.body.categoria;
            let disponibile = 'T';

            let queryString = "INSERT INTO domande(testoDomanda, data,categoria,disponibile, autore) VALUES ('" + testo + "',NOW()," + categoria + ",'" + disponibile + "'," + autore + ")";
            con.query(queryString, function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {
                    let token = createToken({
                        "_id": ctrlToken.payload._id,
                        "user": ctrlToken.payload.user
                    });
                    res.send({
                        data: "Domanda inserita con successo",
                        token: token
                    });
                }
            });
        } else {
            error(req, res, new ERRORS.TOKEN_EXPIRED({}));
        }
    } else {
        error(req, res, new ERRORS.TOKEN_DOESNT_EXIST({}));
    }
});



app.post("/api/insertAnswer", function (req, res) {
    let ctrlToken = controllaToken(req, res);
    if (ctrlToken.allow) {
        if (!ctrlToken.payload.err_iat) {

            con = mySql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "social"
            });

            let utente = ctrlToken.payload._id;
            let testo = req.body.testo;
            let domanda = req.body.domanda;


            let queryString = "INSERT INTO risposte(testoRisposta, data, domanda, utente) VALUES ('" + testo + "',NOW()," + domanda + "," + utente + ")";
            con.query(queryString, function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {
                    let token = createToken({
                        "_id": ctrlToken.payload._id,
                        "user": ctrlToken.payload.user
                    });
                    res.send({
                        data: "Risposta inserita con successo",
                        token: token
                    });
                }
            });
        } else {
            error(req, res, new ERRORS.TOKEN_EXPIRED({}));
        }
    } else {
        error(req, res, new ERRORS.TOKEN_DOESNT_EXIST({}));
    }
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