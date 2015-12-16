var socket = io();

socket.emit('userEnter', new Date());

$('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

function normalizeUsername(username){
    return username.replace(/-/g, '').replace(/:/g, '').replace(/\./g, '')
}

socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

socket.on('userEnter', function (users) {
    if (users) {
        $('#users').empty();
        for (var user in users) {
            $('#users').append($('<li>').text(users[user]).attr('id', normalizeUsername(users[user])));
        }
    }
});

socket.on('userExit', function (username) {
    $('#users').find('#' + normalizeUsername(username)).remove();
});