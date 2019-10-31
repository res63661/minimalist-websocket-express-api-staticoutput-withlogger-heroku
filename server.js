
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var bodyParser = require('body-parser');
//var cors = require('cors');

const PORT = process.env.PORT || 3002;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);

const loggerClass = function(){
    return Object.assign(this, {
        loggit: (msg)=>{
            console.log(msg);
        }
    })
}

const writeSocket = (msg)=>{
    wss.clients.forEach((client) => {
        client.send(msg);
      });
}

const logger = Object.assign(
    loggerClass.call({}),
    {
        loggit: (msg)=>{
            console.log(msg);
            writeSocket(msg);
        }
    });


//Create app server.
const app = express();
//app.use(cors());
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.get('/', function (req, res, next) {
    res.json([
        { id: 1, username: "dave" },
        { id: 2, username: "stu" }
    ]);

    logger.loggit("Hi from get");
});

const PORT_APP_SERVER = 3001;
app.listen(PORT_APP_SERVER, () => {
    console.log("Server up and listening on " + PORT_APP_SERVER);
})