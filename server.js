const express = require('express');
const bcrypt = require('bcrypt');
const https = require('https');
const ERRORS = require('errors');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const mySql = require('mysql');
const fileupload = require('express-fileupload');


const app = express();
const port = 1337;
let con;
let saltRounds = 10;

const TIMEOUT = 30000;

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

app.use("/img", express.static('./img'));
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({
    extended: true
}));
app.use(fileupload());


app.use("/", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,token');

    next();
});

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

function controllaToken(req, res) {
    let ctrlToken = {
        allow: false,
        payload: {}
    };
    // lettura token
    if (req.headers["token"] == undefined) {
        error(req, res, new ERRORS.TOKEN_DOESNT_EXIST({}));
    } else {
        const token = req.headers["token"].split(' ')[1];
        //console.log("TOKEN => "+token);
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
    }
    return ctrlToken;
}



app.post("/api/controlloToken", function (req, res, next) {
    //console.log(req.headers);
    let ctrlToken = controllaToken(req, res);
    console.log(ctrlToken);
    if (ctrlToken.allow && !ctrlToken.payload.err_iat) {
        let token = createToken({
            "_id": ctrlToken.payload._id,
            "user": ctrlToken.payload.user
        });
        res.send({
            "data": "TOKEN OK",
            token: token
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
    console.log("Req.Body===>", req.body);

    //let f = req.body.img.files.myFile;
    foto = (foto.split('.')[foto.split('.').length - 1]);

    console.log(foto)
    con.connect(function (err) {
        if (err) {
            console.log("Errore di connessione al DB");
            error(req, res, new ERRORS.DB_CONNECTION({}));
        } else {

            //controllo univocità mail
            let queryMail = "SELECT idUtente FROM utenti WHERE mail=?";
            con.query(queryMail, [mail], function (errCtrMail, resultMail) {
                if (errCtrMail) {
                    console.log(errCtrMail);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {

                    if (resultMail.length == 0) {

                        //controllo univocità username
                        let queryUser = "SELECT idUtente FROM utenti WHERE username=?";
                        con.query(queryUser, [user], function (errCtrUser, resultUser) {
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
                                            let queryString = "INSERT INTO utenti(username, password, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita) VALUES (?,?,?,?,?,?,?,?,?,STR_TO_DATE(?, '%d-%m-%Y'))";
                                            con.query(queryString, [user, hash, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita], function (errQuery, result) {
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
                                                        "data": result.insertId,
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else
                                    res.send({
                                        code: 50,
                                        data: "Username non disponibile, scegline un altro"
                                    });
                            }
                        });
                    } else
                        res.send({
                            code: 50,
                            data: "Ti sei già registrato con questa mail"
                        });
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
    console.log(req.body);
    console.log("MAil: " + mail + " pwd: " + password);

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("TEST MAIL=> " + re.test(String(mail).toLowerCase()));
    let queryString;
    if (re.test(String(mail).toLowerCase())) {
        //queryString = "SELECT * FROM utenti WHERE mail='" + mail + "'";
        queryString = "SELECT * FROM utenti WHERE mail=?";

    } else {
        //queryString = "SELECT * FROM utenti WHERE username='" + mail + "'";
        queryString = "SELECT * FROM utenti WHERE username=?";
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        con.connect(function (err) {
            if (err) {
                console.log("Errore di connessione al DB");
                error(req, res, new ERRORS.DB_CONNECTION({}));
            } else {

                console.log("Sei qui==========>");
                con.query(queryString, [mail], function (errQuery, result) {
                    if (errQuery) {
                        console.log(errQuery);
                        error(req, res, new ERRORS.QUERY_EXECUTE({}));
                    } else {
                        if (result.length == 0) {
                            console.log("user errato");
                            res.send({
                                data: "User errato"
                            });
                        } else {
                            console.log("gino");
                            // result[0] perchè si da per scontata l'univocità della mail
                            console.log("PASSWORD => " + password + " || PASSWORD DB => " + result[0].password);
                            bcrypt.compare(password, result[0].password, function (errCompare, resultCompare) {
                                if (errCompare)
                                    error(req, res, new ERRORS.HASH({}));
                                else {
                                    console.log("resultCompare => " + resultCompare);
                                    if (!resultCompare) {
                                        res.send({
                                            data: "Password errata"
                                        });
                                    } else {
                                        let token = createToken({
                                            "_id": result[0].idUtente,
                                            "user": result[0].username
                                        });
                                        console.log("token " + token);

                                        //res.setHeader("Access-Control-Allow-Origin", "*");
                                        //Permetto l'accesso a tutti i tipi di richieste
                                        //res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");

                                        res.send({
                                            "token": token,
                                            "data": result
                                        });
                                    }
                                }
                            });
                        }
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

            let queryString = "INSERT INTO domande(testoDomanda, data,categoria,disponibile, autore) VALUES (?,NOW(),?,?,?)";
            con.query(queryString, [testo, categoria, disponibile, autore], function (errQuery, result) {
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



app.post("/api/getUser", function (req, res) {

    let ctrlToken = controllaToken(req, res);
    if (ctrlToken.allow) {
        if (!ctrlToken.payload.err_iat) {

            con = mySql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "social"
            });

            let user = ctrlToken.payload._id;

            let queryString = "SELECT * FROM  utenti WHERE idUtente=?";
            con.query(queryString, [user], function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {

                    res.send({
                        data: result,
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


            let queryString = "INSERT INTO risposte(testoRisposta, data, domanda, utente) VALUES (?,NOW(),?,?)";
            console.log(queryString + " " + testo + " " + domanda + " " + utente);
            con.query(queryString, [testo, domanda, utente], function (errQuery, result) {
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
            let disponibile=req.body.disponibile;
            console.log(disponibile);

            let queryString = "SELECT domande.*, categorie.nomeCategoria, categorie.colore  FROM domande, categorie WHERE domande.autore= ? AND domande.categoria=categorie.idCategoria AND domande.disponibile= ?";
            con.query(queryString, [autore, disponibile], function (errQuery, result) {
                if (errQuery) {
                    console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else
                    res.send({
                        data: result
                    });
            });
        } else {
            error(req, res, new ERRORS.TOKEN_EXPIRED({}));
        }
    } else {
        error(req, res, new ERRORS.TOKEN_DOESNT_EXIST({}));
    }
});


app.post("/api/getCategories", function (req, res) {

    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });



    let queryString = "SELECT * FROM categorie";
    con.query(queryString, [], function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send({
                data: result
            });
    });
});


app.post("/api/getQuestions", function (req, res) {
    let ctrlToken = controllaToken(req, res);

    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let utente = ctrlToken.payload._id;
    let queryString = "SELECT domande.*, utenti.username, categorie.nomeCategoria, categorie.colore FROM domande, utenti, categorie WHERE domande.autore!=? AND (utenti.idUtente=domande.autore AND domande.categoria=categorie.idCategoria) AND categoria NOT IN (SELECT idCategoria FROM blacklist WHERE idUtente= ?) AND domande.disponibile='T' ORDER BY domande.data DESC";
    con.query(queryString, [utente, utente], function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send({
                data: result
            });
    });
});



app.post("/api/getQuestionsByCategory", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let categorie = req.body.categorie;
    console.log(categorie);


    let queryString = "SELECT domande.*, categorie.* FROM domande, categorie WHERE domande.categoria IN (?) AND categorie.idCategoria= domande.categoria";

    console.log(queryString);

    con.query(queryString, [categorie], function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send({
                data: result
            });
    });
});


app.post("/api/getAnswersByUser", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let ctrlToken= controllaToken(req,res);
    let utente= ctrlToken.payload._id;

    let queryString = "SELECT risposte.*, domande.testoDomanda, utenti.username, categorie.colore FROM risposte, domande, utenti, categorie WHERE utente= ? AND domande.idDomanda=risposte.domanda AND domande.autore= utenti.idUtente AND domande.categoria= categorie.idCategoria";
    con.query(queryString, [utente], function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send({
                data: result
            });
    });
});



app.post("/api/handleRequest", function (req, res) {
    con = mySql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "social"
    });

    let risposta = req.body.risposta;
    let stato = req.body.stato;

    let queryString = "UPDATE risposte SET stato=? WHERE idRisposta=?";
    con.query(queryString, [stato, risposta], function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send({
                data: result
            });
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

    let queryString = "SELECT risposte.*, utenti.username, domande.testoDomanda FROM risposte,utenti, domande WHERE domanda= ?  AND risposte.utente=utenti.idUtente AND domande.idDomanda=risposte.domanda";
    con.query(queryString, [domanda], function (errQuery, result) {
        if (errQuery) {
            console.log(errQuery);
            error(req, res, new ERRORS.QUERY_EXECUTE({}));
        } else
            res.send({
                data: result
            });
    });
});



app.post("/api/getMessagesByReceiver", function (req, res) {
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
            let destinatario = req.body.destinatario;

            let queryString = "SELECT * FROM messaggi WHERE (mittente= ? AND destinatario = ?) OR (mittente=? AND destinatario = ?) ORDER BY data ASC";
            con.query(queryString, [utente, destinatario, destinatario, utente], function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {
                    let token = createToken({
                        "_id": ctrlToken.payload._id,
                        "user": ctrlToken.payload.user
                    });
                    res.send({
                        data: result,
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



app.post("/api/getChats", function (req, res) {

    console.log("servizio richiamato");
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

            //let queryString = "SELECT DISTINCT matched.*, utenti.* FROM matched, utenti WHERE (matched.idUtenteDomanda=? OR matched.idUtenteRisposta=?) AND (utenti.idUtente != ?) ";
            let queryString = "SELECT DISTINCT matched.*, utenti.idUtente, utenti.username, utenti.nome, utenti.cognome, utenti.foto FROM matched, utenti WHERE (matched.idUtenteDomanda=? OR matched.idUtenteRisposta=?) AND (utenti.idUtente != ?) AND (utenti.idUtente=matched.idUtenteRisposta OR utenti.idUtente=matched.idUtenteDomanda)";
            //console.log(queryString);

            con.query(queryString, [utente, utente, utente], function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {
                    res.send({
                        data: result
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



app.post("/api/sendMessage", function (req, res) {
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
            let destinatario = req.body.destinatario;
            let testo = req.body.testo;

            let queryString = "INSERT INTO messaggi(testoMessaggio, data,mittente,destinatario) VALUES (?,NOW(),?,?)";

            console.log(utente, destinatario, testo);
            console.log(queryString);
            con.query(queryString, [testo, utente, destinatario], function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {
                    let token = createToken({
                        "_id": ctrlToken.payload._id,
                        "user": ctrlToken.payload.user
                    });
                    res.send({
                        data: "Messagio inviato",
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



app.post("/api/startChat", function (req, res) {
    let ctrlToken = controllaToken(req, res);
    if (ctrlToken.allow) {
        if (!ctrlToken.payload.err_iat) {

            con = mySql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "social"
            });

            let utenteDomanda = ctrlToken.payload._id;
            let utenteRisposta = req.body.utenteRisposta;
            let domanda = req.body.domanda;
            let risposta = req.body.risposta;

            let queryString = "INSERT INTO messaggi(testoMessaggio, data,mittente,destinatario) VALUES (?, NOW(), ?,?),(?, NOW(), ?,?)";

            con.query(queryString, [domanda, utenteDomanda, utenteRisposta, risposta, utenteRisposta, utenteDomanda], function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {
                    let token = createToken({
                        "_id": ctrlToken.payload._id,
                        "user": ctrlToken.payload.user
                    });
                    res.send({
                        data: "Chat iniziata!",
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



app.post("/api/match", function (req, res) {
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
            let utenteRisposta = req.body.utenteRisposta;
            let queryString = "INSERT INTO matched(idUtenteDomanda,idUtenteRisposta, matched, data) VALUES (?,?,'T',NOW())";


            con.query(queryString, [utente, utenteRisposta], function (errQuery, result) {
                if (errQuery) {
                    //console.log(errQuery);
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                } else {
                    let token = createToken({
                        "_id": ctrlToken.payload._id,
                        "user": ctrlToken.payload.user
                    });
                    res.send({
                        data: "Match creato!",
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


app.post("/api/processUpFile", function (req, res, next) {
    let f = req.files.myFile;
    console.log("F=> ", f);
    //console.log(JSON.parse(req.param));

    let output = __dirname + '/img/' + f.name;
    f.mv(output, function (err) {
        if (err) {
            res.send(err);
        } else {
            console.log("File moved to: " + output);
            res.send({
                data: "fileUploaded"
            });
        }
    })
})

function error(req, res, err) {
    res.status(err.code).send(err.message);
}