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
    const {id} = req.body;
    const {rso_id} = req.param;

    //verify the rso id and the student id are valid
    const verify_query1 = `SELECT * FROM students WHERE id = ?`;
    const verify_query2 = `SELECT * FROM rso WHERE rso_id = ?`;
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

const create_rso_handler = (req, res) =>{

    const {name, description, email1, email2, email3} = req.body;
    var id;
    //verify the students emails are valid
    const verify_email1= `SELECT id FROM users WHERE email = ?`;
    const verify_email2= `SELECT id FROM users WHERE email = ?`;
    const verify_email3= `SELECT id FROM users WHERE email = ?`;
    const query = `INSERT INTO rso (name, description, id) VALUES (?, ?, ?)`;

    connection.query(verify_email1, [email1], (err, results) => {
        if(err) throw err;

        //the user is not in the database
        if(results[0] == null){
            res.status(401).send({ error: "User not found" });
        }
        id = results[0];

    })
    connection.query(verify_email2, [email2], (err, results) => {
        if(err) throw err;

        //the user is not in the database
        if(results[0] == null){
            res.status(401).send({ error: "User not found" });
        }
    })
    connection.query(verify_email3, [email3], (err, results) => {
        if (err) throw err;

        //the user is not in the database
        if(results[0] == null){
            res.status(401).send({error: "User not found"});
        }
    })
    connection.query(query, [name, description, id], (err, results)=>{
        if (err) throw err;
        //successful insertion
        res.status(200).send({message: "Successfully created an RSO!!"})
    });


}

module.exports = {join_rso_handler, create_rso_handler};