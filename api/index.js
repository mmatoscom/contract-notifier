const Events = require("events");
const Validators = require("./validators");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("./rate-limit");
const errorHandler = require("./error-handler");
const config = require("../config");
const Database = require("../database");
const Mailer = require("../mail/sendgrid");
const DappConfig = require("../dapp-config");
const Controller = require("./controller");
const logger = require("../logger")('api');

const events = new Events();
const dappConfig = new DappConfig(config, logger);
const mailer = new Mailer(config, logger);
const db = new Database(events, config);

db.init(logger);

events.on("db:connected", () => {
  const app = express();

  app.use(rateLimit(logger));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet.expectCt({ enforce: true, maxAge: 60 }));
  app.use(helmet());
  app.set("trust proxy", 1);

  app.post("/:dappId/subscribe", Validators.subscribe, Controller.subscribe(dappConfig, mailer));
  app.post("/:dappId/unsubscribe", Validators.unsubscribe, Controller.unsubscribe(dappConfig));
  app.get("/confirm/:token", Validators.confirm, Controller.confirm());
  app.get("/:dappId/user/:address", Validators.userExists, Controller.userExists());
  app.get("/", (req, res) => res.status(200).json({ ok: true }));

  app.use(errorHandler(logger));

  app.listen(config.PORT, () => logger.info(`App listening on port ${config.PORT}!`));
});
