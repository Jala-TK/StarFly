/* const https = require('https'); */
const http = require('http');
const { Server } = require('socket.io');

const ioHttp = new Server(http.createServer());
/* const ioHttps = new Server(https.createServer());
 */
const handleConnection = (io) => {
  io.on('connection', (socket) => {
    socket.on('clientMessage', (data) => {
      console.log('Mensagem IO: ' + data);
      ioHttp.emit('message', data);
      /*   ioHttps.emit('message', data); */
    });

  })
};
handleConnection(ioHttp);
/* handleConnection(ioHttps); */

module.exports = { ioHttp, /*  ioHttps  */ };