const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./../Database");
// const connection = require("./../DatabaseJuan");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//JOIN RSO
const join_rso_handler = async (req, res) => {
  //get information from the request
  const { id } = req.body;
  const { rso_id } = req.query;

  //create verification queries
  const verify_query1 = `SELECT * FROM users WHERE id = ?`;
  const verify_query2 = `SELECT * FROM rso WHERE rso_id = ?`;
  const query = `INSERT INTO joins (rso_id, id) VALUES (?, ?)`;
  const update_rso = `UPDATE rso SET no_members = no_members + 1 WHERE rso_id = ? `;

  //this variable chooses the error to be sent to the client
  var query_result = -1;

  //verify the student exists in the database
  query_result = await connection.promise().query(verify_query1, [id])
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage})});

  //the student is not in the database
  if (query_result[0][0] == null) {
    return res.status(401).json({success: false, message: 'User not found'});
  }

  //verify the rso exists in the database
  query_result = await connection.promise().query(verify_query2, [rso_id])
 .catch((err) => {return res.status(403).json({success: false, message: err.sqlMessage})});
  //the rso is not in the database
  if (query_result[0][0] == null) {
    return res.status(401).json({success: false, message: 'RSO not found'});
  }

  //update rso table
  query_result = await connection.promise().query(update_rso, rso_id).
  catch((err) => {return res.status(403).json({ success: false, message: err.sqlMessage})});

  //add a row in the joins table, (student joins rso)
  query_result = await connection.promise().query(query, [rso_id, id])
  .catch((err) => {return res.status(403).json({ success: false, message: 'err.sqlMessage' })});

  return res.status(200).json({ success: true, message: "Successfully joined to the RSO!!" });  
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
  const query = `INSERT INTO rso (name, description, id, no_members) VALUES (?, ?, ?, 4)`;

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

//Display My RSO handlers
const display_my_rsos_handler = async (req, res) => {
  //get the id of the user from the client
  const {id} = req.query;
  //prepare queries
  const get_rso_ids = `SELECT rso_id FROM joins WHERE id = ?`;
  const get_rsos = `SELECT * FROM rso WHERE rso_id IN (?)`;
  //get the id's of my rso's
  var query_result = await connection.promise().query(get_rso_ids, id)
  .catch((err) => { res.status(403).json({ success: false, message: err.sqlMessage }) });
  const list_objects = query_result[0];
  //transform list of json to regular list of numbers
  var list = [];
  list_objects.forEach(element => {
    var {rso_id} = element;
    list.push(rso_id);
  });
  //perform second query
  if(list.length == 0)
    return res.status(200).json({success: true, message: "You have not registered to any RSO's yet"});
  else{
    //perform second query
    query_result = await connection.promise().query(get_rsos, [list])
    .catch((err) => { res.status(403).json({ success: false, message: err.sqlMessage }) });
    const result = query_result[0];
    return res.status(200).json({success: true, data: result});
  }
}

//Leave an RSO
const leave_rso_handler = (req, res)=>{
  //get id of user who wants to leave RSO
  const {id, rso_id} = req.query;

  //queries
  const verify_userRso = `SELECT * FROM joins WHERE rso_id = ? AND id = ?`;
  const query = `DELETE FROM joins WHERE rso_id = ? AND id = ?`;
  const alter_count = `UPDATE rso SET no_members = no_members-1 WHERE rso_id = ?`;

  //execute query to verify if user is part of said RSO
  connection.query(verify_userRso, [rso_id, id], (error, result)=>{
    if(error) return res.status(403).json({ success: false, message: error.sqlMessage })
    else{
      if(result[0]==null) return res.status(401).json({ success: false, message: "User is not a member of said RSO" })
      //execute query to remove user from rso
      connection.query(query, [rso_id, id], (error, result)=>{
        if(error) return res.status(403).json({ success: false, message: error.sqlMessage })
        //execute query to update number of members in rso
        connection.query(alter_count, [rso_id], (error, result)=>{
          if(error) return res.status(403).json({ success: false, message: error.sqlMessage })
          return res.status(200).json({ success: true, message: "User deleted successfully" })
        })
      })
    }
  })
};

module.exports = { create_rso_handler, join_rso_handler, display_rso_handler, display_all_rso_handler,display_my_rsos_handler, leave_rso_handler};
