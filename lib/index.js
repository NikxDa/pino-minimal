const readline = require("readline");
const yargs = require ("yargs");
const parseLine = require("./util");
process.argv = yargs.argv

const interface = readline.createInterface ({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

interface.on ("line", line => console.log (parseLine (line)));