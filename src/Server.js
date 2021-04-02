import express from "express";
import bodyParser from "body-parser";
import Database from "./libs/Database.js";
import routes from './router.js';

class Server {
  app;
  constructor(config) {
    this.app = express();
  }

  bootstrap() {
    this.initBodyParser();
    this.setUpRoutes();
    return this;
  }

  setUpRoutes() {
    this.app.use("/health-check", (req, res) => {
      res.send("I am Ok");
    });
    this.app.use('/api', routes);
  }

  initBodyParser() {
    this.app.use(bodyParser.json());
  }

  run() {
    const { app } = this;
    const PORT = 3000;
    const mongoURI =
      "mongodb+srv://Prince123:Prince123@devzone.ujr3h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    Database.open(mongoURI)
      .then((res) => {
        console.log("Succesfully Connected to mongoDB");
        app.listen(PORT, (err) => {
          if (err) {
            console.log(err);
          }
          console.log(`Server is running on ${PORT}`);
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    // Connect DB from config/db.js
    // connectDB();
  }
}

export default Server;
