const express = require("express");
const bodyParser = require("body-parser");
// const connection = require("./../Database");
const connection = require("./../Database");
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
  const create_location = `INSERT INTO location (location_name, latitude, longitud) VALUES (?, ?, ?)`;
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

//DISPLAY ALL EVENTS, 58 lines
const display_all_events_handler = async (req, res) => {
  //get user ID from client
  const {id} = req.query;
  //prepare response variable
  const public = 'public';
  const private = 'private';
  const rso = 'rso';
  var events = [];
  //GET ALL PUBLIC EVENTS
  const get_public_events = `SELECT * FROM event INNER JOIN location ON event.loc_id = location.loc_id WHERE type = ?`;
  //GET PRIVATE EVENTS FROM SAME UNIVERSITY AS THE USER
  //Query to get the univ_id of the user
  const get_univ_id = `SELECT univ_id FROM students WHERE id = ?`;
  //Query to get the location id of the university
  const get_loc_id = `SELECT loc_id FROM location WHERE univ_id = ?`;
  //Query to get the private events with the location of the university
  const get_private_events = `SELECT * FROM event INNER JOIN location ON event.loc_id = location.loc_id WHERE type = ? AND event.loc_id = ?`;
  //GET RSO EVENTS FROM THE RSO'S THAT THE USER IS A MEMBER OF
  //Query to get the RSOs that the user is a member of as an array
  const get_rso_ids = `SELECT rso_id FROM joins WHERE id = ?`;
  //Query to get the rso events
  const get_rso_events = `SELECT * FROM event INNER JOIN location ON event.loc_id = location.loc_id WHERE type = ? AND rso_id IN (?)`;
  //START EXECUTING THE QUERIES
  var query_result = await connection.promise().query(get_public_events, public)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage})});
  const public_events = query_result[0];
  //ADD PUBLIC EVENTS TO RESPONSE
  events = events.concat(public_events);
  var query_result = await connection.promise().query(get_univ_id, id)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage})});
  const univ_id = query_result[0][0].univ_id;
  var query_result = await connection.promise().query(get_loc_id, univ_id)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage})});

  if(query_result[0].length == 1){
    const loc_id = query_result[0][0].loc_id;
    var query_result = await connection.promise().query(get_private_events, [private, loc_id])
    .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage})});
    const private_events = query_result[0];
    //ADD PRIVATE EVENTS TO RESPONSE
    events = events.concat(private_events);
  }
  
  var query_result = await connection.promise().query(get_rso_ids, id)
  .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage})});
  const rso_ids_json = query_result[0]; //This is an array of JSON
  var rso_ids = [];
  rso_ids_json.forEach(element => {
    var {rso_id} = element;
    rso_ids.push(rso_id);
  });
  //If the user is in no rso's, dont run rso query
  if(rso_ids.length != 0){
    var query_result = await connection.promise().query(get_rso_events, [rso, rso_ids])
    .catch((err) => { return res.status(403).json({success: false, message: err.sqlMessage})});
    const rso_events = query_result[0];
    //ADD RSO EVENTS TO RESPONSE
    events = events.concat(rso_events);
  }
  //RETURN RESPONSE
  return res.status(200).json({success: true, message: 'The events were returned successfully', events: events});
}

module.exports = { create_event_handler, create_comment_handler, edit_comment_handler, delete_comment_handler, display_comments_handler, 
  display_event_handler, display_all_events_handler};