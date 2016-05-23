const http = require('http');
var demand = require('./demand');
var supply = require('./supply');
const server = http.createServer(function (req, res) {
  res.end();
  console.log("started");
});
demand();
supply();
server.on('clientError', function (err, socket) {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(3002);
