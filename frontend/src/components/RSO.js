/** ----------------------- IMPORTS ----------------------- */
import '../styles/Dashboard.css'
import '../styles/RSO.css'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';

import { Grid } from '@mui/material';
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import SideBar from './SideBar'
import TopBar from './TopBar'
/** ------------------------------------------------------- */


/**
 * Main function for RSO that returns all elements to be shown on RSO page
 * 
 * @returns RSO Layout
 */
export default function RSO() {

    const myRSOs = [
        {
            title: "RSO 1",
            description: "This is RSO 1",
            num_members: 14
        },
        {
            title: "RSO 2",
            description: "This is RSO 2",
            num_members: 5
        },
        {
            title: "RSO 3",
            description: "This is RSO 3",
            num_members: 8
        }
    ]

    /** MOCK DATA FOR RSO */
    const RSOs = [
        {
            title: "RSO 1",
            description: "This is RSO 1",
            num_members: 14
        },
        {
            title: "RSO 2",
            description: "This is RSO 2",
            num_members: 5
        },
        {
            title: "RSO 3",
            description: "This is RSO 3",
            num_members: 8
        },
        {
            title: "RSO 4",
            description: "This is RSO 4",
            num_members: 10
        },
        {
            title: "RSO 5",
            description: "This is RSO 5aio sdhfkjas dfkljha lsdfjhlask hdfjlhlkas dhflhlaskdh fjlhasljdhf ihasi dhufasdyf oiuhasidf uioas dohf jahskdf gyuoias klfhiuasdy fuo ashdlkh gilawh fasijh fliuias kdfjhauiowryn lgjajsnlkjngsid fkljxh oih sakjngkljhnasuiofh kasdhgioH DKJLWIUGYN UIOFDAHJ GKJAB SDKLJJLAKS KLFJHKSJLDAH FKHDSAJKD HLSA L",
            num_members: 76
        },
        {
            title: "RSO 6",
            description: "This is RSO 6",
            num_members: 45
        },
        {
            title: "RSO 7",
            description: "This is RSO 7",
            num_members: 16
        },
        {
            title: "RSO 8",
            description: "This is RSO 8",
            num_members: 123
        },
        {
            title: "RSO 9",
            description: "This is RSO 9",
            num_members: 54
        }
    ]

    /** useRefs for RSO Creation */
    const createRSODescRef = useRef()
    const createRSOEmail1Ref = useRef()
    const createRSOEmail2Ref = useRef()
    const createRSOEmail3Ref = useRef()
    const createRSONameRef = useRef()

    /** Rest of useRefs, useStates for RSO Page */
    const NUMBEROFITEMSPERPAGE = 8

    const searchString = useRef()

    const [isCreateRSOOpen, setIsCreateRSOOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageCards, setPageCards] = useState([])
    const [search, setSearch] = useState('')
    const [showMyRSOs, setShowMyRSOs] = useState(true)

    /**
     * 
     * UseEffect for page change. Everytime the pageNumber
     *  attribute changes, the useEffect makes sure, only the
     *  cards that are meant to be displayed on that page, are
     *  displayed.
     * 
     */
    useEffect(() => {

        console.log(search)

        // Indexes
        var startidx = (pageNumber - 1) * NUMBEROFITEMSPERPAGE
        var endidx = pageNumber * NUMBEROFITEMSPERPAGE
        
        // Set the page cards
        var spliced
        if(!showMyRSOs){

            // Handle Search
            if(search !== '') {

                // Find the element, if it exists, find its index and display only that card
                var idx = RSOs.findIndex(element => element.title.toLowerCase() === search.toLowerCase())
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

            spliced = RSOs.slice(startidx, endidx)
        }
        else{

            //Handle Search
            if(search !== '') {

                // Find the element, if it exists, find its index and display only that card
                var idx = RSOs.findIndex(element => element.title.toLowerCase() === search.toLowerCase())
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
            
            spliced = myRSOs.slice(startidx, endidx)
        }
            
        setPageCards(spliced)
    
    }, [pageNumber, showMyRSOs, search])

    /**
     * 
     * HandleSearch Function triggers when the search button is clicked to search
     *  for RSO
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
     * Closes the RSO Create Modal
     * 
     * @param {*} event - Close RSO Create Event 
     */
    function handleRSOCReateClose(event) {
        setIsCreateRSOOpen(false)
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

    /**
     * 
     * On Register Button click, sends a create RSO
     *  request to the /rso/create_rso api.
     * 
     * @param {*} event - Submit RSO Creation Form
     */
    async function createRSO(event) {
        event.preventDefault()

        if(createRSOEmail3Ref.current.value === null)
            console.log("Doesn't exist!")

        console.log(createRSONameRef.current.value)
        console.log(createRSODescRef.current.value)
        console.log(createRSOEmail1Ref.current.value)
        console.log(createRSOEmail2Ref.current.value)
        console.log(createRSOEmail3Ref.current.value)

        handleRSOCReateClose()
    }

    /**
     * 
     * Sends a join RSO request to the backend
     * 
     * @param {*} title - Title of the RSO
     */
    function joinRSO(title) {
        console.log('Joining ', title)
    }

    // Return RSO elements to be displayed
    return (
        <div className='Dashboard'>
            <SideBar />
            <TopBar />

            {/** RSO Section of the page */}
            <div className='RSO'>

                {/** If showMyRSOs is true */}
                {showMyRSOs && 

                    // Wrapper
                    <div style={{width: '100%', height: '100%'}}> 
                        {/** Search Component */}
                        <Form className='Search rounded border border-1 border-dark' onSubmit={handleSearch}>

                            <Form.Control
                                ref={searchString} 
                                placeholder="Search RSO by name...">
                            </Form.Control>

                            <Button variant='dark' className='button rounded' type='submit'><SearchIcon /></Button>
                        </Form>

                        {/** Button to Open the Create RSO Modal */}
                        <Button className='create-button' variant='dark' onClick={() => {setIsCreateRSOOpen(true)}}><AddCircleOutlineIcon /> Create RSO</Button>
                        
                        {/** Create RSO Modal */}
                        <Modal className="modal rounded" show={isCreateRSOOpen} onHide={handleRSOCReateClose}>
                            <Modal.Body>
                                <h2 className='text-center'>Create RSO</h2>
                                <Alert variant='info' className='info'>Creating an RSO will auto assign you as the Admin</Alert>
                                <Form onSubmit={createRSO}>
                                    {/** Name Section */}
                                    <Form.Group id='name'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control ref={createRSONameRef} placeholder="Enter RSO Name..."/>
                                    </Form.Group>
                                    
                                    {/** Description Section */}
                                    <Form.Group id='description'>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control ref={createRSODescRef} placeholder="Enter RSO Description..."/>
                                    </Form.Group>
                                    
                                    {/** Email 1 Section */}
                                    <Form.Group id='email-1'>
                                        <Form.Label>Co-founder 1's Email</Form.Label>
                                        <Form.Control 
                                        type="email" 
                                        ref={createRSOEmail1Ref} 
                                        placeholder="Enter member 1's email..."
                                        />
                                    </Form.Group>
                                    
                                    {/** Email 2 Section */}
                                    <Form.Group id='email-2'>
                                        <Form.Label>Co-founder 2's Email</Form.Label>
                                        <Form.Control 
                                        type="email" 
                                        ref={createRSOEmail2Ref} 
                                        placeholder="Enter member 2's email..."
                                        />
                                    </Form.Group>
                                    
                                    {/** Email 3 Section */}
                                    <Form.Group id='email-3'>
                                        <Form.Label>Co-founder 3's Email</Form.Label>
                                        <Form.Control 
                                        type="email" 
                                        ref={createRSOEmail3Ref} 
                                        placeholder="Enter member 3's email..."
                                        />
                                    </Form.Group>

                                    <Button variant='dark' className='w-100 mt-3' type="submit">Register</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/** Page Number and Title Bar */}
                        <div className='page-bar'>
                            <div className='title'>My RSOs</div>
                            <div className='right-arrow button' onClick={nextPage}><ArrowForwardIosIcon/></div>
                            <div className='page-no'>Page {pageNumber}</div>
                            <div className='left-arrow button' onClick={previousPage}><ArrowBackIosNewIcon/></div>
                            <div className='join-rso-button' onClick={(e) => {setShowMyRSOs(false); setSearch('')}}><GroupAddIcon />.    Browse RSOs</div>
                        </div>

                        {/** RSO Cards */}
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='rso-cards'>
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
                                        <div className='member-count'><b>Member Count:</b> <u>{value.num_members}</u></div>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </div>
                }
                
                {/** If showMyRSOs is false */}
                {!showMyRSOs && 
                    
                    // Wrapper
                    <div style={{width: '100%', height: '100%'}}> 

                        {/** Search Component */}
                        <Form className='Search rounded border border-1 border-dark' onSubmit={handleSearch}>

                            <Form.Control
                                ref={searchString} 
                                placeholder="Search RSO by name...">
                            </Form.Control>

                            <Button variant='dark' className='button rounded' type='submit'><SearchIcon /></Button>
                        </Form>

                        {/** Button to Open the Create RSO Modal */}
                        <Button className='create-button' variant='dark' onClick={() => {setIsCreateRSOOpen(true)}}><AddCircleOutlineIcon /> Create RSO</Button>
                        
                        {/** Create RSO Modal */}
                        <Modal className="modal rounded" show={isCreateRSOOpen} onHide={handleRSOCReateClose}>
                            <Modal.Body>
                                <h2 className='text-center'>Create RSO</h2>
                                <Alert variant='info' className='info'>Creating an RSO will auto assign you as the Admin</Alert>
                                <Form onSubmit={createRSO}>
                                    {/** Name Section */}
                                    <Form.Group id='name'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control ref={createRSONameRef} placeholder="Enter RSO Name..."/>
                                    </Form.Group>
                                    
                                    {/** Description Section */}
                                    <Form.Group id='description'>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control ref={createRSODescRef} placeholder="Enter RSO Description..."/>
                                    </Form.Group>
                                    
                                    {/** Email 1 Section */}
                                    <Form.Group id='email-1'>
                                        <Form.Label>Co-founder 1's Email</Form.Label>
                                        <Form.Control 
                                        type="email" 
                                        ref={createRSOEmail1Ref} 
                                        placeholder="Enter member 1's email..."
                                        />
                                    </Form.Group>
                                    
                                    {/** Email 2 Section */}
                                    <Form.Group id='email-2'>
                                        <Form.Label>Co-founder 2's Email</Form.Label>
                                        <Form.Control 
                                        type="email" 
                                        ref={createRSOEmail2Ref} 
                                        placeholder="Enter member 2's email..."
                                        />
                                    </Form.Group>
                                    
                                    {/** Email 3 Section */}
                                    <Form.Group id='email-3'>
                                        <Form.Label>Co-founder 3's Email</Form.Label>
                                        <Form.Control 
                                        type="email" 
                                        ref={createRSOEmail3Ref} 
                                        placeholder="Enter member 3's email..."
                                        />
                                    </Form.Group>

                                    <Button variant='dark' className='w-100 mt-3' type="submit">Register</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/** Page Number and Title Bar */}
                        <div className='page-bar'>
                            <div className='title'>Browse RSO</div>
                            <div className='right-arrow button' onClick={nextPage}><ArrowForwardIosIcon/></div>
                            <div className='page-no'>Page {pageNumber}</div>
                            <div className='left-arrow button' onClick={previousPage}><ArrowBackIosNewIcon/></div>
                            <div className='join-rso-button' style={{marginLeft: '56%'}} onClick={(e) => {setShowMyRSOs(true); setSearch('')}}><Diversity1OutlinedIcon />.    My RSOs</div>
                        </div>

                        {/** RSO Cards */}
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='rso-cards'>
                            {pageCards.map((value, key) => {
                                return (
                                    <Grid item key={key} xs={2.95} className='cards rounded'>
                                        <div className='title'>
                                            {value.title}
                                            <div className='join-icon' onClick={(event) => {joinRSO(value.title)}}>
                                                <AddTaskIcon/>
                                            </div>
                                        </div>
                                        <div className='description'>
                                            <b><u>Description</u></b> 
                                            : {value.description}
                                        </div>
                                        <div className='member-count'><b>Member Count:</b> <u>{value.num_members}</u></div>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </div>
                }
            </div>
        </div>
    )
}
