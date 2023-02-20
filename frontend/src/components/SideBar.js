/** ----------------------- IMPORTS ----------------------- */
import '../styles/Sidebar.css'

import { Avatar } from '@mui/material';
import React from 'react'
import { SideBarData } from './SideBarData'
import { USERNAME } from '../constants/DatabaseConstants'
/** ------------------------------------------------------- */

/**
 * Top level of Sidebar component. Uses SideBarData for its
 *      data.
 * 
 * @returns Sidebar Component
 */
export default function SideBar() {

    /**
     * Utility function to get the Username
     * 
     * @returns {String} Capitalized Username
     */
    function getCapitalizedUsername(){
        // Get the username
        let username = localStorage.getItem(USERNAME)

        // Ensure username has a value
        if(username === null)
            username = 'Unknown'

        // Capitalize the string
        username = username.toUpperCase()
        
        // return the first letter
        return username
    }

    return (

        // Main SideBar Div
        <div className='Sidebar'>

            {/** Profile Section */}
            <ul className='profile'>

                {/** Profile Icon */}
                <Avatar id='profile-pic'>
                    { getCapitalizedUsername().charAt(0) } 
                </Avatar>

                {/** Welcome Message */}
                <div id='welcome-message'>WELCOME {getCapitalizedUsername()}</div>
            </ul>

            {/** SideBar Options */}
            <ul className='SidebarList'>
                {SideBarData.map((value, key) => {
                    return (
                        // Individual option rows. Uses SideBarData.js for its data
                        <li 
                        key={key} 
                        className='row'
                        id={window.location.pathname === value.link ? "active" : ""}
                        onClick={() => { if (value.title !== "Search") window.location.pathname = value.link }}
                        >
                            {" "}
                            <div id='icon'>{value.icon}</div> {" "}
                            <div id='title'>
                                {value.title}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
