const { parse } = require('url');
const next = require('next');
const { createServer } = require('http');
const { createServer: createHttpsServer } = require('https');
/* const fs = require('fs'); */
require('dotenv').config({ path: '.env' });
const { ioHttps, ioHttp } = require('./servers/websocket/socketServer');
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev });

const handle = app.getRequestHandler();
/* 
const httpsOptions = {
  key: fs.readFileSync('cert/privadakey.key'),
  cert: fs.readFileSync('cert/localhost.pem'),
};
 */
app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const { PORTHTTP, PORTHTTPS } = process.env

  httpServer.listen(PORTHTTP, (err) => {
    if (err) throw err;
    console.log(`Iniciando na porta ${PORTHTTP} (HTTP)`);
  });

  /*  const httpsServer = createHttpsServer(httpsOptions, (req, res) => {
     const parseUrl = parse(req.url, true);
     handle(req, res, parseUrl);
   }) */
  /* 
    httpsServer.listen(PORTHTTPS, (err) => {
      if (err) throw err;
      console.log(`Iniciando na porta ${PORTHTTPS} (HTTPS)`);
    });
    ioHttps.attach(httpsServer) */
  ioHttp.attach(httpServer)
});