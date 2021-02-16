const UserModel = require("../schemas/users");
const atob = require("atob");

const basicAuth = async (req, res, next) => {
  console.log("1");
  if (!req.headers.authorization) {
    console.log("2");
    const error = new Error("Please provide authentication");
    error.httpStatusCode = 401;
    next(error);
  } else {
    console.log("3");
    const [username, password] = atob(
      req.headers.authorization.split(" ")[1]
    ).split(":");
    const user = await UserModel.findByCrendor(username, password);
    if (!user) {
      console.log("4");
      const error = new Error("Cannot find user with provided credentials");
      error.httpStatusCode = 401;
      next(error);
    } else {
      console.log("5");
      req.user = user;
    }
    next();
  }
};

const adminAccess = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    const error = new Error("You don't have admin rights");
    error.httpStatusCode = 403;
    next(error);
  }
};

module.exports = {
  basicAuth,
  adminAccess,
};
