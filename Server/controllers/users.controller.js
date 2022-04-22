const {
  usersService
} = require("../services")
const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync("keys/private.key", "utf8");
const ERRORS = require('errors');
const {
  crypto
} = require("../crypto");


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



//CHIAMATE

//PRIMA FASE REGISTRAZIONE
//controllo le credenziali (username e mail) non siano già presenti nel DB
const signUpCheckCredentials = async (req, res, next) => {
  let user = req.body.user;
  let mail = req.body.mail;

  try {

    const risultato = await usersService.signUpCheckCredentials(user, mail, req, res);
    console.log("risultato", risultato);
    res.send(risultato);
    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}


const signUpInsertUser = async (req, res, next) => {

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

  foto = (foto.split('.')[foto.split('.').length - 1]);

  try {
    //estraggo ed elaboro i dati tramite il service userService
    const risultato = await usersService.signUpInsertUser(user, mail, nome, cognome, foto, sesso, descrizione, posizione, dataNascita, password, req, res);
    console.log("risultato", risultato);
    res.send(risultato);

    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}


const updateUser = async (req, res, next) => {

  let ctrlToken = await controllaToken(req, res);
  let utente = ctrlToken.payload._id;
  let user = req.body.user;
  let mail = req.body.mail;
  let descrizione = req.body.descrizione;

  try {
    const risultato = await usersService.updateUser(utente, user, mail, descrizione, req, res);
    res.send(risultato);
    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}

const updatePosition = async (req, res, next) => {

  let ctrlToken = await controllaToken(req, res);
  let utente = ctrlToken.payload._id;
  let posizione = req.body.posizione;
  console.log(req.body)
  try {
    const risultato = await usersService.updatePosition(utente, posizione, req, res);
    res.send(risultato);
    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}


const getPositions=async(req, res, next)=>{
  let ctrlToken = await controllaToken(req, res);
  let user = ctrlToken.payload._id;
  try {
    const risultato = await usersService.getPositions(user, req, res);
    res.send(risultato);
    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}


const changePassword = async (req, res, next) => {

  let ctrlToken = await controllaToken(req, res);
  let utente = ctrlToken.payload._id;
  const oldPwd = req.body["oldPassword"];
  const newPwd = req.body["newPassword"];
  try {
    const risultato = await usersService.changePassword(utente, oldPwd, newPwd, req, res);
    res.send(risultato);
    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}


const login = async (req, res, next) => {

  const id = req.body["mail"];
  const pwd = req.body["password"];
  try {
    const risultato = await usersService.login(id, pwd, req, res);
    console.log("risultato", risultato);
    res.send(risultato);

    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}

const prova = async (req, res, next) => {
  res.send({
    data: "funanzia"
  })
}

const processUpFile = async (req, res, next) => {

  let f = req.files.myFile;
  try {
    const risultato = await usersService.processUpFile(f, req, res);
    res.send(risultato);

    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}

async function updatePicture(req, res, next) {
  let f = req.files.myFile;
  let ctrlToken = await controllaToken(req, res);
  let id = ctrlToken.payload._id;
  try {
    const risultato = await usersService.updatePicture(f, id, req, res);
    res.send(risultato);

    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}

const getUser = async (req, res, next) => {

  let ctrlToken = await controllaToken(req, res);

  let id = ctrlToken.payload._id;
  try {
    const risultato = await usersService.getUser(id, req, res);
    res.send(risultato);

    next();
  } catch (e) {
    console.log("test");
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}


//FUNZIONI COMUNI
const controlloToken = async (req, res, next) => {
  let ctrlToken = await controllaToken(req, res);
  //console.log(ctrlToken);
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
    error(req, res, new ERRORS.TOKEN_DOESNT_EXIST({}));
  }
}


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

function createToken(obj) {
  let token = jwt.sign({
      '_id': obj._id,
      'user': obj.user,
      'iat': Math.floor(Date.now() / 1000),
      'exp': Math.floor(Date.now() / 1000 + usersService.TIMEOUT)
    },
    privateKey
  );
  return token;
}

function error(req, res, err) {
  res.status(err.code).send(err.message);
}


module.exports = {
  login,
  signUpInsertUser,
  signUpCheckCredentials,
  getUser,
  processUpFile,
  changePassword,
  updateUser,
  updatePosition,
  updatePicture,
  controlloToken,
  prova,
}
