#!/usr/bin/env node

// Necessary imports
const readline = require("readline");
const yargs = require ("yargs");
const chalk = require ("chalk");
const parseLine = require("./util");

// Configure yargs
yargs
    .option("time", {
        alias: "t",
        default: true,
        describe: "Show time details",
        type: "boolean"
    })
    .option("date", {
        alias: "d",
        default: false,
        describe: "Show date details",
        type: "boolean"
    })
    .option("stacktrace", {
        alias: "s",
        default: true,
        describe: "Show stack traces for errors",
        type: "boolean"
    })
    .option("colorize", {
        alias: "c",
        default: chalk.supportsColor.has256,
        describe: "Print log messages colorized",
        type: "boolean"
    })
    .option("crlf", {
        alias: "f",
        default: true,
        describe: "Print line ends with <crlf> instead of <lf>",
        type: "boolean"
    })
    .option("timestampKey", {
        default: "time",
        describe: "The JSON key to read the timestamp from"
    })
    .option("messageKey", {
        default: "msg",
        describe: "The JSON key to read the message from"
    });

// Create an stdIn interface
const interface = readline.createInterface ({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// Read incoming lines
interface.on ("line", line => {
    const result = parseLine (line, yargs.argv);
    const lineEnd = yargs.crlf ? "\r\n" : "\n";
    process.stdout.write (`${result}${lineEnd}`);
});