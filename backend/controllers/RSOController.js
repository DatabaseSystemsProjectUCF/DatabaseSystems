const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const connection = require("./../Database");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const join_rso_handler = async (req, res) => {
  //get information from the request
  const { id } = req.body;
  const { rso_id } = req.query;

  const verify_query1 = `SELECT * FROM students WHERE id = ?`;
  const verify_query2 = `SELECT * FROM rso WHERE rso_id = ?`;
  const query = `INSERT INTO joins (rso_id, id) VALUES (?, ?)`;

  var error_code = -1;

  //verify the student exists in the database
  await connection.query(verify_query1, [id], (err, results) => {
    if (err) {
      error_code = 0;
    }

    //the student is not in the database
    if (results[0] == null) {
      error_code = 1;
    }
  });

  //verify the rso exists in the database
  await connection.query(verify_query2, [rso_id], (err, results) => {
    if (err) {
      error_code = 0;
    }

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
  }

  return;

  //add a row in the joins table, (student joins rso)
  await connection.query(query, [rso_id, id], (err) => {
    if (err) res.status(403).json({ success: false, message: err.sqlMessage });

    //successful insertion
    res
      .status(200)
      .json({ success: true, message: "Successfully joined to the RSO!!" });
  });
};

const create_rso_handler = (req, res) => {
  const { name, description, email1, email2, email3 } = req.body;
  var id;
  //verify the students emails are valid
  const verify_email1 = `SELECT id FROM users WHERE email = ?`;
  const verify_email2 = `SELECT id FROM users WHERE email = ?`;
  const verify_email3 = `SELECT id FROM users WHERE email = ?`;
  const query = `INSERT INTO rso (name, description, id) VALUES (?, ?, ?)`;

  connection.query(verify_email1, [email1], (err, results) => {
    if (err) throw err;

    //the user is not in the database
    if (results[0] == null) {
      res.status(401).send({ error: "User not found" });
    }
    id = results[0];
  });
  connection.query(verify_email2, [email2], (err, results) => {
    if (err) throw err;

    //the user is not in the database
    if (results[0] == null) {
      res.status(401).send({ error: "User not found" });
    }
  });
  connection.query(verify_email3, [email3], (err, results) => {
    if (err) throw err;

    //the user is not in the database
    if (results[0] == null) {
      res.status(401).send({ error: "User not found" });
    }
  });
  connection.query(query, [name, description, id], (err, results) => {
    if (err) throw err;
    //successful insertion
    res.status(200).send({ message: "Successfully created an RSO!!" });
  });
};

module.exports = { join_rso_handler, create_rso_handler };
