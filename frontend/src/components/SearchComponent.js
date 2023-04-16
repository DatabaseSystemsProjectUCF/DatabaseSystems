/** ----------------------- IMPORTS ----------------------- */
import '../styles/Sidebar.css'

import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import React from 'react'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
/** ------------------------------------------------------- */

/**
 * Renders the extended search options to show the different searches
 * 
 * @returns The Search Component
 */
export default function SearchComponent() {

    // return the search component
    return (
        <ul className='Search'>
            <li className='SearchList'>
                <li className='search-row'>
                    <div id='icon'><SchoolOutlinedIcon style={{fontSize:'20px'}}/></div>
                    <div id='title'>University Search</div>
                </li>
            </li>
            <li className='SearchList'>
                <li className='search-row'>
                    <div id='icon' ><GroupAddOutlinedIcon style={{fontSize:'20px'}}/></div>
                    <div id='title'>RSO Search</div>
                </li>
            </li>
            <li className='SearchList'>
                <li className='search-row'>
                    <div id='icon'><EmojiEventsOutlinedIcon style={{fontSize:'20px'}}/></div>
                    <div id='title'>Events Search</div>
                </li>
            </li>
        </ul>
    )
}