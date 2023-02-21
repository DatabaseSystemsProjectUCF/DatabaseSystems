/** ----------------------- IMPORTS ----------------------- */
import '../styles/Dashboard.css'

import SideBar from './SideBar'
/** ------------------------------------------------------- */


/**
 * Main function for Events that returns all elements to be shown on Events page
 * 
 * @returns Events Layout
 */
export default function Events() {

    // Return Events elements to be displayed
    return (
        <div className='Dashboard'>
            <SideBar />
        </div>
    )
}
