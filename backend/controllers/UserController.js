const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const connection = require("./../Database");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//LOGIN
const login_handler = async (req, res) => {
  // get the username and password from the request
  const { email, password } = req.body;

  // Query the database for the user with the specified username
  const query = `SELECT * FROM users WHERE email = ?`;
  connection.query(query, email, (err, results) => {
    if (err) return res.status(403).json({ success: false, message: err.sqlMessage });

    // If the user is found, compare the password hash with the supplied password
    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(403).json({ success: false, message: err.sqlMessage });

        if (isMatch) {
          // If the passwords match, return a success message
          res.status(200).json({ "success" : true, "message": "Login successful" });
        } else {
          // If the passwords don't match, return an error message
          res.status(401).json({ "success" : true, "message": "Invalid password" });
        }
      });
    } else {
      // If the user is not found, return an error message
      res.status(401).send({ "success" : true, "message": "User not found" });
    }
  });
};

//REGISTER
const register_handler = async (req, res) => {
  //get user information
  const { email, password, first_name, last_name } = req.body;
  const hashedPass = await bcrypt.hash(password, saltRounds);
  const level_id = 0;

  //create query
  const query = `INSERT INTO users (email, password, first_name, last_name, level_id) VALUES (?, ?, ?, ?, ?)`;

  //execute query to create new user
  const values = [email, hashedPass, first_name, last_name, level_id];
  connection.query(query, values, (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    
    else {
      return res.status(200).json({success: true, message: "User created successfully"}); 
    }
  });
};

module.exports = { login_handler, register_handler };
