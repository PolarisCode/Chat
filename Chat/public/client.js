(function () {
    var socket = io(),
        form = $('form'),
        messageList = $('#messages'),
        userList = $('#users');
    
    var person = prompt("Please enter your name");
    
    socket.emit('userEnter', person);
    
    form.submit(function () {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    
    function normalizeUsername(username) {
        return username.replace(/-/g, '').replace(/:/g, '').replace(/\./g, '');
    }
    
    socket.on('chat message', function (msg) {
        messageList.append($('<li>').text(msg));
    });
    
    socket.on('userEnter', function (users) {
        if (users) {
            userList.empty();
            for (var user in users) {
                userList.append($('<li>').text(users[user]).attr('id', normalizeUsername(users[user])));
            }
        }
    });
    
    socket.on('userExit', function (username) {
        userList.find('#' + normalizeUsername(username)).remove();
    });
})();