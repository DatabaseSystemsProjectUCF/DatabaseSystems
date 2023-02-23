const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const connection = require("./../Database");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

exports.login_handler = (req, res) => {
  // Login function logic goes here
  // get the username and password from the request
  const { username, password } = req.body;

  // Query the database for the user with the specified username
  const query = `SELECT * FROM users WHERE username = ?`;
  connection.query(query, [username], (err, results) => {
    if (err) throw err;

    // If the user is found, compare the password hash with the supplied password
    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          // If the passwords match, return a success message
          res.send({ message: "Login successful" });
        } else {
          // If the passwords don't match, return an error message
          res.status(401).send({ error: "Invalid password" });
        }
      });
    } else {
      // If the user is not found, return an error message
      res.status(401).send({ error: "User not found" });
    }
  });
};

exports.signup_handler = (req, res) => {
  // Signup function logic goes here
  res.send("signup response");
};
