const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require('fs');
//const mySql = require('mysql');
const fileupload = require('express-fileupload');
const { db } = require("../db");
const ERRORS = require('errors');

ERRORS.create({
    code: 602,
    name: 'HASH',
    defaultMessage: 'An error occured crypting your data'
});

const TIMEOUT=600;
const privateKey = fs.readFileSync("services/keys/private.key", "utf8");

const getUser = async  (idUtente, req, res)=>{
    let queryString = "SELECT * FROM  utenti WHERE idUtente=?";
    const result = await db.execute(queryString, [idUtente], req, res);
    return({
        data: result,
    });
}


const signUp= async  (user, mail, nome, cognome, foto, sesso, descrizione, posizione, dataNascita, pwd, req, res)=>{
    let queryMail = "SELECT idUtente FROM utenti WHERE mail=?";
    const ctrMail = await db.execute(queryMail, [mail], req, res);
    if(ctrMail.length!=0)
        return({
            code: 50,
            data: "Ti sei già registrato con questa mail"
        });
    else
    {
        let queryUser = "SELECT idUtente FROM utenti WHERE username=?";
        const ctrUser = await db.execute(queryUser, [user], req, res);
        if(ctrUser.length!=0)
            return({
                code: 50,
                data: "Username non disponibile, scegline un altro"
            });
        else
        {
            let saltRounds = 10;
            const hash=await bcrypt.hash(pwd, saltRounds);
            //TODO gestione errore
            let insertQuery = "INSERT INTO utenti(username, password, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita) VALUES (?,?,?,?,?,?,?,?,?,STR_TO_DATE(?, '%d-%m-%Y'))";
            let param=[user, hash, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita];
            const resultInsert= await db.execute(insertQuery, param, req, res);
            console.log("Result insert:",resultInsert)
            let token = createToken({
                "_id": resultInsert.insertId,
                "user": user
            });
            return({
                "token": token,
                "data": "Signed up!"
            });
        }
    }
}

const processUpFile= async (file, req, res)=>{
    let output = __dirname + '/img/' + file.name;
    file.mv(output, function (err) {
        if (err) {
            res.send(err);
        } else {
            console.log("File moved to: " + output);
            res.send({
                data: "fileUploaded"
            });
        }
    })
}

const login = async (mail, password, req, res) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("TEST MAIL=> " + re.test(String(mail).toLowerCase()));
    let queryString;
    if (re.test(String(mail).toLowerCase()))
        queryString = "SELECT * FROM utenti WHERE mail=?";
        else
        queryString = "SELECT * FROM utenti WHERE username=?";

    const result = await db.execute(queryString, [mail], req, res);
    const comp = await bcrypt.compare(password, result[0].password);

    if (comp) {
        let token = createToken({
            "_id": result[0].idUtente,
            "user": result[0].username
        });
        console.log("token " + token);
        return {
            "token": token,
            "data": result
        };
    } else {
        return {
            "errore": "errore"
        };
    }
}

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
    login,
    getUser,
    signUp,
    processUpFile,
  }

