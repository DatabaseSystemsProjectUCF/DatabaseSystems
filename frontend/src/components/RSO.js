/** ----------------------- IMPORTS ----------------------- */
import '../styles/Dashboard.css'
import '../styles/RSO.css'

import axios from 'axios'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';

import { EMAIL, ID } from '../constants/DatabaseConstants';
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
    const [RSOs, setRSOs] = useState([])
    const [myRSOs, setMyRSOs] = useState([])
    const [search, setSearch] = useState('')
    const [showMyRSOs, setShowMyRSOs] = useState(false)
    const [error, setError] = useState('')

    /**
     * 
     * UseEffect for the initial page load. Loads only one time
     * 
     */
    useEffect(() => {

        fetchData()

    }, [])

    /**
     * 
     * Fetches initial load data
     */
    async function fetchData() {
        
        // All RSOs
        await axios.get("http://localhost:8800/rso/display_all_rso").then((response) => {
            setRSOs(response.data.data)
        }).catch((api_error) => {
            console.log(api_error)
        })

        // My RSOs
        await axios.get(`http://localhost:8800/rso/my_rsos?id=${localStorage.getItem(ID)}`).then((response) => {
            setMyRSOs(response.data.data)
        }).catch((api_error) => {
            console.log(api_error)
        })
    }

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
                let idx = RSOs.findIndex(element => element.name.toLowerCase() === search.toLowerCase())
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

            if(!RSOs){
                spliced = []
                return
            }
            else spliced = RSOs.slice(startidx, endidx)
        }
        else{

            //Handle Search
            if(search !== '') {

                // Find the element, if it exists, find its index and display only that card
                let idx = RSOs.findIndex(element => element.name.toLowerCase() === search.toLowerCase())
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
            
            if(!myRSOs){
                spliced = []
            }
            else spliced = myRSOs.slice(startidx, endidx)
        }
            
        setPageCards(spliced)
    
    }, [pageNumber, showMyRSOs, search, RSOs, myRSOs])

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
        console.log(localStorage.getItem(EMAIL))
        console.log(createRSOEmail1Ref.current.value)
        console.log(createRSOEmail2Ref.current.value)
        console.log(createRSOEmail3Ref.current.value)

        axios.post("http://localhost:8800/rso/create_rso", {

            name: createRSONameRef.current.value,
            description: createRSODescRef.current.value,
            admin_email: localStorage.getItem(EMAIL),
            email1: createRSOEmail1Ref.current.value,
            email2: createRSOEmail2Ref.current.value,
            email3: createRSOEmail3Ref.current.value

        }).then((response) => {

            console.log(response)
            
            if(response.status === 200)
                window.location.reload()

        }).catch((auth_error) => {

            // If the domain already exists
            if(auth_error.response.status === 401){
                setError('University with domain entered already exists')
                console.log(auth_error.response.data)
            }
            if(auth_error.response.status === 403){
                setError('Internal Error')
                console.log(auth_error.response.data)
            }
        })

        handleRSOCReateClose()
    }

    /**
     * 
     * Sends a join RSO request to the backend
     * 
     * @param {*} rso_id - RSO ID
     */
    function joinRSO(rso_id) {
        console.log('Joining ', rso_id)

        axios.post(`http://localhost:8800/rso/join_rso?rso_id=${rso_id}`, {

            id: localStorage.getItem(ID)

        }).then((response) => {

            console.log(response)
            
            if(response.status === 200){
                const joined = RSOs.filter((rso) => rso.rso_id === rso_id)
                const newMyRSOs = [...myRSOs, joined[0]]
                setMyRSOs(newMyRSOs)
            }

        }).catch((auth_error) => {

            // If the domain already exists
            if(auth_error.response.status === 401){
                setError('University with domain entered already exists')
                console.log(auth_error.response.data)
            }
            if(auth_error.response.status === 403){
                setError('Internal Error')
                console.log(auth_error.response.data)
            }
        })
    }

    /**
     * 
     * Sends a join RSO request to the backend
     * 
     * @param {*} rso_id - RSO ID
     */
    function leaveRSO(rso_id) {
        console.log('Leaving ', rso_id)

        axios.put(`http://localhost:8800/rso/leave_rso?rso_id=${rso_id}&id=${localStorage.getItem(ID)}`).then((response) => {

            console.log(response)

            if(response.status === 200){
                const newRSOs = myRSOs.filter((rso) => rso.rso_id != rso_id)
                setMyRSOs(newRSOs)
            }

        }).catch((auth_error) => {

            // If the domain already exists
            if(auth_error.response.status === 401){
                setError('University with domain entered already exists')
                console.log(auth_error.response.data)
            }
            if(auth_error.response.status === 403){
                setError('Internal Error')
                console.log(auth_error.response.data)
            }
        })
    }

    /**
     * 
     * Validates whether the user has already joined the 
     *  RSO.
     * 
     * @param {*} rso_id - RSO ID 
     * @returns 
     */
    function hasAlreadyJoined(rso_id) {
        let joined = false

        if(!myRSOs)
            return false

        myRSOs.forEach((rso) => {
            if(rso.rso_id === rso_id)
                joined = true
        })

        return joined
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
                                            {value.name}
                                            <div className='join-icon' onClick={(event) => {leaveRSO(value.rso_id)}}>
                                                <ExitToAppIcon/>
                                            </div>
                                        </div>
                                        <div className='description'>
                                            <b><u>Description</u></b> 
                                            : {value.description}
                                        </div>
                                        <div className='member-count'><b>Member Count:</b> <u>{value.no_members}</u></div>
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
                                            {value.name}
                                            {
                                                !hasAlreadyJoined(value.rso_id) &&

                                                <div className='join-icon' onClick={(event) => {joinRSO(value.rso_id)}}>
                                                    <AddTaskIcon/>
                                                </div>
                                            }
                                        </div>
                                        <div className='description'>
                                            <b><u>Description</u></b> 
                                            : {value.description}
                                        </div>
                                        <div className='member-count'><b>Member Count:</b> <u>{value.no_members}</u></div>
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
