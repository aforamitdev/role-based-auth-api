const express = require("express");
const cors = require("express");
const bodyParser = require("body-parser");
const { connect } = require("mongoose");

const { DB, PORT } = require("./config/index");

const passport = require("passport");

// init the application
const app = express();
app.use(express.json());
app.use(passport.initialize());
console.log(DB);

connect(
  DB,
  { useFindAndModify: true, useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) {
      throw err;
    }
    console.log("DB Connected");
  }
);
require("./middleware/passport")(passport)

// routers
const User = require("./routers/User");
app.use("/api/users", User);

app.listen(PORT, () => {
  console.log(`App started at ${PORT}`);
});
