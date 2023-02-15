
/** ----------------------- IMPORTS ----------------------- */
import { ID } from "../constants/DatabaseConstants"
import React, { useState } from 'react'
import { Navigate } from "react-router-dom"
/** ------------------------------------------------------- */

/**
 * Default Function for Private Route - Reroutes the user to 
 *      login page if no user is signed in and a user-specific page
 *      is being accessed.
 * 
 * @param targetPage - Page attempting to access
 * 
 * @returns Elements to reroute if no user is signed in
 */
export default function PrivateRoute({ targetPage }) {

    // IsLoggedIn Status
    const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedInStatus())

    /** Validate User Signed In status */
    function checkLoggedInStatus(){
        return localStorage.getItem(ID) ? true : false
    }

    // If the current user is not logged in, reditect them to the login page
    return isLoggedIn ? targetPage : <Navigate to="/login" />;
}