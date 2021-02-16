const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const genericErrorHandler = require("./errorHandler");

const usersRouter = require("./services/users");

const server = express();
const port = process.env.PORT || 6969;

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);

server.use(genericErrorHandler);

mongoose
  .connect(process.env.MONGO_COMPASS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(
        "What do we do with a drunken sailor? Throw him in a bed with the captains ",
        port,
        " daughters!"
      );
    })
  );
