/** ----------------------- IMPORTS ----------------------- */
//import CurrentUser from "./CurrentUser"
import Dashboard from "./Dashboard"
import Login from "./Login"
import Register from "./Register"
import PrivateRoute from "./PrivateRoute";
import React from 'react';
import { Container } from 'react-bootstrap'
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
        <Container fluid className="d-flex align-items-center justify-content-center" style={{ maxWidth: "100%", minHeight: "100vh" }}>
            <div>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<PrivateRoute> <Dashboard /> </PrivateRoute>}/>
                        <Route path="/Login" element={<UnauthenticatedRoute> <Login /> </UnauthenticatedRoute>}/>
                        <Route path="/Signup" element={<UnauthenticatedRoute> <Register /> </UnauthenticatedRoute>}/>
                        <Route path="/Register" element={<UnauthenticatedRoute> <Register /> </UnauthenticatedRoute>}/>
                    </Routes>
                </Router>
            </div>
        </Container>
    )
}