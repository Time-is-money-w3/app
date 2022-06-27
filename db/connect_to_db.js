const Mongoose = require("mongoose");

let database;

const connect = () => {
  return new Promise((resolve, reject) => {
    console.log(process.env.MONGO_DB_URL);
    const uri = process.env.MONGO_DB_URL;
    if (database) {
      return;
    }

    Mongoose.connect(uri)
      .then(() => {
        console.log(`Connected to MongoDB...${uri.split("@")[1]}`);
      })
      .catch((e) => {
        console.log("Error in connecting to db: ", e);
      });
  });
};

const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};

module.exports = {
  connect,
  disconnect,
};
