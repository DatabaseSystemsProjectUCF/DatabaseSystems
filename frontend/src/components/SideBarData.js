/** ----------------------- IMPORTS ----------------------- */
import React from 'react'

import CottageIcon from '@mui/icons-material/Cottage';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import SearchIcon from '@mui/icons-material/Search';
/** ------------------------------------------------------- */

export const SideBarData = [
    {
        title: "Search",
        icon: <SearchIcon/>,
        link: "/"
    },
    {
        title: "Home",
        icon: <CottageIcon />,
        link: "/"
    },
    {
        title: "RSO",
        icon: <Diversity1OutlinedIcon />,
        link: "/"
    }
]