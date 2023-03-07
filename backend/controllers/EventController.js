const express = require("express");
const bodyParser = require("body-parser");
//const connection = require("./../Database");
const connection = require("./../DatabaseJuan");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const create_event_handler = (req, res) => {
  var location_id;
  var rso_id;

  //Get info from the client:
  //Talk to Usman on best way to receive optional parameter rso_name !!
  const { rso_name, name, description, category, type, date, time, phone, email, name_loc, lat, long } = req.body;


  //I have to verify if the location already exists in the DB.
  const verify_location = `SELECT loc_id FROM location WHERE latitude = ? AND longitud = ?`;

  connection.query(verify_location, [lat, long], (err, results, fields) => {
      if(err) res.status(403).json({ success: false, message: err.sqlMessage });

      else if(results.length == 0){
        //no location was found, so we have to create a new location
        console.log("No location was found, creating one...");
        const create_location = `INSERT INTO location (name, latitude, longitud) VALUES (?, ?, ?)`;
        connection.query(create_location, [name_loc, lat, long], (err, results, fields) => {
          if(err) res.status(403).json({ success: false, message: err.sqlMessage });

          else if(results.affectedRows == 1){
            //the location was succesfully inserted so now we have to get its ID
            console.log("the location was succesfully inserted so now we have to get its ID");
            connection.query(verify_location, [lat, long], (err, results, fields) => {
              if(err) res.status(403).json({ success: false, message: err.sqlMessage });

              else if(results[0] != null){
                //we found the location
                console.log("we found the location that was just created");
                location_id = results[0].loc_id;
                //console.log(`the location ID is ${location_id}`);
              }

              else{
                console.log("couldn't find location that was just created");
              }
            });

          }
          else{
            console.log(`we couldn't create the new location`);
          }
        });
      }
      else{
        //the location is already in the db
        location_id = results[0].loc_id;
      }
  });

  // At this point we have the location ID in the location_id var
  console.log(`the location ID is ${location_id}`);

  //I also have to verify the existence of an RSO if the event is an rso event.
  if (type == 'rso') {
    const verify_rso = `SELECT * FROM rso WHERE name = ?`;
    connection.query(verify_rso, rso_name, (err, results,  fields) => {
      if (err) res.status(403).json({ success: false, message: err.sqlMessage });

      else if(results.length == 0){
        //no rso was found, return 401
        res.status(401).json({ success: false, message: "RSO was not found" });
      }

      else{
        rso_id = results[0].rso_id;

        //Prepare query to insert the event into the DB.
        const create_event_rso = `INSERT INTO event (loc_id, rso_id, name, description, category, type, time, date, phone, email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(create_event_rso, [location_id, rso_id, name, description, category, type, time, date, phone, email],
          (err, result) => {
            if (err) res.status(403).json({ success: false, message: err.sqlMessage });
      
            else res.status(200).json({ success: true, message: "Event was successfully created!" });
          });

        
      }
    });
  }

  else{
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