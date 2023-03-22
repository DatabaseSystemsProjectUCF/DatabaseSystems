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

//CREATE RSO ----------FIX(NEED TO VERIFY ALL EMAILS HAVE THE SAME DOMAIN)---------------
// const create_rso_handler = (req, res) => {
//   //get data from the user
//   const { name, description, admin_email, email1, email2, email3 } = req.body;
//   //verify the students emails are valid
//   const verify_email1 = `SELECT * FROM users WHERE email = ?`;
//   const verify_email2 = `SELECT * FROM users WHERE email = ?`;
//   const verify_email3 = `SELECT * FROM users WHERE email = ?`;
//   const verify_admin = `SELECT id FROM users WHERE email = ?`;
//   const make_admin = `UPDATE users SET level_id = 1 WHERE email = ?;`;
//   const query = `INSERT INTO rso (name, description, id) VALUES (?, ?, ?)`;
//   //verify the emails first
//   connection.query(verify_email1, email1, async (err, results) => {
//     if (err)
//       return res.status(403).json({ success: false, message: err.sqlMessage });

//     //user 1 is not in the database
//     if (results[0] == null) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User 1 not found" });
//     }
//     connection.query(verify_email2, email2, (err, results) => {
//       if (err)
//         return res
//           .status(403)
//           .json({ success: false, message: err.sqlMessage });

//       //user 2 is not in the database
//       if (results[0] == null) {
//         return res
//           .status(401)
//           .json({ success: false, message: "User 2 not found" });
//       }
//       connection.query(verify_email3, email3, (err, results) => {
//         if (err)
//           return res
//             .status(403)
//             .json({ success: false, message: err.sqlMessage });

//         //user 3 is not in the database
//         if (results[0] == null) {
//           return res
//             .status(401)
//             .json({ success: false, message: "User 3 not found" });
//         }
//       });
//     });
//   });
//   //verify admins email
//   connection.query(verify_admin, admin_email, (err, results) => {
//     if (err)
//       return res.status(403).json({ success: false, message: err.sqlMessage });

//     //the admin is not in the database
//     if (results[0] == null) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Admin not found" });
//     }
//     const id = results[0].id;
//     //create new rso
//     connection.query(query, [name, description, id], (err, results) => {
//       if (err)
//         return res
//           .status(403)
//           .json({ success: false, message: err.sqlMessage });

//       //change level id from 0 to 1 for the new admin
//       connection.query(make_admin, admin_email, (err, results) => {
//         if (err)
//           return res
//             .status(403)
//             .json({ success: false, message: err.sqlMessage });

//         //successful insertion
//         return res
//           .status(200)
//           .json({ success: true, message: "Successfully created an RSO!!" });
//       });
//     });
//   });
// };

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
      return res.status(403).json({success: false, message: 'one of the students belongs to a different university'});
  }
  //Get the id of the admin
  const id = query_result[0].id;
  //create new rso
  query_result = await connection.promise().query(query, [name, description, id])
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //change level id from 0 to 1 for the new admin
  await connection.promise().query(make_admin, admin_email)
  .catch((err) => { return res.status(403).json({ success: false, message: err.sqlMessage }) });
  //We created the RSO successfully
  return res.status(200).json({ success: true, message: "Successfully created an RSO!!" });
};

//DISPLAY RSO
// const display_rso_handler = async (req, res) => {
//   //First get the ID of the RSO, from query
//   const {rso_id} = req.query;
//   console.log(rso_id);
//   //Second, prepare the queries
//   const get_rso = `SELECT * FROM rso WHERE rso_id = ?`;
//   const get_admin_email = `SELECT * FROM users WHERE id = ?`;
//   //Prepapre variables to hold response information
//   var name = '';
//   var description = '';
//   var admin_email = '';

//   //get the RSO info
//   await connection.promise().query(get_rso, rso_id, (err) => {
//     if(err) {res.status(403).json({success: false, message: err.sqlMessage});}
//   })
//   .then( async (result) =>{
//     //The RSO was not found in the database
//     const RSO = result[0][0];

//     if(RSO == null){
//       console.log('The RSO was not found');
//       res.status(401).json({success: false, message: 'The RSO was not found'});
//     }
//     //The RSO was found
//     else{
//       name = RSO.name;
//       description = RSO.description;
//       //get the admin's email
//       await connection.promise().query(get_admin_email, RSO.id, (err) => {
//         if(err) res.status(403).json({success: false, message: err.sqlMessage});        
//       }).then((result) => {
//         if(result[0][0] == null){
//           //the admin is not in the database
//           res.status(401).json({success: false, message: 'The admin of the RSO was not found'});
//         }
//         //The admin of the RSO was found
//         else{
//           admin_email = result[0][0].email;
//           res.status(200).json({success: 'true', admin_email: admin_email, name: name, description: description});
//         }
//       });
//     }    
//   });
// };

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

//DANI'S VERSION 
const display_rso_handler2 = async (req, res) => {
  const {rso_id} = req.query;

  //Queries
  const get_rso = `SELECT * FROM rso WHERE rso_id = ?`;
  const query2 = `SELECT email FROM users WHERE id = ?`;

  //query to get rso information
  connection.query(get_rso, [rso_id], (err, result)=>{
    if(err) res.status(403).json({success: false, message: err.sqlMessage})
    else{
      if(result[0] == null) {return res.status(200).json({message: "NO RSO found"})}

      //save the id of the rso admin
      const admin_id = result[0].id;
      //query to get the admin's email
      connection.query(query2, [admin_id], (err, result2)=>{
        if(err) res.status(403).json({success: false, message: err.sqlMessage});
        else{
          const admin_email = result2[0];
          res.status(200).json({success: 'true', admin_email: admin_email, body: result})
        }
      })
    }
  })
};

//DISPLAY ALL RSO
const display_all_rso_handler = (req, res) => {
  //create query
  const query = `SELECT * FROM rso`;

  //execute query to display all rso's
  connection.query(query, (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else 
      return res.status(200).json({ "success" : true, "message": result });
  });
};

module.exports = { create_rso_handler, join_rso_handler, display_rso_handler, display_all_rso_handler, display_rso_handler2};
