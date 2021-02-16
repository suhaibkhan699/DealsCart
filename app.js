const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const session = require("express-session");

// Passport Config
require("./config/passport")(passport);

// load config
dotenv.config({ path: "./config/config.env" });

const app = express();

connectDB();

// Body parser, this is the middleware which is used to access req.body in express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HBS helper
const {
  getTopLoginMsg,
  isInvalidLogin,
  removeErrMsg,
} = require("./helpers/hbs");

// handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { getTopLoginMsg, isInvalidLogin, removeErrMsg },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users.js"));
//Other routes here
// app.get('*', function(req, res){
//   res.redirect('/');
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on PORT: ${PORT}`));

/* io.on("connection", (socket) => {
  console.log("user connected: " + socket.id);
  socket.on('message',(data)=>{
    console.log('---'+data)
  })
}); */
