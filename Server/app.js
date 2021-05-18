const express = require('express')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload');
const app = express()
const cors=require('cors');
//puntando a ./routes e non a user.routes viene richiamato il file index.js di default che a sua volta delega la risoluzione delle dichiarazione ai vari sottofiles
const routes = require('./routes')


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

app.listen(port, () => console.log('Server running on port ' + port));

module.exports = {
  app
}
