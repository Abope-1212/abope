const express = require("express");
const { check, body } = require("express-validator/lib");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getlogin);

router.get("/signup", authController.getsignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a vaild E-Mail")
      .normalizeEmail(),
    body("Password", "Check the password again")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postlogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "Password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("ConfirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.Password) {
          throw new Error("Password does not match!");
        }
        return true;
      }),
  ],
  authController.postsignup
);

router.post("/logout", authController.postlogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getnewpassword);

router.post("/new-password", authController.postnewpassword);

module.exports = router;

// const express = require("express");
// const { check, body } = require("express-validator/lib");

// const authController = require("../controllers/auth");
// const User = require("../models/user");

// const Router = express.Router();

// Router.get("/login", authController.getlogin);
// Router.get("/signup", authController.getsignup);
// Router.get("/reset", authController.getReset);
// Router.get("/reset/:token", authController.getnewpassword);
// Router.post("/login", authController.postlogin);
// Router.post("/logout", authController.postlogout);
// Router.post(
//   "/signup",
//   [
//     check("email")
//       .isEmail()
//       .withMessage("Please enter a valid email")
//       .custom((value, { req }) => {
//         return User.findOne({ email: value }).then((userDoc) => {
//           if (userDoc) {
//             return Promise.reject(
//               "E-Mail exists already, please pick a different one."
//             );
//           }
//         });
//       }),
//     body(
//       "Password",
//       "Please enter a Password with only numbers and at least 5 characters"
//     )
//       .isLength({ min: 5 })
//       .isAlphanumeric(),
//     // .trim(),
//     body("confirmPassword")
//       // .trim()
//       .custom((value, { req }) => {
//         if (value !== req.body.Password) {
//           throw new Error("Password have to match!");
//         }
//         return true;
//       }),
//   ],
//   authController.postsignup
// );
// Router.post("/reset", authController.postReset);
// Router.post("/new-password", authController.postnewpassword);

// module.exports = Router;
