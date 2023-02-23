const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const connection = require("./../Database");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const join_rso_handler = (req, res) => {
    //get information from the request
    const {rso_id, id} = req.body;

    //verify the rso id and the student id are valid
    const verify_query1 = `SELECT * FROM student WHERE id == ?`;
    const verify_query2 = `SELECT * FROM rso WHERE rso_id == ?`;
    const query = `INSERT INTO joins (rso_id, id) VALUES (?, ?)`;

    connection.query(verify_query1, [id], (err, results) => {
        if(err) throw err;

        //the student is not in the database
        if(results[0] == null){
            res.status(401).send({ error: "User not found" });
        }

        //else, the student was found so verify the rso id
    }).then(connection.query(verify_query2, [rso_id], (err, results) => {
        if(err) throw err;

        //the rso is not in the database
        if(results[0] == null){
            res.status(401).send({ error: "RSO not found" });
        }

        //else, the rso was found, now add row to the joins table
    })).then(connection.query(query, [rso_id, id], (err, results) => {
        if(err) throw err;

        //successful insertion
        res.status(200).send({message: "Successfully joined to the RSO!!"})

    }));

}

module.exports = {join_rso_handler};