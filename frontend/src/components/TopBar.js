/** ----------------------- IMPORTS ----------------------- */
import '../styles/TopBar.css'
import banner from '../images/banner.jpg'

import React from 'react'
/** ------------------------------------------------------- */

/**
 * The top bar displayed on each page. Displays the different options
 *      available on each page and the UCF Banner.
 * 
 * @returns Top Bar Component
 */
export default function TopBar() {
  return (
    <div className='TopBar'>
        <div className='Banner' style={{ backgroundImage: `url(${banner})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            
        </div>
    </div>
  )
}