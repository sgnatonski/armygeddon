var createLogger = require('influx-syslog').default;

if (!('toJSON' in Error.prototype))
Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
        }, this);

        return alt;
    },
    configurable: true,
    writable: true
});

const log = createLogger(
  // Bunyan options
  {
    name: 'har',
    streams: [
      // optional: also log to stderr
      {
        stream: process.stderr,
        level: 'debug'
      }
    ]
  },
  // InfluxDB constructor options
  {
    host: 'r200',
    database: 'logs'
  }
);

function wrapLog(obj) {
  return JSON.stringify({
    msg: obj,
    argv: process.argv[1],
    arch: process.arch
  });
}

module.exports = {
  info: (obj) => log.info(wrapLog(obj)),
  warn: (obj) => log.warn(wrapLog(obj)),
  trace: (obj) => log.trace(wrapLog(obj)),
  error: (obj) => log.error(wrapLog(obj)),
};