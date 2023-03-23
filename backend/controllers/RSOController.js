const express = require("express");
const bodyParser = require("body-parser");
// const connection = require("./../Database");
const connection = require("./../DatabaseJuan");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//JOIN RSO
const join_rso_handler = (req, res) => {
  //get information from the request
  const { id } = req.body;
  const { rso_id } = req.query;

  //create verification queries
  const verify_query1 = `SELECT * FROM users WHERE id = ?`;
  const verify_query2 = `SELECT * FROM rso WHERE rso_id = ?`;
  const query = `INSERT INTO joins (rso_id, id) VALUES (?, ?)`;

  //this variable chooses the error to be sent to the client
  var error_code = -1;

  //verify the student exists in the database
  connection.query(verify_query1, [id], (err, results) => {
    if (err) error_code = 0;

    //the student is not in the database
    if (results[0] == null) {
      error_code = 1;
    }
  });

  //verify the rso exists in the database
  connection.query(verify_query2, [rso_id], (err, results) => {
    if (err) error_code = 0;

    //the rso is not in the database
    if (results[0] == null) {
      error_code = 2;
    }
  });

  //Throw error if any before attepting to join the student to the rso
  if (error_code === 0) {
    res.status(403).json({ success: false, message: err.sqlMessage });
  } else if (error_code === 1) {
    res.status(401).json({ success: false, message: "User not found" });
  } else if (error_code === 2) {
    res.status(401).json({ success: false, message: "RSO not found" });
  } else {
    //add a row in the joins table, (student joins rso)
    connection.query(query, [rso_id, id], (err) => {
      if (err)
        res.status(403).json({ success: false, message: err.sqlMessage });
      else {
        //successful insertion
        res
          .status(200)
          .json({ success: true, message: "Successfully joined to the RSO!!" });
      }
    });
  }
};

// Juansito's way, async / await, 48 lines
const create_rso_handler = async (req, res) => {
  //get data from the user
  const { name, description, admin_email, email1, email2, email3 } = req.body;
  //verify the emails first
  const verify_email1 = `SELECT * FROM users WHERE email = ?`;
  const verify_email2 = `SELECT * FROM users WHERE email = ?`;
  const verify_email3 = `SELECT * FROM users WHERE email = ?`;
  const verify_admin = `SELECT id FROM users WHERE email = ?`;
  const make_admin = `UPDATE users SET level_id = 1 WHERE email = ?;`;
  const query = `INSERT INTO rso (name, description, id) VALUES (?, ?, ?)`;

  var query_result = await connection.promise().query(verify_email1, email1)
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //check if user 1 is in the database
  if (query_result[0] == null) return res.status(401).json({ success: false, message: "User 1 not found" });
  //verify user 2
  query_result = await connection.promise().query(verify_email2, email2)
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //check if user 2 is in the database
  if (query_result[0] == null) return res.status(401).json({ success: false, message: "User 2 not found" });
  //verify user 3
  query_result = await connection.promise().query(verify_email3, email3)
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //check if user 3 is in the database
  if (query_result[0] == null) return res.status(401).json({ success: false, message: "User 3 not found" });
  //verify admins email
  query_result = await connection.promise().query(verify_admin, admin_email)
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //check if the admin is in the database
  if (query_result[0] == null) return res.status(401).json({ success: false, message: "Admin not found" });
  //verify that all the students belong to the same university by comparing domains
  const email_domain = admin_email.substring(admin_email.indexOf("@"), admin_email.length);
  const emails = [email1, email2, email3];
  for(i = 0; i < 3; i++){
    //If one of the students belongs to a different university
    if(email_domain != emails[i].substring(emails[i].indexOf("@"), emails[i].length))      
      return res.status(401).json({success: false, message: 'one of the students belongs to a different university'});
  }
  //Get the id of the admin
  const id = query_result[0][0].id;
  //create new rso
  query_result = await connection.promise().query(query, [name, description, id])
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //change level id from 0 to 1 for the new admin
  await connection.promise().query(make_admin, admin_email)
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //We created the RSO successfully
  return res.status(200).json({ success: true, message: "Successfully created an RSO!!" });
};

//Juansito's way async / await, 32 lines
const display_rso_handler = async (req, res) => {
  //First get the ID of the RSO, from query
  const {rso_id} = req.query;
  //Second, prepare the queries
  const get_rso = `SELECT * FROM rso WHERE rso_id = ?`;
  const get_admin_email = `SELECT * FROM users WHERE id = ?`;
  //Prepapre variables to hold response information
  var name = '';
  var description = '';
  var admin_email = '';
  //get the RSO info
  var query_result = await connection.promise().query(get_rso, rso_id)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
  //get the RSO object from the result of the query
  const RSO = query_result[0][0];
  //check if the object is null
  if(RSO == null) return res.status(401).json({success: false, message: 'The RSO was not found'});
  //retrieve info
  name = RSO.name;
  description = RSO.description;
  //get the admin's email
  query_result = await connection.promise().query(get_admin_email, RSO.id)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
  //get the admin object from the result of the query
  const admin = query_result[0][0];
  //check if the admin object is null
  if(admin == null) return res.status(401).json({success: false, message: 'The admin of the RSO was not found'});
  //retrieve just the email
  admin_email = admin.email;
  //Send all information to the client
  return res.status(200).json({success: true, admin_email: admin_email, name: name, description: description});
};

//DISPLAY ALL RSO
const display_all_rso_handler = (req, res) => {
  //create query
  const query = `SELECT * FROM rso`;

  //execute query to display all rso's
  connection.query(query, (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else 
      return res.status(200).json({ success: true, data: result });
  });
};

module.exports = { create_rso_handler, join_rso_handler, display_rso_handler, display_all_rso_handler};
