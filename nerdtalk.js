#!/usr/bin/env node

var socket = require("socket.io-client")("https://nerdtalk-server.herokuapp.com", {secure: true});
var readline = require("readline");
var updateNotifier = require("update-notifier");
var pkg = require("./package.json");
var colors = require("colors");
 
var rl = readline.createInterface(process.stdin, process.stdout);

updateNotifier({pkg: pkg, updateCheckInterval: 1}).notify({defer: false});

//After connecting to the server start looking for a partner.
socket.on("connect", function()
{
    socket.emit("find");
    console.log("Searching for a nerd.");
});

//Once a partner is found startup the chat prompt!
socket.on("found", function (data)
{
    setupPrompt();
});

//On message receive, output it!
socket.on("receive", function (data)
{
    console_out("nerd> ".cyan + data);
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
    var commandRegex = /[a-z]+\b/;
    
    rl.setPrompt("you> ".cyan, 5);
    rl.prompt();
    rl.on("line", function(line)
    {
        if (line[0] == "/" && line.length > 1 && line.match(commandRegex))
        {
            var cmd = line.match(commandRegex)[0];
            var arg = line.substr(cmd.length+2, line.length);
            command(cmd, arg);
        }
        else
        {
            socket.emit("chat message", line);
            rl.prompt();
        }
    }).on("close",function()
    {
        process.exit(0);
    });
}

//Hack to output on newline.
function console_out(msg, prompt) 
{
    if (typeof prompt == "undefined") prompt=true;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    
    if (prompt)
    {
        rl.prompt(true);
    }
}

function command(cmd, arg)
{
    switch (cmd) 
    {
        case "quit":
            rl.close();
            break;
    }
}
