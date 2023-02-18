
/** ----------------------- IMPORTS ----------------------- */
import { ID } from "../constants/DatabaseConstants"
import React, { useState } from 'react'
import { Navigate } from "react-router-dom"
/** ------------------------------------------------------- */

/**
 * Default Function for Unauthenticated Route - Reroutes the user to 
 *      dashboard page if a user is already signed in and the login or
 *      register page is being accessed.
 * 
 * @param children - Page attempting to access
 * 
 * @returns Elements to reroute if a user is already signed in
 */
export default function UnauthenticatedRoute({ children }) {

    // IsLoggedIn Status
    const [isUnauthenticated, setIsUnauthenticated] = useState(checkLoggedInStatus())

    /** Validate User Signed In status */
    function checkLoggedInStatus(){
        return localStorage.getItem(ID) ? false : true
    }

    // If the current user is not logged in, reditect them to the login page
    return isUnauthenticated ? children : <Navigate to="/" />;
}