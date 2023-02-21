/** ----------------------- IMPORTS ----------------------- */
import React from 'react'

import CottageIcon from '@mui/icons-material/Cottage';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
/** ------------------------------------------------------- */

export const SideBarData = [
    {
        title: "Search",
        icon: <SearchIcon />,
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
        link: "/RSO"
    },
    {
        title: "Events",
        icon: <EventIcon />,
        link: "/Events"
    }
]