module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('User Connected');
        socket.on('join', (params, callback) => {
            socket.join(params.room);
            callback();
        });
        socket.on('create-message', (message) => {
            console.log(message);
            io.to(message.room).emit('new-message', message);
        });
    });
}