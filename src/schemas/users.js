const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, selected: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  //.pre("save") RUNS BEFORE THE .save() METHOD
  const user = this; //THIS IS THE DOCUMENT BEING AFFECTED BY .save()
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 11); //HASHES THE PASSWORD, USEING 11 SALTS
  }
  next();
});

UserSchema.statics.findByCrendor = async function (username, password) {
  const user = await this.findOne({ username });

  if (user) {
    const matching = await bcrypt.compare(password, user.password);
    if (matching) return user;
    else return null;
  } else return null;
};

module.exports = model("User", UserSchema);
