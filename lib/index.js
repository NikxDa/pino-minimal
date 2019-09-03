#!/usr/bin/env node

const readline = require("readline");
const yargs = require ("yargs");
const chalk = require("chalk");
const parseLine = require("./util");

const interface = readline.createInterface ({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

interface.on ("line", line => console.log (parseLine (line, yargs.argv)));