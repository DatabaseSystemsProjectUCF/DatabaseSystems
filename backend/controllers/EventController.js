const express = require("express");
const bodyParser = require("body-parser");
//const connection = require("./../Database");
const connection = require("./../DatabaseJuan");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const create_event_handler = async (req, res) => {
  var location_id;
  var rso_id;

  //Get info from the client:
  //Talk to Usman on best way to receive optional parameter rso_name !!
  const { rso_name, name, description, category, type, date, time, phone, email, name_loc, lat, long } = req.body;

  //I have to verify if the location already exists in the DB.
  const verify_location = `SELECT loc_id FROM location WHERE latitude = ? AND longitud = ?`;

  const find_location = await connection.promise().query(verify_location, [lat, long], (err, results, fields) => {
    if (err) res.status(403).json({ success: false, message: err.sqlMessage });
  });

  //No location was found, so we have to create a new location
  if (find_location[0] != null) {
    const create_location = `INSERT INTO location (name, latitude, longitud) VALUES (?, ?, ?)`;
    const location_insertion = await connection.promise().query(create_location, [name_loc, lat, long], (err, results, fields) => {
      if (err) res.status(403).json({ success: false, message: err.sqlMessage });
    });

    location_id = location_insertion[0].insertId;
  }
  else {
    //The location is already in the DB
    location_id = find_location[0].loc_id;
  }

  // At this point we have the location ID in the location_id var
  // console.log(`the location ID  out of conditional is ${location_id}`);

  //I also have to verify the existence of an RSO if the event is an rso event.
  if (type == 'rso') {
    const verify_rso = `SELECT * FROM rso WHERE name = ?`;
    const rso = await connection.promise().query(verify_rso, rso_name, (err, results, fields) => {
      if (err) res.status(403).json({ success: false, message: err.sqlMessage });
    });

    if (rso[0] == null) {
      //no rso was found, return 401
      res.status(401).json({ success: false, message: "RSO was not found" });
    }
    else {
      rso_id = rso[0].rso_id;

      //Prepare query to insert the event into the DB.
      const create_event_rso = `INSERT INTO event (loc_id, rso_id, name, description, category, type, time, date, phone, email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(create_event_rso, [location_id, rso_id, name, description, category, type, time, date, phone, email],
        (err, result) => {
          if (err) res.status(403).json({ success: false, message: err.sqlMessage });

          else res.status(200).json({ success: true, message: "Event was successfully created!" });
        });


    }
  }

  else {
    //It is not an rso event so we prepare the query without the rso id
    const create_event = `INSERT INTO event (loc_id, name, description, category, type, time, date, phone, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(create_event, [location_id, name, description, category, type, time, date, phone, email],
      (err, results, fields) => {
        if (err) res.status(403).json({ success: false, message: err.sqlMessage });

        else res.status(200).json({ success: true, message: "Event was successfully created!" });
      });
  }

}

const create_comment_handler = async(req,res)=>{
  //get data from user
  const {id, content, rating} = req.body;
  const {event_id} = req.query;

  //create queries
  const query = `INSERT INTO comments (content, rating, id, event_id) VALUES (?, ?, ?, ?)`;
  const verify_event = `SELECT * FROM event WHERE event_id = ?`;

  //execute query to verify that event exists
  connection.query(verify_event, event_id, (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else {
      if(result[0]==null){
        return res.status(401).json({ success: false, message: "Event doesn't exist"});
      }
      //execute query to create new comment
      connection.query(query, [content, rating, id, event_id], (error, result)=>{
        if (error) return res.status(403).json({ success: false, message: error.sqlMessage });

        return res.status(200).json({ "success" : true, "message": "Comment created successfully" });
      });
    }
  });
}

const edit_comment_handler = async(req,res)=>{

}

const display_comments_handler = async(req,res) =>{
  //create query
  const query = `SELECT * FROM comments`;

  //execute query to display all events
  connection.query(query, (error, result) => {
    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
    else 
      return res.status(200).json({ "success" : true, "message": result });
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

module.exports = { create_event_handler, create_comment_handler, edit_comment_handler, display_comments_handler};