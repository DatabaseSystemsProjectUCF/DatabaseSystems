const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./../Database");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const join_rso_handler = async (req, res) => {
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
  await connection.query(verify_query1, [id], (err, results) => {
    if (err)  error_code = 0;
    
    //the student is not in the database
    if (results[0] == null) {
      error_code = 1;
    }
  });

  //verify the rso exists in the database
  await connection.query(verify_query2, [rso_id], (err, results) => {
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
    await connection.query(query, [rso_id, id], (err) => {
      if (err) res.status(403).json({ success: false, message: err.sqlMessage });
      else {
        //successful insertion
        res.status(200).json({ success: true, message: "Successfully joined to the RSO!!" });
      }
    });
  }
};

const create_rso_handler = (req, res) => {
  //get data from the user
  const { name, description, admin_email, email1, email2, email3 } = req.body;

  //verify the students emails are valid
  const verify_email1 = `SELECT * FROM users WHERE email = ?`;
  const verify_email2 = `SELECT * FROM users WHERE email = ?`;
  const verify_email3 = `SELECT * FROM users WHERE email = ?`;
  const verify_admin = `SELECT id FROM users WHERE email = ?`;
  const make_admin = `UPDATE users SET level_id = 1 WHERE email = ?;`;
  const query = `INSERT INTO rso (name, description, id) VALUES (?, ?, ?)`;

  //verify the emails first
  connection.query(verify_email1, email1, (err, results) => {
    if (err)
      return res.status(403).json({ success: false, message: err.sqlMessage });

    //user 1 is not in the database
    if (results[0] == null) {
      return res
        .status(401)
        .json({ success: false, message: "User 1 not found" });
    }
    connection.query(verify_email2, email2, (err, results) => {
      if (err)
        return res
          .status(403)
          .json({ success: false, message: err.sqlMessage });

      //user 2 is not in the database
      if (results[0] == null) {
        return res
          .status(401)
          .json({ success: false, message: "User 2 not found" });
      }
      connection.query(verify_email3, email3, (err, results) => {
        if (err)
          return res
            .status(403)
            .json({ success: false, message: err.sqlMessage });

        //user 3 is not in the database
        if (results[0] == null) {
          return res
            .status(401)
            .json({ success: false, message: "User 3 not found" });
        }
      });
    });
  });
  //verify admins email
  connection.query(verify_admin, admin_email, (err, results) => {
    if (err)
      return res.status(403).json({ success: false, message: err.sqlMessage });

    //the admin is not in the database
    if (results[0] == null) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }
    const id = results[0].id;
    console.log(id);
    //create new rso
    connection.query(query, [name, description, id], (err, results) => {
      if (err)
        return res
          .status(403)
          .json({ success: false, message: err.sqlMessage });

      //change level id from 0 to 1 for the new admin
      connection.query(make_admin, admin_email, (err, results) => {
        if (err)
          return res
            .status(403)
            .json({ success: false, message: err.sqlMessage });

        //successful insertion
        return res
          .status(200)
          .json({ success: true, message: "Successfully created an RSO!!" });
      });
    });
  });
};

module.exports = { join_rso_handler, create_rso_handler };
