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

        // Format every item
        const timestamp = formatTimestamp ({ 
            ...lineData, 
            showDate: (argv.date && !argv.minimal),
            showTime: !argv.minimal
        });

        const level = formatLevel (lineData);
        const message = formatMessage (lineData);

        // Create inbetween characters
        const rightPointer = timestamp ? chalk.dim (chalk.gray(` ${figures.pointerSmall} `)) : "";

        // Return a formatted string
        return `${timestamp}${rightPointer}${level} ${message}`;
    } catch (err) {
        // If an error occurs, fall back to the original line
        return line;
    }
}

/**
 * Takes line data and parameters as an input and returns a formatted and colored timestamp.
 * @param {Object} lineData 
 * @returns {String}
 */
const formatTimestamp = ({ time, showDate = false, showTime = true }) => {
    // Make sure there is a time variable
    if (!time) return "";
    
    // Create a date object
    const date = new Date (time);

    // Prepare the formats
    const timeFragment = showTime ? "HH:mm:ss" : "";
    const dateFragment = showDate ? "dd.MM.yyyy" : "";
    
    // Check whether any are required
    if (!timeFragment && !dateFragment) {
        return "";
    }
    
    // Format the date using date-fns
    const delimiter = (timeFragment && dateFragment) ? " " : "";
    const formattedDate = format(date, `[${dateFragment}${delimiter}${timeFragment}]`)

    // Return colored string
    return chalk.dim (chalk.gray(formattedDate));
}

/**
 * Takes line data as an input and returns a formatted and colored level.
 * @param {Object} lineData 
 * @returns {String}
 */
const formatLevel = ({ level }) => {
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

    // Combine into an underlined and padded string
    const formattedString = figures(levelColor(levelFigure)) + " " + levelColor (chalk.underline (levelString));
    const padCharacters = Math.max (8 - levelString.length, 1);

    // Return
    return formattedString + " ".repeat(padCharacters);
}

/**
 * Takes line data as an input and returns a colored message.
 * @param {Object} lineData 
 * @returns {String}
 */
const formatMessage = ({ msg, stack }) => {
    // Color default message
    let message = chalk.gray (msg);

    // Add an error stack if provided
    if (stack) {
        // Replace message with error details
        let lines = stack.split ("\n");
        message = chalk.gray (lines.shift ());

        // Add error stack
        lines.forEach (line => {
            message += chalk.dim (chalk.gray (`\n${line}`));
        });
    }

    // Return formatted message
    return message;
}

// Default exports
module.exports = parseLine;