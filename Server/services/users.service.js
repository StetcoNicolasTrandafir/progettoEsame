const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require('fs');
//const mySql = require('mysql');
const fileupload = require('express-fileupload');
const {
    db
} = require("../db");
const ERRORS = require('errors');

ERRORS.create({
    code: 602,
    name: 'HASH',
    defaultMessage: 'An error occured crypting your data'
});

ERRORS.create({
    code: 606,
    name: 'HASH_COMPARE',
    defaultMessage: 'An error occured comparing hashes'
});

const TIMEOUT = 600;
const privateKey = fs.readFileSync("services/keys/private.key", "utf8");

const getUser = async (idUtente, req, res) => {
    let queryString = "SELECT * FROM  utenti WHERE idUtente=?";
    const result = await db.execute(queryString, [idUtente], req, res);
    return ({
        data: result,
    });
}

const changePassword = async (utente, oldPwd, newPwd, req, res) => {
    let quesryString = "SELECT username, password FROM utenti WHERE idUtente=?";
    const result = await db.execute(quesryString, [utente], req, res);
    console.log(result);
    const comp = await bcrypt.compare(oldPwd, result[0].password);
    if (comp) {
        let saltRounds = 10;
        let hash;
        try {
            hash = await bcrypt.hash(newPwd, saltRounds);
        } catch (e) {
            console.log(e);
        }
        if (hash) {
            quesryString = "UPDATE utenti SET password=? WHERE idUtente=?";
            const resultUpdate = await db.execute(quesryString, [hash, utente]);
            console.log(resultUpdate);
            return ({
                data: "Password cambiata con successo"
            });
        } else
            error(req, res, new ERRORS.HASH({}));


    } else
        return ({
            data: "Password errata"
        })
}

const updatePosition = async (utente, position, req, res) => {
    let quesryString = "UPDATE utenti SET posizione=? WHERE idUtente=?";
    const resultUpdate = await db.execute(quesryString, [position, utente], req, res);

    return ({
        data: "Posizione cambiata con successo"
    });
}






const signUpPersonalData = async (nome, cognome, sesso, dataNascita, mail, pwd, req, res) => {

    let queryMail = "SELECT idUtente FROM utenti WHERE mail=?";
    const ctrMail = await db.execute(queryMail, [mail], req, res);
    if (ctrMail.length != 0)
        return ({
            code: 50,
            data: "Ti sei già registrato con questa mail"
        });
    else {
        let saltRounds = 10;
        try {
            hash = await bcrypt.hash(pwd, saltRounds);
        } catch (e) {
            console.log(e);
        }
        if (hash) {
            let insertQuery = "INSERT INTO utenti(password, nome, cognome, mail, sesso, dataNascita) VALUES (?,?,?,?,?,STR_TO_DATE(?, '%d-%m-%Y'))";
            let param = [hash, nome, cognome, mail, sesso, dataNascita];
            const resultInsert = await db.execute(insertQuery, param, req, res);
            console.log("Result insert:", resultInsert)
            let token = createToken({
                "_id": resultInsert.insertId,
                //"user": user
            });
            return ({
                "token": token,
                "data": resultInsert.insertId
            });
        } else
            error(req, res, new ERRORS.HASH({}));

    }
}



const signUpProfile = async (user, foto, descrizione, posizione,userID, req, res) => {


    let queryUser = "SELECT idUtente FROM utenti WHERE username=?";
    const ctrUser = await db.execute(queryUser, [user], req, res);
    if (ctrUser.length != 0)
        return ({
            code: 50,
            data: "Username non disponibile, scegline un altro"
        });
    else {

        let insertQuery = "UPDATE utenti SET username=?, foto=?, descrizione=?, posizione=? WHERE idUtente=?";
        let param = [user,foto, descrizione, posizione,userID];
        const resultInsert = await db.execute(insertQuery, param, req, res);
        //console.log("Result insert:", resultInsert)
        let token = createToken({
            "_id": userID,
            "user": user
        });
        return ({
            "token": token,
            "data": userID
        });

    }
}

const getPositions= async(user, req, res)=>{
    let queryString="SELECT idUtente, posizione, username, SQRT(POWER(((SELECT SUBSTRING_INDEX(posizione,';',1) FROM utenti WHERE idUtente=?)-SUBSTRING_INDEX(utenti.posizione,';',1)),2)";
    queryString+="+ POWER(((SELECT SUBSTRING_INDEX(posizione,';',-1) FROM utenti WHERE idUtente=?)-SUBSTRING_INDEX(utenti.posizione,';',-1)),2)";
    queryString+=") AS DISTANZA FROM utenti ORDER BY DISTANZA ASC LIMIT 21";

    const result= await db.execute(queryString, [user, user]);
    console.log("RESULT=================>", result);
    return({data:result});
    
}



const undoSignUp=async(userId, req, res)=>{
    let query="DELETE  FROM utenti WHERE idUtente=?"
    const result=await db.execute(query,[userId], req, res);
    console.log("RESULT=====>",result);
    return ({
        data:"Registrazione annullata"
    })
}



const signUp = async (user, mail, nome, cognome, foto, sesso, descrizione, posizione, dataNascita, pwd, req, res) => {

    let queryMail = "SELECT idUtente FROM utenti WHERE mail=?";
    const ctrMail = await db.execute(queryMail, [mail], req, res);
    if (ctrMail.length != 0)
        return ({
            code: 50,
            data: "Ti sei già registrato con questa mail"
        });
    else {
        let queryUser = "SELECT idUtente FROM utenti WHERE username=?";
        const ctrUser = await db.execute(queryUser, [user], req, res);
        if (ctrUser.length != 0)
            return ({
                code: 50,
                data: "Username non disponibile, scegline un altro"
            });
        else {
            let saltRounds = 10;
            try {
                hash = await bcrypt.hash(pwd, saltRounds);
            } catch (e) {
                console.log(e);
            }
            if (hash) {
                let insertQuery = "INSERT INTO utenti(username, password, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita) VALUES (?,?,?,?,?,?,?,?,?,STR_TO_DATE(?, '%d-%m-%Y'))";
                let param = [user, hash, nome, cognome, mail, foto, posizione, sesso, descrizione, dataNascita];
                const resultInsert = await db.execute(insertQuery, param, req, res);
                console.log("Result insert:", resultInsert)
                let token = createToken({
                    "_id": resultInsert.insertId,
                    "user": user
                });
                return ({
                    "token": token,
                    "data": resultInsert.insertId
                });
            } else
                error(req, res, new ERRORS.HASH({}));
        }
    }
}

const processUpFile = async (file, req, res) => {
    let output = __dirname + '/../img/' + file.name;
    console.log("OOUUTTPPUUTT ==> " + output);
    file.mv(output, function (err) {
        if (err) {
            res.send(err);
        } else {
            console.log("File moved to: " + output);
            return ({
                data: "fileUploaded"
            });
        }
    })
}

const updatePicture = async (file, utente, req, res) => {
    let foto = file.name.split('.')[file.name.split('.').length - 1];
    console.log(foto);

    quesryString = "UPDATE utenti SET foto=? WHERE idUtente=?";
    const resultUpdate = await db.execute(quesryString, [foto, utente], req, res);

    let output = __dirname + '/../img/' + file.name;
    console.log("OOUUTTPPUUTT ==> " + output);
    file.mv(output, function (err) {
        if (err) {
            res.send(err);
        } else {
            console.log("File moved to: " + output);
            //console.log(resultUpdate);
            return ({
                data: "Foto aggiornata con successo!"
            });
        }
    })
}


const updateUser = async (idUtente, user, mail, descrizione, req, res) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("TEST MAIL=> " + re.test(String(mail).toLowerCase()));
    if (!re.test(String(mail).toLowerCase()))
        return ({
            data: "Inserisci un indirizzo e-mail valido"
        })
    else {
        let ctrMailQuery = "SELECT idUtente FROM utenti WHERE mail=? AND idUtente!=?";
        const mailResult = await db.execute(ctrMailQuery, [mail, idUtente], req, res);
        if (mailResult.length != 0) {
            return ({
                data: "Indirizzo e-mail già utilizzato"
            });
        } else {
            let ctrUserQuery = "SELECT idUtente FROM utenti WHERE username=? AND idUtente!=?";
            const userResult = await db.execute(ctrUserQuery, [user, idUtente], req, res);
            if (userResult.length != 0) {
                return ({
                    data: "Username già utilizzato, scegline un altro"
                });
            } else {
                let queryString = "UPDATE utenti SET username=?, mail=?, descrizione=? WHERE idUtente=?";
                const result = await db.execute(queryString, [user, mail, descrizione, idUtente], req, res);
                let token = createToken({
                    "_id": idUtente,
                    "user": user
                });
                return ({
                    "token": token,
                    "data": "Dati modificati con successo"
                });
            }
        }
    }
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
    if (result.length > 0) {

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
                error: "Password errata"
            };
        }
    } else
        return ({
            error: "Username o mail errata"
        });

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
    undoSignUp,
    signUpPersonalData,
    signUpProfile,
    processUpFile,
    changePassword,
    updateUser,
    updatePosition,
    updatePicture,
    getPositions
}