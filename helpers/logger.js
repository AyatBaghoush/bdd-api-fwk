const log4js = require('log4js');
const path = require('path');

// Generate a timestamped filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Safe for filenames
const logFileName = path.resolve(`logs/test-${timestamp}.log`);

log4js.configure({
      appenders: {
          out: { type: 'console' },
          app: { type: 'file', filename: logFileName}
      },
      categories: {
          default: { appenders: ['out', 'app'], level: 'debug' }
      }
  });

module.exports = function getLogger(name) {
  return log4js.getLogger(name);
}