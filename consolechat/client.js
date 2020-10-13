const
    socket   = require('socket.io-client')('ws://localhost:8080'),
    colors   = require('colors'),
    readline = require('readline')
        .createInterface({input: process.stdin, output: process.stdout});

const 
    name = process.argv[2],
    room = process.argv[3];

const input = question => 
    new Promise(resolve => 
        readline.question(question||'', ans => 
            resolve(ans)));

socket.on('connect', () => {
    console.log('CONNECTED TO THE SERVER!'.bgRed);
    socket.emit('new-client', name, room);
    main();
});

socket.on('new-client', name => {
    console.log(`${name} CONNECTED`.bgCyan);
});

socket.on('room-info', info => {
    console.log(`ROOM INFO: ${info}`.bgRed);
});

socket.on('message', msg => {
    console.log(msg.cyan);
});

socket.on('client-left', msg => {
    console.log(msg.bgCyan);
});

socket.on('disconnect', () => {
    console.log('DISCONNECTED FROM THE SERVER!'.bgRed);
});

async function main(){
    while(true){
        const line = await input();
        socket.emit('message', line);
    }
}