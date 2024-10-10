const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const ioHttp = new Server(httpServer);

ioHttp.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log('Mensagem IO: ' + data);
    ioHttp.emit('message', data);
  });
});

module.exports = { ioHttp }; // Exporta o servidor do Socket.IO
