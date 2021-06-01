const {
  usersService
} = require("../services")
const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync("keys/private.key", "utf8");
const ERRORS = require('errors');
const { crypto } = require("../crypto");


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
const signUp = async (req, res, next) => {
  
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
    const risultato = await usersService.signUp(user, mail, nome, cognome, foto, sesso, descrizione, posizione, dataNascita, password, req, res);
    console.log("risultato", risultato);
    res.send(risultato);

    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}


const updateUser = async (req, res, next) => {
  //recupero il parametro id dall'url della chiamata
  let ctrlToken = await controllaToken(req, res);
  let utente = ctrlToken.payload._id;
  let user = req.body.user;
  let mail = req.body.mail;
  // let nome = req.body.nome;
  // let cognome = req.body.cognome;
  //let foto = req.body.foto;
  // let sesso = req.body.sesso;
  let descrizione = req.body.descrizione;
  //let posizione = req.body.posizione;
  // let dataNascita = req.body.dataNascita;
  // let password = req.body.password;
  try {
    const risultato = await usersService.updateUser(utente,user, mail,descrizione, req, res);
    res.send(risultato);
    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}

const updatePosition= async(req, res, next)=>{
  let utente = ctrlToken.payload._id;
  let posizione = req.body.posizione;
  try {
    const risultato = await usersService.updatePosition(posizione, req, res);
    res.send(risultato);
    next();
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}

const changePassword = async (req, res, next) => {
  //recupero il parametro id dall'url della chiamata
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

const provaCrittografia= async (req, res)=>{
  let text= req.body.text;
  let hash= crypto.encrypt(text);
  let decrypted=crypto.decrypt(hash);
  res.send({
    testo: text,
    criptata:hash,
    decriptata: decrypted
  })
}

const login = async (req, res, next) => {
  //recupero il parametro id dall'url della chiamata
  const id = req.body["mail"];
  const pwd = req.body["password"];
  try {
    //estraggo ed elaboro i dati tramite il service userService
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
  //recupero il parametro id dall'url della chiamata
  let f = req.files.myFile;
  try {
    //estraggo ed elaboro i dati tramite il service userService
    const risultato = await usersService.processUpFile(f, req, res);
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
    //console.log("TOKEN => "+token);
    console.log(token + " - " + typeof (token));
    console.log(token + " - " + typeof (token));
    if (token != "undefined" && token != "null") {

      let result;
      try{
         result = await jwt.verify(token, privateKey);
      }
      catch (ex){
        console.log(ex);
      }
      //console.log(jwt.verify(token, privateKey));

      //console.log(result);
            

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
  getUser,
  controlloToken,
  signUp,
  processUpFile,
  prova,
  changePassword,
  updateUser,
  provaCrittografia
}
