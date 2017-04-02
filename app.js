var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path')
  
// Start server
server.listen(3000);

// Set up 'public' folder 
app.use(express.static(path.join(__dirname, 'public')))

// Point / to index.html (could just put index.html in public but leaving for reference)
app.use('/', function(req, res, next){
  res.sendFile('public/html/index.html', { root : __dirname })
})

// Users array
var users = [];

// Create new websocket 
io.sockets.on('connection', function (socket) {
  // Set user name
  socket.on('setUserName', function (userName) {

    if (userName === null || userName === ''){
      userName = 'Guest'
    }

    socket.userName =  userName

    var connected_msg = '+ ' + userName + ' connected +';
    console.log(connected_msg);
    io.sockets.emit('broadcast-msg', connected_msg);
    users.push(userName); //add to array
    io.sockets.emit('updateUsers', users); // update list			
  });

  //user msgs
  socket.on('emit-msg', function (msg) {
    console.log(socket.userName + ':', msg);
    io.sockets.emit('broadcast-msg', socket.userName + ': ' + msg);
  });

  //user disconnection
  socket.on('disconnect', function() {
    //remove from array
    var pos = users.indexOf(socket.userName);
    if (pos >= 0) {
      users.splice(pos, 1);
    };
    io.sockets.emit('updateUsers', users);	// update list
    var dcMsg = '- ' + socket.userName + ' disconnected -';
    io.sockets.emit('broadcast-msg',dcMsg);
    console.log(dcMsg)
  });
});
