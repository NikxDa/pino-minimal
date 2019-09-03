// Requirements
const { it } = require("mocha");
const chalk = require("chalk");
const parseLine = require("./lib/util");
const assert = require ("assert");
const figures = require ("figures");

// Prepare a default Pino output
const pinoMock = (data = {}) => {
    return JSON.stringify ({
        level: data.level || 10,
        time: data.time || (new Date).getTime (),
        msg: data.message || "custom message",
        stack: data.stack || undefined
    });
}

// Test time output
it ("should print timestamps correctly", done => {
    const date = new Date();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const timeString = `${hours}:${minutes}:${seconds}`;
    const data = parseLine (pinoMock ({ time: date.getTime () }));

    assert.equal (data.includes (`[${timeString}]`), true);
    assert.equal (data.includes (chalk.gray._styles[0].open), true);
    assert.equal (data.includes (chalk.dim._styles[0].open), true);

    done ();
})

// Test value output
it ("should output messages correctly", done => {
    const logValue = "custom message";
    const data = parseLine (pinoMock ({ message: logValue }));

    assert.equal (data.includes (chalk.gray (logValue)), true);

    done ();
})

// Test --date flag
it ("should show date with --date option", done => {
    const date = new Date();

    const days = String(date.getDate()).padStart(2, "0");
    const months = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    const dateString = `${days}.${months}.${year}`;
    const data = parseLine (pinoMock ({ time: date.getTime () }), { date: true });

    assert.equal (data.includes (dateString), true);

    done ();
})

// Test --minimal flag
it ("should hide timestamps with --minimal option", done => {
    const data = parseLine (pinoMock (), { minimal: true });

    assert.equal (/\[.+?\]/.test (data), false);

    done ();
})

// Test value output
it ("should print error message and stack correctly", done => {
    try {
        undefinedVar1 + undefinedVar2;
    } catch (err) {
        const data = parseLine (pinoMock ({ stack: err.stack }));
        const lines = data.split ("\n");
        
        assert.equal (lines[0].includes ("ReferenceError: undefinedVar1 is not defined"), true);
        assert.equal (lines[1].includes ("    at "), true);
        assert.equal (lines[1].includes (chalk.dim._styles[0].open), true);

        done ();
    }
})

// Test traces
it ("should log traces correctly", done => {
    const data = parseLine (pinoMock ({ level: 10 }));

    assert.equal (data.includes (figures.ellipsis), true);
    assert.equal (data.includes ("trace"), true);
    assert.equal (data.includes (chalk.gray._styles[0].open), true);

    done ();
})

// Test debugs
it ("should log debugs correctly", done => {
    const data = parseLine (pinoMock ({ level: 20 }));

    assert.equal (data.includes (figures.bullet), true);
    assert.equal (data.includes ("debug"), true);
    assert.equal (data.includes (chalk.cyan._styles[0].open), true);

    done ();
})

// Test info
it ("should log infos correctly", done => {
    const data = parseLine (pinoMock ({ level: 30 }));

    assert.equal (data.includes (figures.info), true);
    assert.equal (data.includes ("info"), true);
    assert.equal (data.includes (chalk.blue._styles[0].open), true);

    done ();
})

// Test warnings
it ("should log warnings correctly", done => {
    const data = parseLine (pinoMock ({ level: 40 }));

    assert.equal (data.includes (figures.warning), true);
    assert.equal (data.includes ("warn"), true);
    assert.equal (data.includes (chalk.yellow._styles[0].open), true);

    done ();
})

// Test errors
it ("should log errors correctly", done => {
    const data = parseLine (pinoMock ({ level: 50 }));

    assert.equal (data.includes (figures.cross), true);
    assert.equal (data.includes ("error"), true);
    assert.equal (data.includes (chalk.red._styles[0].open), true);

    done ();
})

// Test custom error levels
it ("should log custom levels correctly", done => {
    const data = parseLine (pinoMock ({ level: 70 }));

    assert.equal (data.includes (figures.star), true);
    assert.equal (data.includes ("custom"), true);
    assert.equal (data.includes (chalk.magenta._styles[0].open), true);

    done ();
})