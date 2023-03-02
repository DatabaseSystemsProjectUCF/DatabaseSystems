const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./../Database");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const create_event_handler = async (req, res) => {
    var error_code = -1;
    var location_id = -1;
    var rso_id = -1;
    
    //Get info from the client:
    //Talk to Usman on best way to receive optional parameter rso_name !!
    const{ rso_name, name, description, category, type, date, time, phone, email, name_loc, lat, long} = req.body;
    
    
    //I have to verify if the location already exists in the DB.
    const verify_location = `SELECT * FROM location WHERE latitude = ? AND longitud = ?`;

    await connection.query(verify_location, [lat, long], async (err, results) => {
        if(err) error_code = 0;

        if(results[0] == null){
            //IF the location has not been created THEN I have to create a location object in the database before creating the event object
            //to do this I have to insert a row in "locations"
            const create_location = `INSERT INTO location (name, latitude, longitude) VALUES (?, ?, ?)`;
            await connection.query(create_location, [name_loc, lat, long], (err, results) => {
                if(err) error_code = 0;

                //Location was added succesfully!!
            });
        }

        

    }).then((results) => {
        //get the id of the location into a variable
        location_id = results[0].loc_id;
    })

    
    

    //I also have to verify the existence of an RSO if the event is an rso event.
    if(type == 'rso'){
        const verify_rso = `SELECT * FROM rso WHERE name = ?`;
        await connection.query(verify_rso, rso_name, (err, result) => {
            if(err) error_code = 0;

            //IF the rso does not exist THEN return the client a 401 error
            if(result[0] == null) error_code = 1;
            //ELSE get the id of the rso into a variable
            else rso_id = result[0].rso_id;
        });
    }

    //Throw errors if any
    if(error_code === 0) res.status(403).json({ success: false, message: err.sqlMessage });
    else if(error_code === 1) res.status(401).json({ success: false, message: "RSO was not found" });
    else{
        //Prepare query to insert the event into the DB.
        const create_event_rso = `INSERT INTO event (loc_id, rso_id, name, description, category, type, time, date, phone, email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const create_event = `INSERT INTO event (loc_id, name, description, category, type, time, date, phone, email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

        if(rso_id === -1){
            //IF there is no rso id it means it is not an rso event
            await connection.query(create_event, [location_id, name, description, category, type, time, date, phone, email], 
                (err, result) => {
                    if(err) res.status(403).json({ success: false, message: err.sqlMessage});

                    else res.status(200).json({ success: true, message: "Event was successfully created!"});
                });
        }
        else{
            //ELSE, insert rso event
            await connection.query(create_event_rso, [location_id, rso_id, name, description, category, type, time, date, phone, email], 
                (err, result) => {
                    if(err) res.status(403).json({ success: false, message: err.sqlMessage});

                    else res.status(200).json({ success: true, message: "Event was successfully created!"});
                });
        }
        //Execute query.
    }    
}

//HOW TO HANDLE PRIVACY:
        //PUBLIC:
        //any student can see the event, no verification required
        //PRIVATE:
        //only students at the host university can see this type of events.
        //verification required using the student's email.
        //RSO:
        //only students belonging to an rso can view the event.

module.exports = { create_event_handler };