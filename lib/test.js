// Requirements
const { it, describe } = require("mocha");
const chalk = require("chalk");
const parseLine = require("./util");
const assert = require ("assert");
const figures = require ("figures");
const hasAnsiCodes = require ("has-ansi");

// Prepare default yargs argv
const argvMock = {
    time: true,
    date: false,
    timestampKey: "time",
    messageKey: "msg",
    stacktrace: true,
    colorize: true,
    crlf: false
};

// Prepare a default Pino output
const pinoMock = (data = {}, messageEmpty = false) => {
    return JSON.stringify ({
        ...data,
        level: data.level || 10,
        time: data.time || (new Date).getTime (),
        msg: messageEmpty ? undefined : data.message || "custom message",
        stack: data.stack || undefined
    });
}

describe ("Basic functionality", _ => {
    it ("should print timestamps correctly", done => {
        const date = new Date();
    
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
    
        const timeString = `${hours}:${minutes}:${seconds}`;
        const data = parseLine (pinoMock ({ time: date.getTime () }), argvMock);
    
        assert.equal (data.includes (`[${timeString}]`), true);
        assert.equal (data.includes (chalk.gray._styles[0].open), true);
        assert.equal (data.includes (chalk.dim._styles[0].open), true);
    
        done ();
    })

    it ("should print messages correctly", done => {
        const logValue = Math.random ().toString(36);
        const data = parseLine (pinoMock ({ message: logValue }), argvMock);
    
        assert.equal (data.includes (chalk.gray (logValue)), true);
    
        done ();
    })

    it ("should print error message and stack correctly", done => {
        try {
            undefinedVar1 + undefinedVar2;
        } catch (err) {
            const data = parseLine (pinoMock ({ stack: err.stack }), argvMock);
            const lines = data.split ("\n");
            
            assert.equal (lines[0].includes ("ReferenceError: undefinedVar1 is not defined"), true);
            assert.equal (lines[1].includes ("    at "), true);
            assert.equal (lines[1].includes (chalk.dim._styles[0].open), true);
    
            done ();
        }
    })

    it ("should print objects correctly", done => {
        const data = parseLine (pinoMock ({ keyOne: "1", keyTwo: "2" }, true), argvMock);
        const lines = data.split ("\n");
        
        assert.equal (lines[0].includes ("Object"), true);
        assert.equal (lines[1].includes ("{"), true);
        assert.equal (lines[2].includes ("keyOne"), true);
        assert.equal (lines[3].includes ("keyTwo"), true);
        assert.equal (lines[4].includes ("}"), true);

        done ();
    })

    it ("should print undefined and null correctly", done => {
        const undefinedMock = parseLine (pinoMock ({ }, true), argvMock);
        assert.equal (undefinedMock.includes ("undefined | null"), true);

        done ();
    })

    it ("should pass invalid data through", done => {
        const invalidData = "some great non-json data";
        const data = parseLine (invalidData, argvMock);

        assert.equal (data, invalidData);

        done ();
    })
})

describe ("Command line arguments", _ => {
    it ("should accept a --date option", done => {
        const date = new Date();
    
        const days = String(date.getDate()).padStart(2, "0");
        const months = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
    
        const dateString = `${days}.${months}.${year}`;

        const withDateData = parseLine (pinoMock (
            { time: date.getTime () }), 
            { ...argvMock, date: true }
        );

        const withoutDateData = parseLine (pinoMock (
            { time: date.getTime () }), 
            { ...argvMock, date: false }
        );
    
        assert.equal (withDateData.includes (dateString), true);
        assert.equal (withoutDateData.includes (dateString), false);
    
        done ();
    })

    it ("should accept a --time option", done => {
        const mock = pinoMock ();
        const withTime = parseLine (mock, { ...argvMock, time: true });
        const withoutTime = parseLine (mock, { ...argvMock, time: false });
    
        assert.equal (/\[.+?\]/.test (withoutTime), false);
        assert.equal (/\[.+?\]/.test (withTime), true);
    
        done ();
    })

    it ("should accept a --stacktrace option", done => {
        try {
            undefinedVar1 + undefinedVar2;
        } catch (err) {
            const mock = pinoMock ({ stack: err.stack });

            const withStacktrace = parseLine (mock, { ...argvMock, stacktrace: true });
            const withoutStacktrace = parseLine (mock, { ...argvMock, stacktrace: false });

            assert.equal (withStacktrace.split ("\n").length > 1, true);
            assert.equal (withoutStacktrace.split ("\n").length, 1);
    
            done ();
        }
    })

    it ("should accept a --colorize option", done => {
        const mock = pinoMock ();

        const withColorize = parseLine (mock, { ...argvMock, colorize: true });
        const withoutColorize = parseLine (mock, { ...argvMock, colorize: false });

        assert.equal (hasAnsiCodes (withColorize), true);
        assert.equal (hasAnsiCodes (withoutColorize), false);

        done ();
    })

    it ("should accept a --messageKey option", done => {
        const mock = pinoMock ({
            message: "some message",
            realMessage: "real message"
        });

        const withCustomKey = parseLine (mock, { ...argvMock, messageKey: "realMessage" });
        const withoutCustomKey = parseLine (mock, { ...argvMock });

        assert.equal (withCustomKey.includes ("real message"), true);
        assert.equal (withoutCustomKey.includes ("some message"), true);

        done ();
    })

    it ("should accept a --timestampKey option", done => {
        const mock = pinoMock ({
            time: 1,
            realTime: (new Date).getTime ()
        });

        const withCustomKey = parseLine (mock, { ...argvMock, timestampKey: "realTime" });
        const withoutCustomKey = parseLine (mock, { ...argvMock });

        assert.notEqual (withCustomKey, withoutCustomKey);

        done ();
    })
})

describe ("Error levels", _ => {
    it ("should log traces correctly", done => {
        const data = parseLine (pinoMock ({ level: 10 }), argvMock);

        assert.equal (data.includes (figures.ellipsis), true);
        assert.equal (data.includes ("trace"), true);
        assert.equal (data.includes (chalk.gray._styles[0].open), true);

        done ();
    })

    // Test debugs
    it ("should log debugs correctly", done => {
        const data = parseLine (pinoMock ({ level: 20 }), argvMock);

        assert.equal (data.includes (figures.bullet), true);
        assert.equal (data.includes ("debug"), true);
        assert.equal (data.includes (chalk.cyan._styles[0].open), true);

        done ();
    })

    // Test info
    it ("should log infos correctly", done => {
        const data = parseLine (pinoMock ({ level: 30 }), argvMock);

        assert.equal (data.includes (figures.info), true);
        assert.equal (data.includes ("info"), true);
        assert.equal (data.includes (chalk.blue._styles[0].open), true);

        done ();
    })

    // Test warnings
    it ("should log warnings correctly", done => {
        const data = parseLine (pinoMock ({ level: 40 }), argvMock);

        assert.equal (data.includes (figures.warning), true);
        assert.equal (data.includes ("warn"), true);
        assert.equal (data.includes (chalk.yellow._styles[0].open), true);

        done ();
    })

    // Test errors
    it ("should log errors correctly", done => {
        const data = parseLine (pinoMock ({ level: 50 }), argvMock);

        assert.equal (data.includes (figures.cross), true);
        assert.equal (data.includes ("error"), true);
        assert.equal (data.includes (chalk.red._styles[0].open), true);

        done ();
    })

    // Test custom error levels
    it ("should log custom levels correctly", done => {
        const data = parseLine (pinoMock ({ level: 70 }), argvMock);

        assert.equal (data.includes (figures.star), true);
        assert.equal (data.includes ("custom"), true);
        assert.equal (data.includes (chalk.magenta._styles[0].open), true);

        done ();
    })   
})