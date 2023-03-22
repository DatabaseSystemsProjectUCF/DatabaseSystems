const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./../Database");
//const connection = require("./../DatabaseJuan");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Juansito's way async / await, 50 lines
const create_event_handler = async (req, res) => {
  var location_id;
  var rso_id;
  //Get info from the client:
  //Talk to Usman on best way to receive optional parameter rso_name !!
  const { rso_name, name, description, category, type, date, time, phone, email, name_loc, lat, long } = req.body;
  //Prepare queries for the endpoint
  const verify_location = `SELECT loc_id FROM location WHERE latitude = ? AND longitud = ?`;
  const create_location = `INSERT INTO location (name, latitude, longitud) VALUES (?, ?, ?)`;
  const verify_rso = `SELECT * FROM rso WHERE name = ?`;
  const create_event_rso = `INSERT INTO event (loc_id, rso_id, name, description, category, type, time, date, phone, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const create_event = `INSERT INTO event (loc_id, name, description, category, type, time, date, phone, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  //I have to verify if the location already exists in the DB.
  var query_result = await connection.promise().query(verify_location, [lat, long])
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
  //If location does not exist, create a location
  if (query_result[0].length == 0) {
    var new_location = await connection.promise().query(create_location, [name_loc, lat, long])
    .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
    //Then get its ID
    location_id = new_location[0].insertId;
  }
  //Else, the location is already in the database, get its ID
  else {
    location_id = query_result[0][0].loc_id;
  }
  // Now check whether its an rso event or not
  if (type == 'rso') {
    //Verify the RSO exists in the DB
    query_result = await connection.promise().query(verify_rso, rso_name)
    .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
    //No RSO was found in the DB, return 401
    if (query_result[0].length == 0) res.status(401).json({ success: false, message: "RSO was not found" });
    //The RSO was found, get its ID
    else {
      rso_id = query_result[0][0].rso_id;
      query_result = await connection.promise().query(create_event_rso, [location_id, rso_id, name, description, category, type, time, date, phone, email])
      .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
      res.status(200).json({ success: true, message: "Event was successfully created!" });
    }
  }
  // Public or Private event
  else {
    query_result = await connection.promise().query(create_event, [location_id, name, description, category, type, time, date, phone, email])
    .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
    res.status(200).json({ success: true, message: "Event was successfully created!" });
  }
}

const create_comment_handler = async(req,res)=>{
  //get data from user
  const {content, rating} = req.body;
  const {event_id, id} = req.query;

  //create queries
  const query = `INSERT INTO comments (content, rating, id, event_id, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`;
  const verify_event = `SELECT * FROM event WHERE event_id = ?`;
  const query2 = `SELECT first_name, last_name FROM users WHERE id = ?`;
  const verify_user = `SELECT * FROM users WHERE id = ?`;
  //execute query to verify that event exists
  connection.query(verify_event, [event_id], (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else {
      if(result[0]==null) return res.status(401).json({ success: false, message: "Event doesn't exist"});
      
      //execute query to verify user exists
      connection.query(verify_user, [id], (error, result)=>{
        if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
        else{
          if(result[0]==null) return res.status(401).json({ success: false, message: "User doesn't exist"});
          
          //execute query to retrieve users first and last name
          connection.query(query2, [id], (error, result)=>{
            if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
            else{
              const first_name = result[0].first_name;
              const last_name = result[0].last_name;

              //execute query to create new comment
              connection.query(query, [content, rating, id, event_id, first_name, last_name], (error, result)=>{
                if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
                return res.status(200).json({ success : true, message: "Comment created successfully" });
              });
            }
          });
        }
      });
    }
  });
}

const edit_comment_handler = async(req,res)=>{
  //get data from the user
  const {content, rating} = req.body;
  const {comm_id} = req.query;
  //queries
  const query = `UPDATE comments SET content = ?, rating = ? WHERE comm_id = ?`;
  const verify_comment = `SELECT * FROM comments WHERE comm_id = ?`;
  //execute query to verify comment exists
  connection.query(verify_comment, [comm_id], (error, result)=>{
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else{
      if(result[0] == null) return res.status(401).json({ success : false, message: "Comment doesn't exist"});
      else{
        //execute query to edit comment
        connection.query(query, [content, rating, comm_id], (error, result)=>{
          if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
          return res.status(200).json({ success: true, message: "Comment edited successfully"});
        })
      }
    }
  });
}

const delete_comment_handler = async(req, res)=>{
  //get data from user and create queries
  const {comm_id} = req.query;
  const query = `DELETE FROM comments WHERE comm_id = ?`;
  const verify_query = `SELECT * FROM comments WHERE comm_id = ?`;

  //execute query to verify comment exists in the database
  connection.query(verify_query, [comm_id], (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else {//if comment doesn't exist return error message
      if(result[0] == null){ return res.status(401).json({ success: false, message: "Comment doesn't exist" });}
      else {
        //execute query to delete comment
        connection.query(query, [comm_id], (error, result)=>{
          if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
          else
            return res.status(200).json({ success : true, message: "Comment deleted"});
        })
      }
    }
  });
}

// DISPLAY ALL COMMENTS FOR A SINGLE EVENT 
const display_comments_handler = async(req,res) =>{
  //get data and create queries
  const {event_id} = req.query;
  const query = `SELECT * FROM comments WHERE event_id = ?`;
  const verify_event = `SELECT * FROM event WHERE event_id = ?`;
  //execute query to verify that the event exists
  connection.query(verify_event, [event_id], (error, result)=>{
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else {
      if(result[0] == null) return res.status(401).json({ success: false, message: "Event id is not valid, no event was found" });
      //execute query to display all the comments in a single event
      connection.query(query, [event_id], (error, result) => {
        if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
        return res.status(200).json({ success : true, comments: result});
      });
    }
  });  
}

//HOW TO HANDLE PRIVACY:
//PUBLIC:
//any student can see the event, no verification required
//PRIVATE:
//only students at the host university can see this type of events.
//verification required using the student's email.
//RSO:
//only students belonging to an rso can view the event.

// DISPLAY SINGLE EVENT, 14 lines
const display_event_handler = async (req,res) =>{
  //get the id of the event from the request
  const {event_id} = req.query;
  //prepare queries to be used in this handler
  const get_event = `SELECT * FROM event WHERE event_id = ?`;
  //look for the event in the db
  var query_result = await connection.promise().query(get_event, event_id)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });
  //check if the event is in the database
  const event = query_result[0][0];
  if(event == null) return res.status(401).json({success: false, message: 'The event was not found'});
  //return all info about it to the client
  res.status(200).json({success: true, data: event});
}

//DISPLAY ALL EVENTS, 9 lines FIX: FILTER OUT BY AUTHORIZATION LEVEL, ALSO GET THE NAME OF THE LOCATION, RSO NAME
const display_all_events_handler = async (req, res) => {
  //prepare query
  const get_all_events = `SELECT * FROM event`;
  var query_result = await connection.promise().query(get_all_events)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage}) });  
  const events = query_result[0];
  //send the events to the client
  return res.status(200).json(events);
}

module.exports = { create_event_handler, create_comment_handler, edit_comment_handler, delete_comment_handler, display_comments_handler, 
  display_event_handler, display_all_events_handler};