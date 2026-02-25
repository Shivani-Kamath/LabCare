module.exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

/**
 * 4. 🪵 LOGGER USING WINSTON (utils/logger.js)
 */
const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.File({ filename: "logs/server.log" })],
});

module.exports = logger;