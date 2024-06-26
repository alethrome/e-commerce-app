const dotenv = require('dotenv');
const { createLogger, format, transports} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
    transports: [
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

// if (process.env.NODE_ENV === 'test') {
//     logger.transports.forEach((transport) => {
//       transport.silent = true;
//     });
// }

module.exports = logger;