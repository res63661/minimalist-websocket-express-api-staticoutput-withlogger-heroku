
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3002;
const INDEX = path.join(__dirname, 'index.html');

const server = express();

server.get("/",(req,res,next)=>{
    res.sendFile(INDEX);
});

const httpserver = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server:httpserver });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send("PORT: " + PORT + "   " + new Date().toTimeString());
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

/**Create a composition with override for loggit to write to 
 * web socket.
 */
const logger = Object.assign(
    loggerClass.call({}),
    {
        loggit: (msg)=>{
            console.log(msg);
            writeSocket(msg);
        }
    });


    server.get('/getUser', function (req, res, next) {
        res.json([
            { id: 1, username: "dave" },
            { id: 2, username: "stu" }
        ]);
    
        logger.loggit("getUser API was invoked.  You should see this output at your web socket listeners.");
    });
