const express = require("express");
const UserModel = require("../schemas/users");
const { basicAuth, adminAccess } = require("./authTools");

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", basicAuth, adminAccess, async (req, res, next) => {
  try {
    const allUsers = await UserModel.find();
    console.log(allUsers);
    res.send(allUsers);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/self", basicAuth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/self", basicAuth, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.status(204).send("deleted >:)");
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/self", basicAuth, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
