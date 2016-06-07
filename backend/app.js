const http = require('http');
var generateDemandersAndSuppliers = require('./demandAndSupply');

const server = http.createServer(function (req, res) {
  res.end();
  console.log("started");
});
generateDemandersAndSuppliers();

server.on('clientError', function (err, socket) {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(3002);
