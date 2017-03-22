$(document).ready(function(){
    // connect with server
    var socket = io.connect();

    //print new data to #broadcast-msg
    socket.on('broadcast-msg', function(data) {
      console.log('Get broadcast msg: ', data);
      var msg = data + '<br/>';
      $('#chat').append(msg);
      $('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
    });

    //print new data to #users
    socket.on('updateUsers', function(data) {
      console.log('Get user msg: ', data);
      $('#users').html('');
      var msg = ''
      for (user in data){
        msg += data[user] + '<br/>';
      }  
      $('#users').append(msg);
    });

    //create new socket connection
    socket.on('connect', function(){

      socket.emit('setUserName', prompt('What do you call yourself?'));

      $('#msg-input').change(function() {
        var txt = $(this).val();
        $(this).val('');
        socket.emit('emit-msg', txt, function(data) {
          console.log('Emit Broadcast Msg: ', data);
        });
      });
    });
})
