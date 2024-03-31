var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");

var routerweb = require("./routes/router_web");
var routerAdmin = require("./routes/adminApi");
var routerStory = require("./routes/storyApi");
var routerUser = require("./routes/userApi");
var routerCmt = require("./routes/commentApi");
var app = express();
app.use("/Images", express.static(path.join(__dirname, "../Images")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", routerweb);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", routerAdmin);
app.use("/api", routerStory);
app.use("/api", routerUser);
app.use("/api", routerCmt);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

module.exports = app;
