const pino = require ("pino");
const logger = pino ({ 
    level: "trace",
    customLevels: {
        custom: 70
    }
});

// Log some basic stuff
logger.trace ("Tracing request with UID fPQ-1397...");
logger.debug ("Session is active");
logger.info ("Log file is at /var/log/pino.log");
logger.warn ("Request exceeded maximum POST body size: 16MB");
logger.error ("Could not establish database connection!");
logger.fatal ("Encountered a stack overflow, shutting down...");
logger.custom ("Special logs require special levels.");

// Product an error
try {
    const result = undefinedVar1 + undefinedVar2;
} catch (err) {
    logger.error (err);
}

logger.info ("All examples ran successfully!");