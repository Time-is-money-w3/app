const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error.middleware");
const sessionRouter = require("./routes/session_router");

dotenv.config();
const { connect } = require("./db/connect_to_db");

class Server {
  constructor() {
    this.port = process.env.PORT;
    this.app = express();
  }

  config() {
    connect();
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    this.app.use("/uploads", express.static(__dirname + "/uploads"));
    this.app.use("/api/session", sessionRouter);
    this.app.use(express.static("client/build"));
    this.app.use(errorMiddleware);

    this.app.get("*", function (request, response) {
      const filePath = path.resolve(__dirname, "client", "build", "index.html");
      response.sendFile(filePath);
    });
  }

  start() {
    this.config();
    this.app.listen(this.port, () => {
      console.log(
        "Starting dashboard server..\n listening on port ",
        this.port
      );
    });
  }
}

const app = new Server();
app.start();
