    /** ----------------------- IMPORTS ----------------------- */
    import axios from 'axios'
    import { AUTHLEVEL, EMAIL, FIRSTNAME, ID, LASTNAME } from '../constants/DatabaseConstants';
    import background from '../images/ucf_campus.jpg'
    import React, { useRef, useState } from 'react'
    import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
    import { Link, useNavigate } from 'react-router-dom';
    /** ------------------------------------------------------- */


    /**
     * Main function for Dashboard that returns all elements to be shown on Dashboard
     * 
     * @returns Dashboard Layout
     */
    export default function Login() {

        // Login Form refs and useStates
        const emailRef = useRef()
        const passwordRef = useRef()
        const [error, setError] = useState('')
        const [success, setSuccess] = useState('')
        const [loading, setLoading] = useState(false)

        // useNavigate instance
        const navigate = useNavigate()

        /**
         * Function to handle Login Submit
         * 
         */
        async function handleSubmit(e){
            e.preventDefault()

            try{
                setError('')
                setLoading(true)

                //console.log(emailRef.current.value)
                //console.log(passwordRef.current.value)

                // Call the Login API
                axios.get(`http://localhost:8800/user/login?email=${emailRef.current.value}&password=${passwordRef.current.value}`
                
                ).then((response) => {

                    console.log(response)

                    // Populate browser with the returned User
                    localStorage.setItem(AUTHLEVEL, response.data.user.level_id)
                    localStorage.setItem(FIRSTNAME, response.data.user.first_name)
                    localStorage.setItem(LASTNAME, response.data.user.last_name)
                    localStorage.setItem(ID, response.data.user.id)
                    localStorage.setItem(EMAIL, response.data.user.email)

                    // Populate browser with the returned User

                    setSuccess('Login Successful! Redirecting to Dashboard...')
                    setTimeout(function(){navigate('/')}, 1000)

                }).catch((auth_error) => {

                    // If the user does not exist or passwords do not match
                    if(auth_error.response.status === 401){
                        setError('User not found or Invalid password')
                        console.log(auth_error.response.data)
                    }
                    // If there's an internal db error
                    if(auth_error.response.status === 403){
                        setError("There's been an internal error, please try again.")
                        console.log(auth_error.response.data)
                    }

                })
            }
            catch (err) {
                setError(err)
            }

            setLoading(false)
        }

        // Return Login elements to be displayed
        return (

            <div>

                {/** Background Image */}
                <div style={{backgroundImage: `url(${background})`, height: '100vh', width:'100vw', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity:'65%'}}> </div>

                {/** Title and Group Members */}
                <Container className= "rounded-5 border border-2 border-light text-center" style={{display:'flex', position: 'fixed', left: '125px', bottom: '15%', height:'200px', width: '750px', backgroundColor:'#000000'}}>
                    
                    {/** Title */}
                    <Card className="border-0" style={{top:'33px', backgroundColor: 'rgba(255,255,255,0)', fontWeight: 'bold', fontSize: '38px', color:'#BA9B37', width:'100%'}}>
                        Welcome to University Event Database
                    </Card>

                    <div style={{width: '85%', height:'1px', backgroundColor: '#BA9B37', position: 'absolute', top: '125px', left:'7.5%'}}></div>

                    {/** Group Members */}
                    <Card className="border-0" style={{position:'absolute', top:'150px', backgroundColor: 'rgba(255,255,255,0)', fontWeight: 'bold', color:'#BA9B37', fontSize: '14px', width:'100%'}}>
                        By: Daniela, Juan, Usman
                    </Card>
                </Container>

                {/** Login Component */}
                <Container style = {{ display:'flex', position: 'fixed', right: '50px', bottom: '100px', width:'500px', flexDirection: 'row'}}>

                    {/** Display Error if it exists */}
                    {error && <Alert variant="danger"> {error} </Alert>}

                    {/** Display Success if it exists */}
                    {success && <Alert variant="success"> {success} </Alert>}
                    
                    {/** Login Card */}
                    <Card className="rounded-5 border border-5 border-light" style={{ height:'450px', width:'500px', backgroundColor:'#000000'}}>

                        {/** Card Body */}
                        <Card.Body>

                            {/** Login Main Display */}
                            <h2 className="text-center mt-5" style={{color:'#ffffff', fontSize:'25px'}}>Sign Into Your Account</h2>
                            
                            {/** Handle Submit */}
                            <Form onSubmit={handleSubmit}>

                            {/** Email Section */}
                            <Form.Group id="email">
                                <Form.Label className="mt-4" style={{fontWeight:'bold', color:'#ffffff', position:'relative', top:'10px'}}>EMAIL</Form.Label>
                                <Form.Control 
                                    className="square border border-1 border-dark mt-2" 
                                    type="email" 
                                    ref={emailRef} 
                                    style={{backgroundColor:'#f2ecd9'}}
                                    placeholder="Enter your email...">
                                </Form.Control>
                            </Form.Group>

                            {/** Password Section */}
                            <Form.Group id="password">
                                <Form.Label className="mt-3" style={{fontWeight:'bold', color:'#ffffff'}}>PASSWORD</Form.Label>
                                <Form.Control 
                                    className="square border border-1 border-dark" 
                                    type="password" 
                                    ref={passwordRef} 
                                    style={{backgroundColor:'#f2ecd9'}}
                                    placeholder="Enter your password...">
                                </Form.Control>
                            </Form.Group>

                            {/** Login Button */}
                            <Button disabled={loading} 
                                className="square border border-0 w-100 mt-2" 
                                type="submit" 
                                style={{position:'relative', top:'30px', backgroundColor:'#BA9B37'}}>
                                    Log In
                            </Button>

                            {/* link to signup if account doesn't exist yet */}
                            <div className="w-100 text-center mt-5" style={{color:'#ffffff'}}>
                                Need an Account? <Link to='/Signup' style={{fontStyle:'italic', fontWeight:'bold', color:'#ffffff'}}>Sign Up</Link>
                            </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }
