const secret = require('./.secret.json');

const env = process.env

/* some defaults cannot be known in advance */
const config = {
  /* Hosting */
  PORT : env.PORT || 4000,
  RATE_LIMIT_TIME: env.RATE_LIMIT_TIME || 15,
  RATE_LIMIT_MAX_REQ: env.RATE_LIMIT_MAX_REQ || 1,
  /* Database */
  DB_CONNECTION: env.DB_CONNECTION || secret.DB_CONNECTION || null,
  /* Blockchain */
  BLOCKCHAIN_CONNECTION_POINT: env.BLOCKCHAIN_CONNECTION_POINT || secret.BLOCKCHAIN_CONNECTION_POINT || "http://localhost:8545",
  /* Email */
  SENDGRID_API_KEY: secret.SENDGRID_API_KEY
}

module.exports = config;
