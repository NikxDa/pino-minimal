const chalk = require("chalk");
const { format } = require("date-fns");
const figures = require("figures");

/**
 * Takes a line and parses it, returning a formatted line as result.
 * @param {String} line 
 * @param {String} [argv={}]
 * @returns {String}
 */
const parseLine = (line, argv = {}) => {
    try {
        // Parse the line as JSON
        const lineData = JSON.parse (line);
        const payload = {
            data: lineData,
            options: argv
        }

        // Format every item
        const timestamp = formatTimestamp (payload);
        const level = formatLevel (payload);
        const message = formatMessage (payload);
        const extras = formatExtras (payload);

        // Create inbetween characters
        let rightPointer = (timestamp || extras) ? ` ${figures.pointerSmall} ` : "";
        if (argv.colorize) rightPointer = chalk.dim (chalk.gray(rightPointer));

        // Return a formatted string
        return `${timestamp}${extras}${rightPointer}${level} ${message}`;
    } catch (err) {
        // If an error occurs, fall back to the original line
        return line;
    }
}

/**
 * Takes line data and parameters as an input and returns formatted and colored extras.
 * @param {Object} lineData 
 * @returns {String}
 */
const formatExtras = ({ 
    data, 
    options: { 
        colorize: shouldColorize,
        pid: showPid
    } 
}) => {
    // Grab PID
    const { pid } = data;
    
    // Format the date using date-fns
    let formattedPid = showPid ? `[${pid}]` : "";

    // Return colored string
    if (!shouldColorize) return formattedPid;
    return chalk.dim (chalk.gray(formattedPid));
}

/**
 * Takes line data and parameters as an input and returns a formatted and colored timestamp.
 * @param {Object} lineData 
 * @returns {String}
 */
const formatTimestamp = ({ data, options: { time: showTime, date: showDate, timestampKey, colorize } }) => {
    // Make sure there is a time variable
    if (data[timestampKey] === undefined) return "";
    
    // Create a date object
    const date = new Date (data[timestampKey]);

    // Prepare the formats
    const timeFragment = showTime ? "HH:mm:ss" : "";
    const dateFragment = showDate ? "dd.MM.yyyy" : "";
    
    // Check whether any are required
    if (!timeFragment && !dateFragment) {
        return "";
    }
    
    // Format the date using date-fns
    const delimiter = (timeFragment && dateFragment) ? " " : "";
    const formattedDate = format(date, `[${dateFragment}${delimiter}${timeFragment}]`);

    // Return colored string
    if (!colorize) return formattedDate;
    return chalk.dim (chalk.gray(formattedDate));
}

/**
 * Takes line data as an input and returns a formatted and colored level.
 * @param {Object} lineData 
 * @returns {String}
 */
const formatLevel = ({ data: { level }, options: { colorize } }) => {
    // Define existing levels
    const levels = {
        "trace":    [chalk.gray,    figures.ellipsis],
        "debug":    [chalk.cyan,    figures.bullet],
        "info":     [chalk.blue,    figures.info],
        "warn":     [chalk.yellow,  figures.warning],
        "error":    [chalk.red,     figures.cross],
        "fatal":    [chalk.red,     figures.cross],
    };

    // Try calculating the current level index
    const levelIndex = (level / 10) - 1;
    let levelString = Object.keys (levels) [levelIndex];
    let [levelColor, levelFigure] = levels [levelString] || [null, null];

    // Fallback for custom levels
    if (!levelString || !levelColor) {
        levelString = `custom`;
        levelColor = chalk.magenta;
        levelFigure = "★";
    }

    // Clear level color if colorization is unwanted
    if (!colorize) levelColor = _ => _;

    // Combine into an underlined and padded string
    const formattedString = figures(levelColor(levelFigure + " " + levelString));
    const padCharacters = Math.max (8 - levelString.length, 1);

    // Return
    return formattedString + " ".repeat(padCharacters);
}

/**
 * Takes line data as an input and returns a colored message.
 * @param {Object} lineData 
 * @returns {String}
 */
const formatMessage = ({ 
    data, 
    options: { 
        stacktrace: addStacktrace, 
        messageKey, 
        timestampKey, 
        colorize: shouldColorize
    } 
}) => {
    // Extract and color default message
    let message = data[messageKey];

    // Add an error stack if provided and enabled
    const { stack } = data;
    if (stack) {
        // Replace message with error details
        let lines = stack.split ("\n");
        message = lines.shift ();

        // Add error stack
        if (addStacktrace) {
            lines.forEach (line => {
                if (shouldColorize) line = chalk.dim (chalk.gray (line));
                message += `\n${line}`;
            });
        }
    }

    // If there is no message & there are unknown parameters, print them
    if (message === undefined) {
        // Remove known keys
        const knownKeys = ["level", "v", "pid", "hostname", "module", messageKey, timestampKey];
        const printableObject = Object
            .keys (data)
            .filter (key => !knownKeys.includes (key))
            .reduce ((acc, key) => ({ ...acc, [key]: data[key] }), {});

        // Check if there are any other keys
        if (Object.keys (printableObject).length === 0) {
            // If there are no custom keys, it must've been undefined
            message = "undefined | null";
        } else {
            // Show as object
            message = "Object";

            // Beautify the object with JSON.stringify
            const prettyObject = JSON.stringify(printableObject, null, 4)
            const lines = prettyObject.split ("\n");
    
            // Add them to the message
            lines.forEach (line => {
                if (shouldColorize) line = chalk.gray (line);
                const identation = " ".repeat(4);
                message += `\n${identation}${line}`;
            });
        }
    }

    // Return formatted message
    if (shouldColorize) message = chalk.gray (message);
    return message;
}

// Default exports
module.exports = parseLine;