const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

const { validationResult } = require("express-validator/lib");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "waleagbeniga06@gmail.com",
    pass: "mawsqpiorevrflhn",
  },
});

exports.getlogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      Password: "",
    },
    validationErrors: [],
  });
};

exports.getsignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      Password: "",
      ConfirmPassword: "",
    },
    validationErrors: [],
  });
};
exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const Password = req.body.Password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        Password: Password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password.",
          oldInput: {
            email: email,
            Password: Password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(Password, user.Password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.SignIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              // console.log(err);
              return res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password.",
            oldInput: {
              email: email,
              Password: Password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postsignup = (req, res, next) => {
  const email = req.body.email;
  const Password = req.body.Password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        Password: Password,
        ConfirmPassword: req.body.ConfirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(Password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        Password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("login");
      let mailOptions = {
        from: "waleagebeniga06@gmail.com",
        to: email,
        subject: "Signup Succeeded",
        html: "<h1>YOU SUCCESSFULLY SIGNED UP</h1>",
      };

      return transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        }
        console.log("Message Sent: ${info.response}");
      });
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postlogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const email = req.body.email;
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "NO ACCOUNT WITH THAT EMAIL");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        let mailOptions = {
          from: "waleagebeniga06@gmail.com",
          to: req.body.email,
          subject: "Password Reset",
          html: `
             <P> You requested a password reset </p>
             <p> Click this <a href="http://localhost:8000/reset/${token}"> link to set a new password </p>'
            `,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          }
          console.log("Message Sent: ${info.response}");
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getnewpassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Update Password",
        errorMessage: message,
        userId: user._id.toString(),
        PasswordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postnewpassword = (req, res, next) => {
  const newPassword = req.body.Password;
  const userId = req.body.userId;
  const PasswordToken = req.body.PasswordToken;
  let resetUser;

  User.findOne({
    resetToken: PasswordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.Password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// module.exports = User;
