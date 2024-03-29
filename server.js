const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error.middleware");
const sessionRouter = require("./routes/session_router");
const ExpressPeerServer = require("peer").ExpressPeerServer;
const cors = require("cors");
const http = require("http");
dotenv.config();
const { connect } = require("./db/connect_to_db");

class Server {
  constructor() {
    this.port = process.env.PORT;
    this.app = express();
    this.server = http.createServer(this.app);
    this.optionsForPeerjs = {
      debug: true,
    };
  }
  onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind =
      typeof port === "string" ? "Pipe " + this.port : "Port " + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  config() {
    connect();
    const peerServer = ExpressPeerServer(this.server, this.optionsForPeerjs);
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    this.app.use("/uploads", express.static(__dirname + "/uploads"));
    this.app.use("/api/session", sessionRouter);
    this.app.use("/peer", peerServer);
    this.app.use(express.static("client/build"));
    this.app.use(errorMiddleware);

    this.app.get("*", function (request, response) {
      const filePath = path.resolve(__dirname, "client", "build", "index.html");
      response.sendFile(filePath);
    });
    peerServer.on("connection", (client) => {
      console.log("Client connected : ", client);
    });
  }

  start() {
    this.config();
    this.app.set("port", this.port);
    this.server.listen(this.port);
    this.server.on("error", this.onError);
    console.log("Starting dashboard server..\n listening on port ", this.port);
  }
}

const app = new Server();
app.start();
