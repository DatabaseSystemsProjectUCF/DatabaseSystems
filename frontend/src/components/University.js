/** ----------------------- IMPORTS ----------------------- */
import '../styles/Dashboard.css'
import '../styles/University.css'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';

import { Grid } from '@mui/material';
import { useEffect, useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import SideBar from './SideBar'
import TopBar from './TopBar'
/** ------------------------------------------------------- */


/**
 * Main function for Dashboard that returns all elements to be shown on Dashboard
 * 
 * @returns Dashboard Layout
 */
export default function University() {

    /** useRefs, useStates for University Page */
    const NUMBEROFITEMSPERPAGE = 8

    const searchString = useRef()

    const [pageNumber, setPageNumber] = useState(1)
    const [pageCards, setPageCards] = useState([])
    const [search, setSearch] = useState('')

    /**
     * 
     * UseEffect for page change. Everytime the pageNumber
     *  attribute changes, the useEffect makes sure, only the
     *  cards that are meant to be displayed on that page, are
     *  displayed.
     * 
     */
    useEffect(() => {

        const universities = [
            {
                title: "University 1",
                description: "This is University 1",
                num_members: 14,
                name_loc: "Downtown orlando",
                lat: 2.456,
                long: 5.632
            },
            {
                title: "University 2",
                description: "This is University 2",
                num_members: 5,
                name_loc: "Downtown orlando",
                lat: 2.456,
                long: 5.632
            },
            {
                title: "University 3",
                description: "This is University 3",
                num_members: 8,
                name_loc: "Downtown orlando",
                lat: 2.456,
                long: 5.632
            }
        ]

        console.log(search)

        // Indexes
        var startidx = (pageNumber - 1) * NUMBEROFITEMSPERPAGE
        var endidx = pageNumber * NUMBEROFITEMSPERPAGE

        var spliced
        //Handle Search
        if(search !== '') {

            // Find the element, if it exists, find its index and display only that card
            let idx = universities.findIndex(element => element.title.toLowerCase() === search.toLowerCase())
            if(idx !== -1){
                startidx = idx
                endidx = idx + 1
            }
            else { 
                startidx = 0
                endidx = 0
            }
            console.log(idx)
        }
        
        spliced = universities.slice(startidx, endidx)
            
        setPageCards(spliced)
    
    }, [pageNumber, search])

    /**
     * 
     * HandleSearch Function triggers when the search button is clicked to search
     *  for Event
     * 
     * @param {*} event - Search Button Clicked event 
     */
    async function handleSearch(event) {
        event.preventDefault()
        setSearch(searchString.current.value)
        console.log("Searching...")
    }

    /**
     * 
     * Handles next page click event
     * 
     * @param {*} event - Next-page button click event
     */
    function nextPage(event) {
        event.preventDefault()

        setPageNumber(pageNumber + 1)
    }

    /**
     * 
     * Handles previous page clicked
     * 
     * @param {*} event - Previous page button click event
     */
    function previousPage(event) {
        event.preventDefault()

        var newpagenum = 1
        if(pageNumber <= 1)
            newpagenum = 1
        else newpagenum = pageNumber - 1

        setPageNumber(newpagenum)
    }

    // Return Dashboard elements to be displayed
    return (
        <div className='Dashboard'>
            <SideBar />
            <TopBar />
            
            <div className='University'>
                <div style={{width: '100%', height: '100%'}}> 
                    {/** Search Component */}
                    <Form className='Search rounded border border-1 border-dark' onSubmit={handleSearch}>

                        <Form.Control
                            ref={searchString} 
                            placeholder="Search University by name...">
                        </Form.Control>

                        <Button variant='dark' className='button rounded' type='submit'><SearchIcon /></Button>
                    </Form>

                    {/** Page Number and Title Bar */}
                    <div className='page-bar'>
                        <div className='title'>Universities</div>
                        <div className='right-arrow button' onClick={nextPage}><ArrowForwardIosIcon/></div>
                        <div className='page-no'>Page {pageNumber}</div>
                        <div className='left-arrow button' onClick={previousPage}><ArrowBackIosNewIcon/></div>
                    </div>

                    {/** University Cards */}
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='University-cards'>
                        {pageCards.map((value, key) => {
                            return (
                                <Grid item key={key} xs={2.95} className='cards rounded'>
                                    <div className='title'>
                                        {value.title}
                                    </div>
                                    <div className='description'>
                                        <b><u>Description</u></b> 
                                        : {value.description}
                                    </div>
                                    <div className='location'><b><u>Location</u></b>: ({value.lat} {value.long})</div>
                                    <div className='member-count'><b>No. of Students:</b> <u>{value.num_members}</u></div>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>
            </div>
        </div>
    )
}
