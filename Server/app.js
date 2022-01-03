const express = require('express')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload');
const app = express()
const cors = require('cors');
//puntando a ./routes e non a user.routes viene richiamato il file index.js di default che a sua volta delega la risoluzione delle dichiarazione ai vari sottofiles
const routes = require('./routes');
const socketFunctions = require('./socket');
const { get } = require('express/lib/response');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync("keys/private.key", "utf8");


const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"]
  }
})



server.listen(3000);
const port = 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cors());
//il modulo app va a delegare la dichiarazione delle api al modulo routes
app.use('/', routes);
app.use("/img", express.static('./img'));
app.use("/", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,token');

  next();
});

//usersConnections=[{socketId:123, user:1},{socketId:789, user:11},{socketId:453, user:13}];
usersConnections = [];
app.listen(port, () => { console.log('Server running on port ' + port); });

userIds = [];


io.on('connection', (socket) => {

  //console.log("SOCKET INTERO ====>",socket);
  //console.log("SOCKET.HANDSHAKE ====>",socket.handshake);
  //console.log("TOKEN.HANDSHAKE.QUERY ====>",socket.handshake.query);

  let ctrlToken = getIdByToken(socket.handshake.query.token);
  console.log("NUOVA CONNESSIONE, UTENTE: " + ctrlToken.payload.user + " ID UTENTE: " + ctrlToken.payload._id);
  usersConnections.push({ socketId: socket.id, idUtente: ctrlToken.payload._id });

  socket.on('message-sent', (data) => {
    console.log("MESSAGE SENT")
    //gestione del messaggio sul DB 
    //socketFunctions.sendMessage(data.text, data.from, data.to, req, res);

    //controllo se c'è una connessione aperta con l'utente destinatario
    if (getConnectionID(data.to, ctrlToken.payload._id) == -1) { //se non c'è, invio notifica push
      console.log("utente NON CONNESSO");
      console.log(usersConnections);
      //TODO invio notifica push
      //ANCHOR: le notifiche le inviamo anche se l'utente non è connesso 
    } else   //se l'utente è connesso, emissione evento per gestire la ricezione del messaggio
    {
      console.log("utente CONNESSO");
      console.log(usersConnections);
      //console.log(usersConnections);
      io.to(usersConnections[getConnectionID(data.to, ctrlToken.payload._id)].socketId).emit('message-received', { from: data.from, message: "TEST" })
    }
  });

  socket.on('message-seen', (data) => {

    //gestione del messaggio sul DB 
    socketFunctions.view(data.from, data.to, req, res);

    if (getConnectionID(data.to, ctrlToken.payload._id) == 1) {
      console.log("utente CONNESSO");
      io.to(data.to).emit('message-viewed', { message: data.message })
    }
  })


  socket.on('answer-sent', (data) => {
    //socketFunctions.sendAnswer(data.text, data.question, data.from, req, res);

    if (getConnectionID(data.to, ctrlToken.payload._id) == -1) { //se non c'è, invio notifica push
      console.log("utente NON CONNESSO");

      //TODO invio notifica push
    } else   //se l'utente è connesso, emissione evento per gestire la ricezione del messaggio
    {
      console.log("utente CONNESSO");

      io.to(data.to).emit('answer-received', { from: data.from, message: data.message, question: data.question })
    }
  })


  socket.on('accept-answer', (data) => {

    let indexId = getConnectionID(data.to, ctrlToken.payload._id);
    //controllo se c'è una connessione aperta con l'utente destinatario
    if (indexId == -1) { //se non c'è, invio notifica push
      console.log("utente NON CONNESSO");

    } else   //se l'utente è connesso, emissione evento per gestire la ricezione del messaggio
    {
      console.log("utente CONNESSO");

      io.to(usersConnections[indexId].socketId).emit('answer-accepted', { from: data.from, message: data.message })
    }
  });

  socket.on('disconnecting', () => {
    usersConnections = usersConnections.filter(i => i.idUtente != ctrlToken.payload._id);
  });

});



function getIdByToken(token) {
  let ctrlToken = {
    allow: false,
    payload: {}
  };
  jwt.verify(token, privateKey, function (err, data) {
    ctrlToken.allow = true;
    if (!err) {
      //ctrlToken.allow=true;
      ctrlToken.payload = data;
    } else {
      ctrlToken.payload = {
        "err_iat": true,
        "message": "ERRORE NON IDENTIFICATO"
      };
    }


  });
  return ctrlToken;
}

function getConnectionID(id, myId) {
  // return usersConnections.find((conn)=>conn.id===id);
  for (let i = 0; i < usersConnections.length; i++)
    if (usersConnections[i].idUtente == id && id != myId)
      return i;

  return -1;
}


module.exports = {
  app
}
