/** ----------------------- IMPORTS ----------------------- */
import "../styles/App.css"

import Dashboard from "./Dashboard"
import Login from "./Login"
import Register from "./Register"
import PrivateRoute from "./PrivateRoute";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UnauthenticatedRoute from "./UnauthenticatedRoute";
/** ------------------------------------------------------- */

/**
 * Main Function for the React App
 * 
 * @returns The main App
 */
export default function App() {

    // Return all App elements to be displayed
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route exact path="/" element={<PrivateRoute> <Dashboard /> </PrivateRoute>}/>
                    <Route path="/Login" element={<UnauthenticatedRoute> <Login /> </UnauthenticatedRoute>}/>
                    <Route path="/Signup" element={<UnauthenticatedRoute> <Register /> </UnauthenticatedRoute>}/>
                    <Route path="/Register" element={<UnauthenticatedRoute> <Register /> </UnauthenticatedRoute>}/>
                </Routes>
            </Router>
        </div>
    )
}