/** ----------------------- IMPORTS ----------------------- */
import '../styles/Dashboard.css'

import SideBar from './SideBar'
/** ------------------------------------------------------- */


/**
 * Main function for Dashboard that returns all elements to be shown on Dashboard
 * 
 * @returns Dashboard Layout
 */
export default function Dashboard() {

    // Return Dashboard elements to be displayed
    return (
        <div className='Dashboard'>
            <SideBar />
        </div>
    )
}
