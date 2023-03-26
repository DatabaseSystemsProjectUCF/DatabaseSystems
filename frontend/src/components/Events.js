/** ----------------------- IMPORTS ----------------------- */
import '../styles/Dashboard.css'
import '../styles/Event.css'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ForumIcon from '@mui/icons-material/Forum';
import SearchIcon from '@mui/icons-material/Search';

import { Grid } from '@mui/material';
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'

import SideBar from './SideBar'
import TopBar from './TopBar'
/** ------------------------------------------------------- */


/**
 * Main function for Events that returns all elements to be shown on Events page
 * 
 * @returns Events Layout
 */
export default function Events() {

    /** MOCK DATA FOR RSO */
    const Events = [
        {
            title: "Event 1",
            description: "This is Event 1 klasjd fkhjas dfjhaslk dfjklha sdkjfhkashd fklhasdu fhiuashd dfkljhsakldf huilwa  kjhskl djfh laksdh fliasgd flkjhas kldfhlasjhdfoiu waiuer klh iuoh daiuf hsaskj dfhjkashd fkljhas fhjklsadhf kajhsdf klhaus ildfguiah sdfj khaskld f klsahd flkjh dflkhas d",
            category: "Tech",
            type: "private",
            date: "2023/06/12",
            time: "12:01:02",
            phone: "4568931521",
            email: "tech@ucf.edu",
            name_loc: "Downtown orlando",
            lat: 2.456,
            long: 5.632
        },
        {
            title: "Event 2",
            description: "This is Event 2",
            category: "Med",
            type: "private",
            date: "2023/06/12",
            time: "12:01:02",
            phone: "4568931521",
            email: "tech@ucf.edu",
            name_loc: "Downtown orlando",
            lat: 2.456,
            long: 5.632
        },
        {
            title: "Event 3",
            description: "This is Event 3",
            category: "Bio",
            type: "private",
            date: "2023/06/12",
            time: "12:01:02",
            phone: "4568931521",
            email: "tech@ucf.edu",
            name_loc: "Downtown orlando",
            lat: 2.456,
            long: 5.632
        },
        {
            title: "Event 4",
            description: "This is Event 4",
            category: "Sec",
            type: "private",
            date: "2023/06/12",
            time: "12:01:02",
            phone: "4568931521",
            email: "tech@ucf.edu",
            name_loc: "Downtown orlando",
            lat: 2.456,
            long: 5.632
        },
        {
            title: "Event 5",
            description: "This is Event 5",
            category: "Rel",
            type: "private",
            date: "2023/06/12",
            time: "12:01:02",
            phone: "4568931521",
            email: "tech@ucf.edu",
            name_loc: "Downtown orlando",
            lat: 2.456,
            long: 5.632
        },
        {
            title: "Event 6",
            description: "This is Event 6",
            category: "Concert",
            type: "private",
            date: "2023/06/12",
            time: "12:01:02",
            phone: "4568931521",
            email: "tech@ucf.edu",
            name_loc: "Downtown orlando",
            lat: 2.456,
            long: 5.632
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

    const mockComments = [
        {
            studentName: 'Dani',
            rating: '9/10',
            content: 'I absolutely loved this event'
        },
        {
            studentName: 'Juan',
            rating: '8/10',
            content: 'I loved this event'
        },
        {
            studentName: 'Usman',
            rating: '7/10',
            content: 'I liked this event'
        }
    ]

    /** useRefs for Event Creation */
    const createEventCatRef = useRef()
    const createEventDescRef = useRef()
    const createEventLatRef = useRef()
    const createEventLocRef = useRef()
    const createEventLongRef = useRef()
    const createEventNameRef = useRef()
    const createEventPhoneRef = useRef()
    const createEventTypeRef = useRef()
    const createEventRSOLink = useRef()

    /** useRefs for Comment Creation */
    const createCommentContentRef = useRef()
    const createCommentRatingRef = useRef()

    /** useRefs fro Editing Comment */
    const editCommentContentRef = useRef()
    const editCommentRatingRef = useRef()

    /** Rest of useRefs, useStates for Events Page */
    const NUMBEROFITEMSPERPAGE = 8

    const searchString = useRef()

    const [error, setError] = useState('')
    const [commentError, setCommentError] = useState('')
    const [isCreateCommentOpen, setIsCreateCommentOpen] = useState(false)
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
    const [isEditCommentOpen, setIsEditCommentOpen] = useState(false)
    const [isRSOCreation, setISRSOCreation] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageCards, setPageCards] = useState([])
    const [search, setSearch] = useState('')
    const [comments, setComments] = useState([])
    const [showComment, setShowComment] = useState(false)
    const [commentEvent, setCommentEvent] = useState(null)

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

        // Handle Search
        if(search !== '') {

            // Find the element, if it exists, find its index and display only that card
            let idx = Events.findIndex(element => element.title.toLowerCase() === search.toLowerCase())
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

        spliced = Events.slice(startidx, endidx)
            
        setPageCards(spliced)
    
    }, [pageNumber, search])

    /**
     * 
     * Sets Comments for that particular event by utilizing the
     *  event/get_comments API.
     * 
     */
    useEffect(() => {

        setComments(mockComments)
        
    }, [showComment])

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
     * Closes the Event Create Modal
     * 
     * @param {*} event - Close Events Create Event 
     */
    function handleEventCreateClose(event) {
        setIsCreateEventOpen(false)
        setISRSOCreation(false)
    }

    /**
     * 
     * Closes the Comment Create Modal
     * 
     * @param {*} event - Close Comment Create Event 
     */
    function handleCommentCreateClose(event) {
        setIsCreateCommentOpen(false)
    }

    /**
     * 
     * Closes the Comment edit Modal
     * 
     * @param {*} event - Close Comment Edit Event
     */
    function handleCommentEditClose(event) {
        setIsEditCommentOpen(false)
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
     * On Create Event Button click, sends a create Event
     *  request to the /events/create API.
     * 
     * @param {*} event - Submit Event Creation Form
     */
    async function createEvent(event) {
        event.preventDefault()

        // Phone No regex
        const phonereg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/

        // Lat/Long regex
        const latreg = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
        const longreg = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/

        // ERROR HANDLING
        if(createEventCatRef.current.value === '' || createEventDescRef.current.value === '' || createEventLatRef.current.value === '' || 
            createEventLocRef.current.value === '' || createEventLongRef.current.value === '' || createEventNameRef.current.value === '' || 
             createEventPhoneRef.current.value === '' || createEventTypeRef.current.value === '')
                return setError("None of the entries can be empty!")
        if(!latreg.test(createEventLatRef.current.value))
            return setError("Latitude is not in a valid format.")
        if(!longreg.test(createEventLongRef.current.value))
            return setError("Longitude is not in a valid format.")
        if(!phonereg.test(createEventPhoneRef.current.value))
            return setError("Phone Number is not in a valid format.")
        if(createEventTypeRef.current.value === 'rso'){
            let idx = RSOs.findIndex(element => element.title.toLowerCase() === createEventRSOLink.current.value.toLowerCase())
            if(idx === -1)
                return setError('RSO Type does not have a valid RSO Name!')
        }

        // Date Timestamp
        var date = new Date().toJSON().slice(0, 10);
        var time = new Date().toJSON().slice(11, 19);

        console.log(createEventCatRef.current.value) 
        console.log(createEventDescRef.current.value)
        console.log(createEventLatRef.current.value)
        console.log(createEventLocRef.current.value)
        console.log(createEventLongRef.current.value)
        console.log(createEventNameRef.current.value)
        console.log(createEventPhoneRef.current.value)
        console.log(createEventTypeRef.current.value)
        if(createEventTypeRef.current.value === 'rso')
            console.log(createEventRSOLink.current.value)
        console.log(date)
        console.log(time)

        handleEventCreateClose()
    }
    
    /**
     * 
     * Handles Comment Creation by linking with the 
     *  event/create_comment API
     * 
     * @param {*} event - Create a Comment event clicked
     */
    async function createComment(event) {
        event.preventDefault()

        // RegEx for ratings
        const ratingRegEx = /^\d+$/

        // ERROR HANDLING
        if(createCommentRatingRef.current.value === '' || createCommentContentRef.current.value === '')
            return setCommentError('None of the fields can be empty!')
        if(!ratingRegEx.test(createCommentRatingRef.current.value))
            return setCommentError('Rating should be a single digit between 0-10')

        console.log(createCommentContentRef.current.value)
        console.log(createCommentRatingRef.current.value)

        handleCommentCreateClose()
    }

    /**
     * 
     * Edits a comment
     * 
     * @param {*} event - Edits a comment
     */
    async function editComment(event){
        event.preventDefault()

        // RegEx for ratings
        const ratingRegEx = /^\d+$/

        // ERROR HANDLING
        if(createCommentRatingRef.current.value === '' || createCommentContentRef.current.value === '')
            return setCommentError('None of the fields can be empty!')
        if(!ratingRegEx.test(createCommentRatingRef.current.value))
            return setCommentError('Rating should be a single digit between 0-10')

        console.log(createCommentContentRef.current.value)
        console.log(createCommentRatingRef.current.value)

        handleCommentEditClose()
    }

    async function deleteComment(name) {
        console.log("Deleting: ", name)

    }

    /**
     * 
     * Sends a join Event request to the backend
     * 
     * @param {*} title - Title of the Event
     */
    function joinEvent(title) {
        console.log('Joining ', title)
    }

    // Return Events elements to be displayed
    return (
        <div className='Dashboard'>
            <SideBar />
            <TopBar />

            {/** Event Section of the page */}
            <div className='Event'>
                { !showComment &&
                    <div style={{width: '100%', height: '100%'}}> 

                        {/** Search Component */}
                        <Form className='Search rounded border border-1 border-dark' onSubmit={handleSearch}>

                            <Form.Control
                                ref={searchString} 
                                placeholder="Search Event by name...">
                            </Form.Control>

                            <Button variant='dark' className='button rounded' type='submit'><SearchIcon /></Button>
                        </Form>

                        {/** Button to Open the Create Event Modal */}
                        <Button className='create-button' variant='dark' onClick={() => {setIsCreateEventOpen(true); setError('')}}><AddCircleOutlineIcon /> Create Event</Button>
                        
                        {/** Create Event Modal */}
                        <Modal className="modal rounded" show={isCreateEventOpen} onHide={handleEventCreateClose}>
                            <Modal.Body>
                                <h2 className='text-center'>Create Event</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={createEvent}>
                                    {/** Name Section */}
                                    <Form.Group id='name'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control ref={createEventNameRef} placeholder="Enter Event Name..."/>
                                    </Form.Group>
                                    
                                    {/** Description Section */}
                                    <Form.Group id='description'>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control ref={createEventDescRef} placeholder="Enter Event Description..."/>
                                    </Form.Group>

                                    {/** Category Section */}
                                    <Form.Group id='category'>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Control ref={createEventCatRef} placeholder="Enter Event Category..."/>
                                    </Form.Group>
                                    
                                    {/** Type Section */}
                                    <Form.Group id='type'>
                                        <Form.Label>Type</Form.Label>
                                        <select className="form-control" name="city" ref={createEventTypeRef} onChange={() => {createEventTypeRef.current.value === 'rso' ? setISRSOCreation(true) : setISRSOCreation(false)}}>
                                            <option disabled selected>Select Type...</option>
                                            <option value="private">Private</option>
                                            <option value="public">Public</option>
                                            <option value="rso">RSO</option>
                                        </select>
                                    </Form.Group>

                                    {/** RSO ID */}
                                    { isRSOCreation && 
                                        <Form.Group id='rso-id'>
                                            <Form.Label>RSO Name</Form.Label>
                                            <Form.Control ref={createEventRSOLink} placeholder="Enter the RSO Name..." />
                                        </Form.Group>
                                    }
                                    
                                    {/** Phone Section */}
                                    <Form.Group id='phone'>
                                        <Form.Label>Phone No.</Form.Label>
                                        <Form.Control ref={createEventPhoneRef} placeholder="Enter Phone No..."/>
                                    </Form.Group>
                                    
                                    {/** Location Name */}
                                    <Form.Group id='location-name'>
                                        <Form.Label>Location Name</Form.Label>
                                        <Form.Control ref={createEventLocRef} placeholder="Enter Location Name..."/>
                                    </Form.Group>

                                    {/** Latitude */}
                                    <Form.Group id=''>
                                        <Form.Label>Latitude</Form.Label>
                                        <Form.Control ref={createEventLatRef} placeholder="Enter Location Latitude..."/>
                                    </Form.Group>

                                    {/** Longitude */}
                                    <Form.Group id=''>
                                        <Form.Label>Longitude</Form.Label>
                                        <Form.Control ref={createEventLongRef} placeholder="Enter Location Longitude..."/>
                                    </Form.Group>

                                    <Button variant='dark' className='w-100 mt-3' type="submit">Create Event</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/** Page Number and Title Bar */}
                        <div className='page-bar'>
                            <div className='title'>Events</div>
                            <div className='right-arrow button' onClick={nextPage}><ArrowForwardIosIcon/></div>
                            <div className='page-no'>Page {pageNumber}</div>
                            <div className='left-arrow button' onClick={previousPage}><ArrowBackIosNewIcon/></div>\
                        </div>

                        {/** Event Cards */}
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='Event-cards'>
                            {pageCards.map((value, key) => {
                                return (
                                    <Grid item key={key} xs={2.95} className='cards rounded'>
                                        <div style={{borderBottom: '1px solid white', width: '90%'}}>
                                            <div className='title'>
                                                {value.title}
                                                <div className='type'>{value.type.toUpperCase()}</div>
                                            </div>
                                        </div>
                                        <div className='description'>
                                            <b><u>Description</u></b> 
                                            : {value.description}
                                        </div>
                                        <div className='category'><b><u>Category</u></b>: {value.category} </div>
                                        <div className='location'><b><u>Where</u></b>: {value.name_loc} ({value.lat} {value.long})</div>
                                        <div className='location'><b><u>When</u></b>: {value.date} {value.time}</div>
                                        <div className='email'><b><u>Email</u></b>: {value.email}</div>
                                        <div className='email'><b><u>Phone</u></b>: {value.phone}</div>
                                        <div className='comment-icon' onClick={() => {setShowComment(true); setCommentEvent(value)}}><ForumIcon/></div>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </div>
                }

                { showComment &&
                    <div style={{width: '100%', height: '100%'}}> 

                        {/** Search Component */}
                        <Form className='Search rounded border border-1 border-dark' onSubmit={handleSearch}>

                            <Form.Control
                                ref={searchString} 
                                placeholder="Search Event by name...">
                            </Form.Control>

                            <Button variant='dark' className='button rounded' type='submit'><SearchIcon /></Button>
                        </Form>

                        {/** Button to Open the Create Event Modal */}
                        <Button className='create-button' variant='dark' onClick={() => {setIsCreateEventOpen(true); setError('')}}><AddCircleOutlineIcon /> Create Event</Button>
                        
                        {/** Create Event Modal */}
                        <Modal className="modal rounded" show={isCreateEventOpen} onHide={handleEventCreateClose}>
                            <Modal.Body>
                                <h2 className='text-center'>Create Event</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={createEvent}>
                                    {/** Name Section */}
                                    <Form.Group id='name'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control ref={createEventNameRef} placeholder="Enter Event Name..."/>
                                    </Form.Group>
                                    
                                    {/** Description Section */}
                                    <Form.Group id='description'>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control ref={createEventDescRef} placeholder="Enter Event Description..."/>
                                    </Form.Group>

                                    {/** Category Section */}
                                    <Form.Group id='category'>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Control ref={createEventCatRef} placeholder="Enter Event Category..."/>
                                    </Form.Group>
                                    
                                    {/** Type Section */}
                                    <Form.Group id='type'>
                                        <Form.Label>Type</Form.Label>
                                        <select className="form-control" name="city" ref={createEventTypeRef} onChange={() => {createEventTypeRef.current.value === 'rso' ? setISRSOCreation(true) : setISRSOCreation(false)}}>
                                            <option disabled selected>Select Type...</option>
                                            <option value="private">Private</option>
                                            <option value="public">Public</option>
                                            <option value="rso">RSO</option>
                                        </select>
                                    </Form.Group>

                                    {/** RSO ID */}
                                    { isRSOCreation && 
                                        <Form.Group id='rso-id'>
                                            <Form.Label>RSO Name</Form.Label>
                                            <Form.Control ref={createEventRSOLink} placeholder="Enter the RSO Name..." />
                                        </Form.Group>
                                    }
                                    
                                    {/** Phone Section */}
                                    <Form.Group id='phone'>
                                        <Form.Label>Phone No.</Form.Label>
                                        <Form.Control ref={createEventPhoneRef} placeholder="Enter Phone No..."/>
                                    </Form.Group>
                                    
                                    {/** Location Name */}
                                    <Form.Group id='location-name'>
                                        <Form.Label>Location Name</Form.Label>
                                        <Form.Control ref={createEventLocRef} placeholder="Enter Location Name..."/>
                                    </Form.Group>

                                    {/** Latitude */}
                                    <Form.Group id=''>
                                        <Form.Label>Latitude</Form.Label>
                                        <Form.Control ref={createEventLatRef} placeholder="Enter Location Latitude..."/>
                                    </Form.Group>

                                    {/** Longitude */}
                                    <Form.Group id=''>
                                        <Form.Label>Longitude</Form.Label>
                                        <Form.Control ref={createEventLongRef} placeholder="Enter Location Longitude..."/>
                                    </Form.Group>

                                    <Button variant='dark' className='w-100 mt-3' type="submit">Create Event</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/** Create Comment Modal */}
                        <Modal className="modal rounded" show={isCreateCommentOpen} onHide={handleCommentCreateClose}>
                            <Modal.Body>
                                <h2 className='text-center'>Add a Comment</h2>
                                {commentError && <Alert variant="danger">{commentError}</Alert>}
                                <Form onSubmit={createComment}>
                                    {/** Name Section */}
                                    <Form.Group id='name'>
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control ref={createCommentRatingRef} placeholder="Enter a Rating..."/>
                                    </Form.Group>
                                    
                                    {/** Description Section */}
                                    <Form.Group id='description'>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control ref={createCommentContentRef} placeholder="Enter a Comment..."/>
                                    </Form.Group>

                                    <Button variant='dark' className='w-100 mt-3' type="submit">Add Comment</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/** Edit Comment Modal */}
                        <Modal className="modal rounded" show={isEditCommentOpen} onHide={handleCommentEditClose}>
                            <Modal.Body>
                                <h2 className='text-center'>Edit Comment</h2>
                                {commentError && <Alert variant="danger">{commentError}</Alert>}
                                <Form onSubmit={editComment}>
                                    {/** Name Section */}
                                    <Form.Group id='name'>
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control ref={editCommentRatingRef} placeholder="Enter a Rating..."/>
                                    </Form.Group>
                                    
                                    {/** Description Section */}
                                    <Form.Group id='description'>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control ref={editCommentContentRef} placeholder="Enter a Comment..."/>
                                    </Form.Group>

                                    <Button variant='dark' className='w-100 mt-3' type="submit">Submit</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/** Page Number and Title Bar */}
                        <div className='page-bar'>
                            <div className='back-icon'><ArrowBackIcon style={{fontSize: '40px', alignContent: 'center', justifyContent: 'center'}} onClick={() => {setShowComment(false); setCommentEvent(null)}}/></div>
                            <div className='title'>{commentEvent.title}</div>
                            <Button className='add-comment' variant='dark' onClick={() => {setIsCreateCommentOpen(true); setCommentError('')}}><AddCircleOutlineIcon /> Add Comment</Button>
                        </div>

                        {/** Comment Rows */}
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='comment-rows'>
                            {comments.map((value, key) => {
                                return (
                                    <div className='comment'>
                                        <div className='name'>
                                            <b><u>Name</u></b>: {value.studentName}
                                            <div className='rating'>
                                                <b><u>Rating</u></b>: {value.rating}
                                            </div>
                                            <div>
                                                <EditIcon className='edit-icon' onClick={() => {setIsEditCommentOpen(true) }}/>
                                            </div>
                                            <div>
                                                <DeleteForeverIcon style={{marginLeft: '200%', right: '0%'}} onClick={() => {deleteComment(value.studentName)}}/>
                                            </div>
                                        </div>
                                        <div className='content'>
                                            <b><u>Comment</u></b>: {value.content}
                                        </div>
                                    </div>
                                )
                            })}
                        </Grid>
                    </div>
                }
            </div>
        </div>
    )
}
