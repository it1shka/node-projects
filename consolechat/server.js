const io = require('socket.io')(8080);
io.on('connection', socket => {

    console.log('CONNECTION!');

    socket.on('new-client', (name, room) => {
        socket.name = name;
        socket.room = room;
        socket.join(room);
        socket.broadcast.to(room).emit('new-client', name);

        const info = Object.values(io.sockets.sockets)
            .filter(e => e.room == room).map(e => e.name);
        socket.emit('room-info', info);
    });

    socket.on('message', msg => {
        socket.broadcast.to(socket.room)
            .emit('message', `${socket.name}: ${msg}`);
    });

    socket.on('disconnect', () => {
        socket.broadcast.to(socket.room).emit('client-left', 
            `${socket.name} HAS LEFT THE SERVER!`);
    });
});