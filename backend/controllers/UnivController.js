const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const connection = require("./../Database");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Create university profile and super admin for that university
const create_univ_handler = async (req, res) => {
    //get data from user
    const {name,description,no_students,first_name,last_name,email,password,} = req.body;
    const email_domain = email.substring(email.indexOf("@"), email.length);
    const level_id = 2;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    //create queries
    const univ_verify = `SELECT email_domain FROM university WHERE email_domain = ?`;
    const univ_query = `INSERT INTO university (name, description, no_students, email_domain) VALUES (?, ?, ?, ?)`;
    const user_query = `INSERT INTO users (first_name, last_name, email, password, level_id) VALUES (?, ?, ?, ?, ?)`;
    const s_a_query = `INSERT INTO s_admin (id, univ_id) VALUES (? ,?)`;

    //get user and university ids for s_admin table
    const query1 = `SELECT id FROM users WHERE email = ?`;
    const query2 = `SELECT univ_id FROM university WHERE email_domain = ?`;

    //execute query to check if email domain already exists
    connection.query(univ_verify, email_domain, (error, result) => {
        if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
        else {
            if (result[0] == null) {
                //execute query to create university profile
                connection.query(univ_query,[name, description, no_students, email_domain],(error, result) => {
                        if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
                        else {
                            //execute query to create user account
                            connection.query(user_query,[first_name, last_name, email, hashedPass, level_id],(error, result) => {
                                if (error) return res.status(403).json({ success: false, message: error.sqlMessage });
                            });
                        }
                });
            } else {
                //if email_domain for university already exists send an error
                return res.status(401).json({success: false, message: "University with domain entered already exists"});
            }

            //execute query to get univ_id
            connection.query(query2, email_domain, (error, result) => {
                if (error) return res.status(403).json({ success: false, message: error.sqlMessage });

                const univ_id = result[0].univ_id;
                //execute query to get user_id
                connection.query(query1, email, (error, result) => {
                    if (error) return res.status(403).json({ success: false, message: error.sqlMessage });

                    const id = result[0].id;
                    //execute query to add new s_admin 
                    connection.query(s_a_query, [id, univ_id], (error, result) => {
                        if (error) return res.status(403).json({ success: false, message: error.sqlMessage });

                        return res.status(200).json({success: true, message: "University and User created successfully"});
                    });
                });
            });
        }
    });
};

module.exports = { create_univ_handler };
