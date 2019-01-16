let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

let http = require('http').Server(app);
let io = require('socket.io')(http);
io.origins('*:*');
io.on('connection', (socket) => {
    socket.on('disconnect' ,() => {
        io.emit('users-changed', {user: socket.eventNames, event: 'left'});
    });
    socket.on('set-nickname', (nickname) => {
        socket.nickname = nickname;
        io.emit('users-changed', {user: nickname, event: 'joined'});
    });
    socket.on('add-message', (message) => {
        io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});
    });
    socket.on('send-location', (data) => {
        io.emit('data', { data: data, from: socket.nickname, created: new Date() })
    })
});

var port = process.env.PORT || 3001;
http.listen(port, () => {
    console.log('liestening on http://localhost:' + port);
})
