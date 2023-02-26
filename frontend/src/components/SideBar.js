/** ----------------------- IMPORTS ----------------------- */
import '../styles/Sidebar.css'
import LogoutIcon from '@mui/icons-material/Logout';

import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { SideBarData } from './SideBarData'
import { USERNAME } from '../constants/DatabaseConstants'
import SearchComponent from './SearchComponent';
/** ------------------------------------------------------- */

/**
 * Top level of Sidebar component. Uses SideBarData for its
 *      data.
 * 
 * @returns Sidebar Component
 */
export default function SideBar() {

    // useStates for SideBar
    const [extendSearchComponent, setExtendSearchComponent] = useState(false)
    const [currentSearchStyle, setCurrentSearchStyle] = useState('')

    /**
     * useEffect triggered each time the extendSearchComponent changes (when
     *      search button is clicked)
     */
    useEffect(() => {

        // Move the other divs down to make room for search's dropdown
        extendSearchComponent ? setCurrentSearchStyle('search') : setCurrentSearchStyle('')

    }, [extendSearchComponent])

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

    /**
     * Function to handle signout. Clears out the local
     *      storage and redirects to login.
     * 
     */
    function handleSignOut() {
        // Clear localStorage
        localStorage.clear()
        
        // Redirect to Login
        window.location.pathname = "/Login"
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
                        <div key={key}>
                            <li 
                            className='row'
                            id={ (window.location.pathname === value.link && !extendSearchComponent && value.title !== "Search") || (extendSearchComponent && value.title === "Search")  ? "active" : currentSearchStyle }
                            onClick={() => { if (value.title !== "Search") window.location.pathname = value.link; else setExtendSearchComponent(!extendSearchComponent) }}
                            >
                                {" "}
                                <div id='icon'>{value.icon}</div> {" "}
                                <div id='title'>{value.title}</div>
                            </li>

                            {/** Extend Search component if search is clicked. Uses SearchComponent.js for it's data */}
                            { extendSearchComponent && value.title === 'Search' && <SearchComponent  /> }
                        </div>
                    )
                })}
            </ul>

            <ul className='Signout-Button'>
                <li 
                className='row' 
                id='signout'
                onClick={() => {handleSignOut()}}>
                    <div id='icon'><LogoutIcon /></div>
                    <div id='title'>Sign Out</div>
                </li>
            </ul>
        </div>
    )
}
