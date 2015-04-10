#!/usr/bin/env node

var socket = require("socket.io-client")("http://nerdtalk-server.herokuapp.com");
var readline = require("readline");
var updateNotifier = require("update-notifier");
var pkg = require("./package.json");
 
var rl = readline.createInterface(process.stdin, process.stdout);

//Check and notify of update.
updateNotifier({pkg: pkg}).notify();

//After connecting to the server start looking for a partner.
socket.on("connect", function()
{
    socket.emit("find");
    console.log("Searching for nerd.");
});

//Once a partner is found startup the chat prompt!
socket.on("found", function (data)
{
    setupPrompt();
});

//On message receive, output it!
socket.on("receive", function (data)
{
    console_out("nerd> " + data);
});

//When remote user disconnects, close the app.
socket.on("user disconnected", function (data)
{
    console_out("Nerd disconnected.", false);
    rl.close();
});

//Configure readline for sending messages.
function setupPrompt()
{
    rl.setPrompt("you> ");
    rl.prompt();
    rl.on('line', function(line)
    {
        socket.emit("chat message", line);
        rl.prompt();
    }).on('close',function(){
        process.exit(0);
    });
}


function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}
