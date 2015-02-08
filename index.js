
var socket = require("socket.io-client")('http://127.0.0.1:5000');
var readline = require('readline');


var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('nerdtalk> ');
rl.prompt();
rl.on('line', function(line)
{
    socket.emit('message', line);
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});



socket.on('connect', function()
{
    console.log("connected, searching.");
    find();
});

socket.on('found', function (data)
{
    console.log("found!");
});

socket.on('receive', function (data)
{

    console.log(data);


});


/*socket.on('receive', function (data)
{

    console.log(data);


});*/

//socket.emit('message', message);
//find();


function find()
{
        socket.emit('find', {user: "jason"});

}
