/** ----------------------- IMPORTS ----------------------- */
import '../styles/Dashboard.css'

import SideBar from './SideBar'
import TopBar from './TopBar'
/** ------------------------------------------------------- */


/**
 * Main function for RSO that returns all elements to be shown on RSO page
 * 
 * @returns RSO Layout
 */
export default function RSO() {

    // Return RSO elements to be displayed
    return (
        <div className='Dashboard'>
            <SideBar />
            <TopBar />
        </div>
    )
}
