const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const connection = require("./../Database");
const connection = require("./../DatabaseJuan");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// //LOGIN, 30 lines
// const login_handler = async (req, res) => {
//   // get the username and password from the request
//   const { email, password } = req.body;
//   // Query the database for the user with the specified username
//   const query = `SELECT * FROM users WHERE email = ?`;
//   connection.query(query, email, (err, results) => {
//     if (err) return res.status(403).json({ success: false, message: err.sqlMessage });

//     // If the user is found, compare the password hash with the supplied password
//     if (results.length > 0) {
//       const user = results[0];
//       bcrypt.compare(password, user.password, (err, isMatch) => {
//         if (err) return res.status(403).json({ success: false, message: err.sqlMessage });

//         if (isMatch) {
//           // If the passwords match, return a success message
//           res.status(200).json({ "success" : true, "message": "Login successful", "user": user });
//         } else {
//           // If the passwords don't match, return an error message
//           res.status(401).json({ "success" : false, "message": "Invalid password" });
//         }
//       });
//     } else {
//       // If the user is not found, return an error message
//       res.status(401).send({ "success" : false, "message": "User not found" });
//     }
//   });
// };

// LOGIN, 17 lines
const login_handler = async (req, res) => {
  // get the username and password from the request
  const { email, password } = req.body;
  // Query the database for the user with the specified username
  const query = `SELECT * FROM users WHERE email = ?`;
  var query_result = await connection.promise().query(query, email)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
  const user = query_result[0][0];
  // If the user is found, compare the password hash with the supplied password
  if (user != null) {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(403).json({ success: false, message: err.sqlMessage });
      if (isMatch) return res.status(200).json({ "success" : true, "message": "Login successful", "user": user });
      else return res.status(401).json({ "success" : false, "message": "Invalid password" });
    });
  } else res.status(401).send({ "success" : false, "message": "User not found" });
};

//REGISTER
const register_handler = async (req, res) => {
  //get user information
  const { email, password, first_name, last_name } = req.body;
  const hashedPass = await bcrypt.hash(password, saltRounds);
  const email_domain = email.substring(email.indexOf("@"), email.length);
  const level_id = 0;
  const values = [email, hashedPass, first_name, last_name, level_id];

  //create query
  const query = `INSERT INTO users (email, password, first_name, last_name, level_id) VALUES (?, ?, ?, ?, ?)`;
  const verify_univ = `SELECT univ_id FROM university WHERE email_domain = ?`;
  const stud_query = `INSERT INTO students (id, univ_id) VALUES (?, ?)`;
  const query2 = `SELECT id FROM users WHERE email = ?`;

  //execute query to verify there is an university created with the same email_domain
  connection.query(verify_univ, email_domain, (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else {
      //if no university is found
      if(result[0]==null){
        return res.status(401).json({ success: false, message: "University with email domain doesn't exist"});
      }
      const univ_id = result[0].univ_id;
      //execute query to create new user
      connection.query(query, values, (error, result)=>{
        if (error) return res.status(403).json({ success: false, message: error.sqlMessage });

        //get user id
        connection.query(query2, email, (error, result)=>{
          if (error) return res.status(403).json({ success: false, message: error.sqlMessage });

          const id = result[0].id;
          //add user to students table
          connection.query(stud_query, [id, univ_id], (error,result)=>{
            if (error) return res.status(403).json({ success: false, message: error.sqlMessage });

            return res.status(200).json({ "success" : true, "message": "User created successfully" });
          })
        })
      })
    }
  });
};

module.exports = { login_handler, register_handler };
