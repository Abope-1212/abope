const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
// const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const errorcontroller = require("./controllers/error");

const fileStorage = multer.diskStorage({
  //   ination: (req, file, cb) => {
  //     cb(null, "images");
  //   },
  //   name: (req, file, cb) => {
  //     cb(null, new Date().toISOString() + "-" + file.originalname);
  //   },
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.4vzuxhn.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

// const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

const adminroutes = require("./routes/admin");

const shoproutes = require("./routes/shop");

const authroutes = require("./routes/auth");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.SignIn;
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use(csrfProtection);

app.use(adminroutes.routes);

app.use(shoproutes);

app.use(authroutes);

app.get("/500", errorcontroller.get500);

app.use(errorcontroller.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    // .listen(process.env.PORT || 8000);
    app.listen(process.env.PORT || 8000);
  })
  .catch((err) => {
    console.log(err);
  });
